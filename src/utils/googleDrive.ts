import { MaintenanceTask, GoogleDriveBackupSettings } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

const BACKUP_FILENAME = 'remindme_household_backup.json';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

export async function requestGoogleDriveAccessToken(clientId?: string): Promise<{ accessToken: string; email?: string; expiresIn: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      reject(new Error('Google Identity Services library is not loaded yet. Please check your internet connection.'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId || '971090936819-spotmo.apps.googleusercontent.com', // Configured Project
        scope: DRIVE_SCOPE,
        callback: async (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (response.access_token) {
            let email = '';
            try {
              // Fetch user info for display
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              });
              if (userInfoRes.ok) {
                const info = await userInfoRes.json();
                email = info.email || '';
              }
            } catch (e) {
              console.warn('Could not fetch user profile email', e);
            }

            resolve({
              accessToken: response.access_token,
              email,
              expiresIn: Number(response.expires_in) || 3599
            });
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || 'OAuth popup closed or blocked'));
        }
      });

      client.requestAccessToken();
    } catch (err: any) {
      reject(err);
    }
  });
}

// Search for existing backup file on Google Drive
async function findBackupFile(accessToken: string): Promise<{ id: string; modifiedTime: string } | null> {
  const query = encodeURIComponent(`name = '${BACKUP_FILENAME}' and trashed = false`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)&spaces=drive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to search Google Drive (Status ${response.status})`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return {
      id: data.files[0].id,
      modifiedTime: data.files[0].modifiedTime
    };
  }
  return null;
}

// Upload / Update backup on Google Drive
export async function uploadBackupToDrive(
  tasks: MaintenanceTask[],
  accessToken: string
): Promise<{ fileId: string; backupDate: string; taskCount: number }> {
  const payload = {
    app: 'RemindMe Household Maintenance & Alert Scheduler',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    taskCount: tasks.length,
    tasks
  };

  const backupJsonString = JSON.stringify(payload, null, 2);
  const existing = await findBackupFile(accessToken);

  if (existing) {
    // Update existing file
    const updateRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: backupJsonString
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to update Google Drive backup file');
    }

    return {
      fileId: existing.id,
      backupDate: new Date().toISOString(),
      taskCount: tasks.length
    };
  } else {
    // Create new multipart file
    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: 'application/json',
      description: 'Automatic Daily Backup for RemindMe Household Maintenance & Alert Scheduler'
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      backupJsonString +
      closeDelimiter;

    const createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to create Google Drive backup file');
    }

    const created = await createRes.json();
    return {
      fileId: created.id,
      backupDate: new Date().toISOString(),
      taskCount: tasks.length
    };
  }
}

// Download & Restore backup from Google Drive
export async function downloadBackupFromDrive(accessToken: string): Promise<{ tasks: MaintenanceTask[]; backupDate: string }> {
  const existing = await findBackupFile(accessToken);
  if (!existing) {
    throw new Error('No RemindMe backup file found in your Google Drive.');
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to download backup from Google Drive (${res.status})`);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.tasks)) {
    throw new Error('Invalid backup file structure found on Google Drive.');
  }

  return {
    tasks: data.tasks,
    backupDate: data.exportedAt || existing.modifiedTime
  };
}

// Daily auto-backup checker
export async function checkDailyAutoBackup(
  tasks: MaintenanceTask[],
  settings: GoogleDriveBackupSettings,
  onSuccess: (updatedSettings: GoogleDriveBackupSettings) => void
) {
  if (!settings.autoBackupDaily || !settings.accessToken) {
    return;
  }

  // Check if token expired
  if (settings.tokenExpiresAt && Date.now() > settings.tokenExpiresAt - 60000) {
    console.log('Google Drive token expired, skipping auto-sync until re-authenticated.');
    return;
  }

  // Check if already backed up within the last 24 hours
  if (settings.lastBackupDate) {
    const lastTime = new Date(settings.lastBackupDate).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (Date.now() - lastTime < twentyFourHours) {
      // Already backed up today
      return;
    }
  }

  try {
    const result = await uploadBackupToDrive(tasks, settings.accessToken);
    onSuccess({
      ...settings,
      lastBackupDate: result.backupDate,
      backupFileId: result.fileId
    });
    console.log('Auto-backup to Google Drive succeeded:', result.backupDate);
  } catch (e) {
    console.warn('Daily auto-backup to Google Drive encountered an error:', e);
  }
}
