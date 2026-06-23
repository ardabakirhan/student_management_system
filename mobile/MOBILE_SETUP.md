# Rezonans Etimesgut – Mobile Build Guide

## STEP-BY-STEP SETUP

---

### 1. Install Capacitor + native plugins

Run from inside the project directory:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npm install @capacitor/push-notifications @capacitor/preferences @capacitor/app
npm install @capacitor/status-bar @capacitor/splash-screen @capacitor/local-notifications
```

---

### 2. Initialize Capacitor

```bash
npx cap init "Rezonans Etimesgut" "com.rezonans.etimesgut" --web-dir out
```

When asked about the web asset directory, type `out`.

---

### 3. Build the Next.js static export

```bash
npm run build
```

This produces the `out/` folder containing your entire app as static HTML/JS/CSS.
Capacitor reads this folder as the app bundle.

---

### 4. Add native platforms

```bash
npx cap add android
npx cap add ios
```

> iOS requires macOS + Xcode 14+. Android can be added on any OS.

---

### 5. Apply native configuration patches

#### Android — `android/app/src/main/AndroidManifest.xml`

Replace the entire file with the content shown in `android-manifest-patch.xml` (included in the project root).
Key additions:
- `POST_NOTIFICATIONS`, `VIBRATE`, `RECEIVE_BOOT_COMPLETED` permissions
- Deep link intent-filter for `rezonans://app`

#### iOS — `ios/App/App/Info.plist`

Add all the `<key>` blocks from `ios-info-plist-patch.xml` into the existing root `<dict>`.
Key additions:
- `UIBackgroundModes` (remote-notification)
- `CFBundleURLTypes` (rezonans scheme)
- `NSUserNotificationUsageDescription`

#### iOS — `ios/App/App/AppDelegate.swift`

Replace the file with `ios-appdelegate-patch.swift`.
This wires Capacitor's push notification delegates and the URL open handler.

---

### 6. Android version & bundle config

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.rezonans.etimesgut"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

---

### 7. iOS version & bundle config

Open `ios/App/App.xcworkspace` in Xcode:
- Bundle Identifier: `com.rezonans.etimesgut`
- Display Name: `Rezonans Etimesgut`
- Version: `1.0.0`
- Build: `1`
- Deployment Target: iOS 14.0+
- Signing: select your team in "Signing & Capabilities"

---

### 8. App icons & splash screens

Place these source files in a `resources/` folder (1024×1024 PNG for icon, 2732×2732 PNG for splash):

```
resources/
  icon.png       ← 1024×1024, no transparency (brand purple #581c87 background)
  splash.png     ← 2732×2732, centered logo on #581c87 background
```

Then run:

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --ios --android
```

This auto-generates all required icon and splash sizes for both platforms.

---

### 9. Sync and open native IDEs

```bash
npx cap sync
npx cap open android    # opens Android Studio
npx cap open ios        # opens Xcode (macOS only)
```

---

### 10. Build for device / store

#### Android (debug APK for testing):
In Android Studio → Build → Build APK  
Or via CLI: `cd android && ./gradlew assembleDebug`

#### Android (release AAB for Play Store):
`cd android && ./gradlew bundleRelease`  
Then sign with your keystore.

#### iOS (device or TestFlight):
In Xcode → Product → Archive → Distribute App

---

## WORKFLOW FOR FUTURE CHANGES

Every time you edit code:

```bash
npm run build        # rebuild static export
npx cap sync         # sync to native projects
# then rebuild in Android Studio / Xcode
```

---

## STEP-BY-STEP TESTING GUIDE

### Web browser (fastest iteration)

```bash
npm run dev
# Open http://localhost:3000
```

Test all roles: Admin (`admin@rezonans.com` / `Admin123!`), Teacher (`selin@rezonans.com` / `Teacher123!`), Parent (`fatma@rezonans.com` / `Veli123!`).

### Android emulator

1. Open Android Studio → create an AVD (API 34, Pixel 7 profile recommended)
2. `npx cap run android` — builds and deploys to the running emulator
3. Test deep links via adb:
   ```bash
   adb shell am start -a android.intent.action.VIEW \
     -d "rezonans://app/evaluations" com.rezonans.etimesgut
   ```

### iOS simulator (macOS only)

1. `npx cap run ios` — opens in simulator
2. Test deep links via simctl:
   ```bash
   xcrun simctl openurl booted "rezonans://app/messages"
   ```

### Functional test checklist

| Feature | How to test |
|---------|-------------|
| Login (all roles) | Use demo accounts on login screen |
| Session persistence | Login → close app → reopen → still logged in |
| Veli sees only own child evaluations | Login as Fatma Yılmaz (veli) → Değerlendirmeler |
| Teacher writes evaluation | Login as Selin Arslan → Değerlendirmeler → form |
| Parent messages teacher | Login as veli → Mesajlar → Öğretmen Mesajları → send |
| Admin posts announcement | Login as admin → Duyurular → post |
| Demo lesson booking | Demo page → submit form → see success |
| Product showcase | Vitrin → cards visible, no prices shown |
| Deep link navigation | Use adb/simctl commands above |
| Logout → clears session | Çıkış Yap → reopening shows login |
| Branch program pages | Dashboard → Branşlar summary cards |
| 4 category filter | Students page filter by category |

---

## COMMON ISSUES AND FIXES

### Build fails: "output: export does not support getServerSideProps"

Already fixed — `pages/login.js` had `getServerSideProps` removed. If you see this for another page, remove its `getServerSideProps` export.

### "window is not defined" during build

Capacitor imports are wrapped with `isBrowser()` and dynamic `import()`. If you add new Capacitor code, always guard with:
```js
if (typeof window === "undefined") return;
```

### App shows blank white screen on Android

Cause: `androidScheme` mismatch. Ensure `capacitor.config.json` has `"androidScheme": "https"` and that `android/app/src/main/res/xml/network_security_config.xml` allows cleartext for localhost (Capacitor adds this automatically).

### iOS push notifications not arriving

1. Ensure you have an Apple Developer account with push entitlement
2. In Xcode: Signing & Capabilities → add "Push Notifications"
3. Upload an APN key to your FCM project (for Firebase-based push)
4. Without a real backend, only local notifications work — this is expected

### Deep link doesn't open app (Android)

Run: `adb shell pm get-app-links com.rezonans.etimesgut`  
If unverified, either set `android:autoVerify="false"` or host an `assetlinks.json` at your domain.  
For custom scheme (`rezonans://`) — no domain verification is needed; it should always work.

