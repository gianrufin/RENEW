# RENEW. — Household Maintenance & Alert Scheduler (Native Android APK & Web)

A household maintenance scheduler crafted with a **Bold Typography (Brutalist)** aesthetic, dual recurrence scheduling, Room SQLite offline database, QR appliance barcode scanning, annual cost forecasting, and an actionable daily morning briefing.

---

## 📱 Live Web & Instant Installable WebAPK

- **Live Web App**: [https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)
- **Development App**: [https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)

> ### ⚡ Instant 1-Tap Android WebAPK Installation
> 1. Open the **Live Web App** link in **Google Chrome** on your Android device.
> 2. Tap the **Three Dots (⋮)** menu in Chrome.
> 3. Tap **"Install app"** / **"Add to Home screen"**.
> 4. Chrome will instantly generate and install a native **WebAPK** onto your Android phone with an app icon in your app drawer, standalone full-screen window, and full offline caching.

---

## 🤖 Official Native Android App (Kotlin + Jetpack Compose)

The complete native Android Studio source code is located in the **`/android`** directory of this repository.

### 📦 Project Architecture
- **Language**: Kotlin 1.9+
- **UI Toolkit**: Jetpack Compose with Material 3 & Bold Typography
- **Database**: Android Room SQLite (100% offline, zero cloud account required)
- **Background Tasks**: AndroidX WorkManager (for 24h periodic morning briefing reminders)
- **Hardware Integration**: CameraX & Google ML Kit Barcode Scanning for physical QR appliance tags

### 🛠️ How to Build the `.apk` File

#### Option 1: Open in Android Studio (Recommended)
1. Export/Download the project as a **ZIP** (or clone the repository via Git) from the AI Studio Settings menu.
2. Open **Android Studio** (Hedgehog, Iguana, or Jellyfish).
3. Click **File → Open** and select the **`android`** folder.
4. Let Gradle sync dependencies.
5. In the top menu, go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
6. Android Studio will generate the installable debug APK at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
7. Transfer `app-debug.apk` to your Android device and tap to install!

#### Option 2: Command Line (Gradle)
```bash
cd android
./gradlew assembleDebug
```
The compiled APK will be created at `app/build/outputs/apk/debug/app-debug.apk`.

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
