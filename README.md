# RENEW. — Household Maintenance & Alert Scheduler

A mobile-first, offline-ready household maintenance scheduler designed with a **Bold Typography (Brutalist)** aesthetic, custom recurrence engines, QR asset tagging, annual cost forecasting, and an actionable daily morning briefing.

---

## 📱 Live Application Links

- **Live Web App (Production/Shared)**: [https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)
- **Development Preview**: [https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app](https://ais-dev-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app)

> ### 📲 Installing on Android (PWA / WebAPK)
> To run the app as a standalone Android app with full-screen access, no browser address bar, and offline support:
> 1. Open the **Live Web App URL** in Google Chrome on your Android device:
>    `https://ais-pre-zjyp6uokj7btok5ltaqc7s-187570358840.asia-east1.run.app`
> 2. Tap the **Three Dots (⋮)** menu in the top-right corner of Chrome.
> 3. Tap **"Install app"** or **"Add to Home screen"**.
> 4. Android will generate and install the standalone **WebAPK** onto your home screen and app drawer with the native app icon and splash screen.

---

## ✨ Key Features

### 1. 📅 Dual Scheduling Engine
- **Exact Date Tasks**: Pinpoint exact due dates for critical maintenance (e.g., car oil changes, vet appointments, water filter replacement).
- **"On This Week" Flexible Routines**: Schedule weekly tasks (e.g., wash bed sheets, smoke alarm test, deep clean bathroom) without arbitrary daily pressure.

### 2. ☀️ Morning Alert Briefing (Daily Splash)
- High-contrast, full-screen morning summary displaying overdue items, today's targets, and this week's routines.
- Quick 1-click **Complete** and **+3-Day Snooze** actions directly from the briefing screen.

### 3. 📷 QR Appliance Asset Tagging & Scanner
- Generate printable QR asset tags for appliances and fixtures (HVAC unit, furnace, refrigerator, vehicle).
- Built-in live camera barcode scanner to scan physical QR codes and immediately log service records or view history.

### 4. 💰 Annual Replacement Budget & Cost Planner
- Automatically calculates monthly and annualized recurring maintenance costs.
- Visual breakdown across categories (Home & Appliances, Automotive, Health & Hygiene, Pets, Safety).

### 5. 🎨 Brutalist OLED Dark & Light Themes
- OLED Dark Mode, Crisp Light Mode, or automatic System OS match.
- Bold typography with Space Grotesk and Plus Jakarta Sans.
- Sound effect chimes upon task completion.

### 6. 🛡️ 100% Offline-First Privacy & Backup
- Zero external database lock-in; stored locally in device storage.
- 1-click **JSON Backup Export & Import** in Settings for safe manual migration across devices.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS (Brutalist / Bold Typography)
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **Backend Server**: Express.js with Node
- **Camera/QR**: HTML5-QRCode scanner

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```
