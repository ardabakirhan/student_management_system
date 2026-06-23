/**
 * Push & local notification service.
 *
 * push-notifications  → FCM/APNs infrastructure.
 *                       Requires a real google-services.json (Android) or
 *                       APNs entitlement (iOS) plus a backend to send pushes.
 *                       The stub google-services.json prevents the startup crash;
 *                       FCM token registration will silently fail until a real
 *                       Firebase project is configured.
 *
 * local-notifications → Triggered by the app itself (new message ping,
 *                       announcement alert). Works without any backend.
 */

function isBrowser() {
  return typeof window !== "undefined";
}

async function isNative() {
  if (!isBrowser()) return false;
  try {
    const { Capacitor } = await import("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

// ─── Push notifications (FCM / APNs) ─────────────────────────────────────────

export async function registerPushNotifications() {
  if (!(await isNative())) return null;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      console.warn("[Rezonans] Push izni verilmedi.");
      return null;
    }

    // Set up listeners BEFORE calling register() so we never miss the first event.
    const regListener = await PushNotifications.addListener("registration", (token) => {
      // Replace google-services.json with real Firebase config to reach this point.
      // In production: POST token.value to your backend so it can send targeted pushes.
      console.log("[Rezonans] Push token alındı:", token.value);
    });

    const errListener = await PushNotifications.addListener("registrationError", (err) => {
      // Expected with the stub google-services.json — not a crash, just a log.
      console.warn("[Rezonans] Push kayıt başarısız (Firebase yapılandırması gerekli):", err.error);
    });

    // register() calls FirebaseMessaging.getInstance() on Android.
    // Requires google-services.json to be present (even a stub is enough to prevent
    // the IllegalStateException crash). Token request will fail silently if the
    // Firebase project is a placeholder — that is handled by registrationError above.
    await PushNotifications.register();

    return () => {
      regListener.remove();
      errListener.remove();
    };
  } catch (err) {
    // Catch any unexpected plugin errors — app must never crash here.
    console.warn("[Rezonans] Push kurulum hatası (devam ediliyor):", err?.message ?? err);
    return null;
  }
}

export async function addPushListeners(onForegroundMessage, onNotificationTap) {
  if (!(await isNative())) return () => {};

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    const msgListener = await PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        onForegroundMessage?.(notification);
      }
    );

    const tapListener = await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        onNotificationTap?.(action);
      }
    );

    return () => {
      msgListener.remove();
      tapListener.remove();
    };
  } catch {
    return () => {};
  }
}

// ─── Local notifications (in-app triggers) ────────────────────────────────────
// These work without Firebase or any backend.

async function ensureLocalPermission() {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  let perm = await LocalNotifications.checkPermissions();
  if (perm.display === "prompt") {
    perm = await LocalNotifications.requestPermissions();
  }
  return perm.display === "granted";
}

/**
 * Fire a local notification. Safe to call on web (no-op).
 * @param {{ title: string, body: string, route?: string, id?: number }} opts
 */
export async function showLocalNotification({ title, body, route, id }) {
  if (!(await isNative())) return;

  try {
    const granted = await ensureLocalPermission();
    if (!granted) return;

    const { LocalNotifications } = await import("@capacitor/local-notifications");

    await LocalNotifications.schedule({
      notifications: [
        {
          id: id ?? Math.floor(Math.random() * 100000),
          title,
          body,
          extra: { route: route ?? "/" },
          schedule: { at: new Date(Date.now() + 300) }
        }
      ]
    });
  } catch (err) {
    console.warn("[Rezonans] Lokal bildirim hatası:", err?.message ?? err);
  }
}

export async function addLocalNotificationTapListener(onTap) {
  if (!(await isNative())) return () => {};

  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const listener = await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (action) => {
        const route = action.notification.extra?.route;
        onTap?.(route ?? "/");
      }
    );
    return () => listener.remove();
  } catch {
    return () => {};
  }
}
