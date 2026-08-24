# Where's My Stuff?

A modern, mobile-first React app for remembering where you put everyday items. Everything — items, photos, reminders, and settings — is stored locally in your browser's `localStorage`. There is no backend and nothing is ever uploaded anywhere.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Features

- **Dashboard** with recently added items, frequently used locations, and smart suggestions
- **Add / edit items** with name, location, description, optional photo, and optional reminder
- **Natural-language search** ("where is my calculator?", "blue drawer", "things in my backpack")
- **Item detail view** with photo, full description, and quick edit/delete
- **Locations** section that groups items by where they're stored
- **Reminders** section listing upcoming and past reminders
- **Settings**: dark mode, export data as JSON, import data from JSON, clear all data
- Responsive: bottom navigation on mobile, sidebar navigation on desktop

## Notes on photos

Photos are read directly from your device's file picker/camera and stored as base64 image data inside `localStorage` — they are never uploaded to a server or database. Because `localStorage` has limited capacity (usually a few MB per browser), avoid adding a large number of very high-resolution photos.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Lucide React icons
- `localStorage` for persistence (no backend)

## Building an Android APK

The app is wrapped as a native Android app with [Capacitor](https://capacitorjs.com/), so it runs in a WebView with the same `localStorage` persistence, but installs like a normal app.

**Automatically, via GitHub Actions:**

1. Push this project to a GitHub repository.
2. Go to the **Actions** tab → **Build APK** → **Run workflow** (or just push to `main`).
3. When it finishes, download the `wheres-my-stuff-debug-apk` artifact — it contains `app-debug.apk`, installable on any Android device with "install from unknown sources" allowed.

The workflow (`.github/workflows/build-apk.yml`) builds the web app, generates the native Android project with Capacitor, and assembles a debug APK — no local Android Studio setup required.

**Locally, if you have Android Studio / the Android SDK installed:**

```bash
npm install
npm run build
npx cap add android      # first time only
npx cap sync android
cd android
./gradlew assembleDebug  # outputs app/build/outputs/apk/debug/app-debug.apk
```

This produces a **debug** APK, meant for testing/sideloading. Publishing to the Play Store requires a signed **release** build with your own keystore, which isn't set up here.