### Session lost on every app restart (native)

Check that `@capacitor/preferences` is installed. On native, data is written to Keychain (iOS) / EncryptedSharedPreferences (Android). If you're testing on web, it falls back to localStorage.

### "npx cap sync" fails: "No Capacitor project found"

Ensure `capacitor.config.json` is in the project root AND `npx cap init` was already run. The `appId` and `appName` must match what `init` used.

### Splash screen stays permanently

In `_app.js`, `SplashScreen.hide()` is called after native boot. If it hangs, ensure `@capacitor/splash-screen` is installed and `npx cap sync` was run after install.

### StatusBar overlaps content (iOS)

The `globals.css` already adds `padding-top: env(safe-area-inset-top)`. Ensure `capacitor.config.json` has `"overlaysWebView": false` under `StatusBar`. Also verify `viewport-fit=cover` is NOT in your meta viewport (it isn't, by default in Next.js).

---

## BUNDLE IDENTIFIERS AND VERSION MANAGEMENT

| Field | Value |
|-------|-------|
| App ID (Android) | `com.rezonans.etimesgut` |
| Bundle ID (iOS) | `com.rezonans.etimesgut` |
| App Name | `Rezonans Etimesgut` |
| Initial Version | `1.0.0` |
| Android minSdk | 24 (Android 7.0+) |
| iOS Deployment Target | 14.0+ |

### Incrementing versions

Android `versionCode` must increase by at least 1 for each Play Store upload.  
iOS `Build` number must increase for each TestFlight/App Store upload.

---

## PUSH NOTIFICATION PRODUCTION SETUP

When you add a real backend:

1. Create a Firebase project → add Android app → download `google-services.json` → place in `android/app/`
2. Add iOS app in Firebase → download `GoogleService-Info.plist` → add to `ios/App/App/` in Xcode
3. Add Firebase messaging dependency to `android/app/build.gradle`
4. Your backend receives the FCM token (logged in console as `[Rezonans] Push token: ...`)
5. Backend sends push payload with `data: { route: "/messages" }` so tapping the notification navigates correctly

---

## PLAY STORE SUBMISSION CHECKLIST

- [ ] `versionCode` incremented in `build.gradle`
- [ ] Signed release AAB with your keystore
- [ ] App icon generated (512×512 PNG for Play Store listing)
- [ ] Feature graphic 1024×500 PNG
- [ ] Screenshots for phone and tablet
- [ ] `targetSdkVersion 34` (required for new submissions)
- [ ] Privacy policy URL (required)

## APP STORE SUBMISSION CHECKLIST

- [ ] Bundle version incremented
- [ ] Provisioning profile and certificates set up
- [ ] App Privacy details filled in App Store Connect
- [ ] Screenshots for 6.5", 5.5", iPad Pro 12.9" (if universal)
- [ ] Push Notification entitlement enabled in Xcode
