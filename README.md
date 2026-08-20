# RENEW. — Household Maintenance & Alert Scheduler (Native Android APK & Web)

A household maintenance scheduler crafted with a **Bold Typography (Brutalist)** aesthetic, dual recurrence scheduling, Room SQLite offline database, QR appliance barcode scanning, annual cost forecasting, and an actionable daily morning briefing.

---

## ⚡ 1. GitHub Actions Automated APK Builder & Repository Hosting

This repository is equipped with an automated **GitHub Actions CI/CD pipeline** (`.github/workflows/build-apk.yml`) that compiles the native Android app and hosts the installable `.apk` file directly on GitHub.

### 📥 Where to Download the Built APK from GitHub:
1. **GitHub Releases (Direct Link)**:
   - Go to your repository's **Releases** tab on GitHub:
     `https://github.com/<YOUR_USER>/<YOUR_REPO>/releases`
   - Download the latest **`RENEW-Household-Maintenance.apk`**.
   - Tap the `.apk` on your Android device to install!

2. **GitHub Actions Artifacts**:
   - Go to the **Actions** tab on your GitHub repository.
   - Click on the latest **"Build & Host Android APK"** run.
   - Under **Artifacts**, download **`RENEW-Household-Maintenance-APK`**.

### 🚀 How the Pipeline Works:
- **On Every Push**: Every commit pushed to `main` / `master` runs the workflow on `ubuntu-latest`, sets up Java 17, installs the Android SDK, and executes `./gradlew assembleDebug`.
- **Automatic Release Hosting**: The workflow automatically publishes or updates the **GitHub Release** tagged `latest` (or the specific version tag `v1.0.0`, etc.) and attaches the universal APK asset.
- **Manual Trigger**: You can also trigger a fresh APK build on demand by going to **Actions → Build & Host Android APK → Run workflow**.

---

## 📱 2. Instant 1-Tap WebAPK Installation (Zero Build Required)

- **Live Web App**: [https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)
- **Development App**: [https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)

> ### ⚡ Install directly in Chrome on Android:
> 1. Open the **Live Web App** link in **Google Chrome** on your Android phone.
> 2. Tap the **Three Dots (⋮)** menu.
> 3. Tap **"Install app"** / **"Add to Home screen"**.
> 4. Android installs the standalone **WebAPK** onto your phone with an app icon in your app drawer, full offline caching, and full-screen window.

---

## 🤖 3. Native Android Kotlin Source Code Structure (`/android`)

The complete native Android Studio source code is located in the **`/android`** directory:

- **Language & Framework**: Kotlin 1.9+, Android SDK 34 (Android 14)
- **UI Toolkit**: Jetpack Compose with Material 3 & Bold Typography
- **Database**: AndroidX **Room SQLite** (100% offline, zero cloud account required)
- **Background Worker**: AndroidX **WorkManager** (`DailyReminderWorker`) for 24h periodic notifications
- **Hardware Integration**: **CameraX** + **Google ML Kit Barcode Scanning** for physical QR appliance tags

### Building Locally with Android Studio / Gradle:
```bash
cd android
./gradlew assembleDebug
```
The compiled APK will be created at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## ✨ Features Breakdown

1. **Dual Recurrence Modes**:
   - **Exact Date**: Critical tasks (HVAC air filters, synthetic car oil, pet chew tablets).
   - **This Week Routines**: Flexible weekly targets (wash bed sheets, smoke alarm tests) without day-of-week pressure.
2. **Actionable Morning Briefing (Splash Screen)**:
   - Full-screen summary on launch highlighting overdue items and today's schedule with 1-click **Complete** and **+3-Day Snooze**.
3. **QR Appliance Asset Tagging & Scanner**:
   - Generate printable QR asset codes and scan them with your phone's camera to immediately record maintenance logs.
4. **Annual Replacement Budget & Cost Planner**:
   - Automatically projects monthly run-rate and annual maintenance expenses across categories.
5. **100% Offline-First Privacy**:
   - Local Room SQLite database storage with zero telemetry or cloud lock-in.
