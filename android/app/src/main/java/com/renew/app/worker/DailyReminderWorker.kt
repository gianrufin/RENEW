package com.renew.app.worker

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.renew.app.MainActivity
import com.renew.app.R
import com.renew.app.RenewApplication
import com.renew.app.data.AppDatabase
import kotlinx.coroutines.flow.first
import java.time.LocalDate

class DailyReminderWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val database = AppDatabase.getDatabase(applicationContext)
        val tasks = database.taskDao().getAllActiveTasks().first()

        val today = LocalDate.now()
        val overdue = tasks.filter {
            try {
                LocalDate.parse(it.nextDueDate).isBefore(today)
            } catch (e: Exception) {
                false
            }
        }
        val dueToday = tasks.filter { it.nextDueDate == today.toString() }

        if (overdue.isNotEmpty() || dueToday.isNotEmpty()) {
            sendNotification(overdue.size, dueToday.size)
        }

        return Result.success()
    }

    private fun sendNotification(overdueCount: Int, dueTodayCount: Int) {
        val intent = Intent(applicationContext, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            applicationContext, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val title = if (overdueCount > 0) {
            "🚨 $overdueCount Overdue Household Items!"
        } else {
            "☀️ Household Maintenance Scheduled Today"
        }

        val contentText = buildString {
            if (overdueCount > 0) append("$overdueCount overdue. ")
            if (dueTodayCount > 0) append("$dueTodayCount due today. ")
            append("Tap to review your morning briefing.")
        }

        val notification = NotificationCompat.Builder(applicationContext, RenewApplication.CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(contentText)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1001, notification)
    }
}
