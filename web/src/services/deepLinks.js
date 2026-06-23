/**
 * Deep link handler for the custom URL scheme: rezonans://app/<path>
 *
 * Examples:
 *   rezonans://app/evaluations      → /evaluations
 *   rezonans://app/messages         → /messages
 *   rezonans://app/students         → /students
 *   rezonans://app/student/3        → /students  (with student id if needed later)
 *   rezonans://app/announcements    → /announcements
 */

const SCHEME = "rezonans://app";

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

/**
 * Register the deep link listener.
 * @param {import('next/router').NextRouter} router
 * @returns {Promise<() => void>} cleanup function
 */
export async function setupDeepLinks(router) {
  if (!(await isNative())) return () => {};

  try {
    const { App } = await import("@capacitor/app");

    const listener = await App.addListener("appUrlOpen", (data) => {
      const url = data.url || "";

      if (!url.startsWith(SCHEME)) return;

      // Strip scheme prefix, e.g. "rezonans://app/messages/3" → "/messages/3"
      const path = url.slice(SCHEME.length) || "/";

      // Normalize: collapse double slashes, ensure leading slash
      const normalized = ("/" + path.replace(/^\/+/, "")).replace(/\/+$/, "") || "/";

      router.push(normalized);
    });

    // Also handle the initial URL if app was cold-started from a deep link
    const appLaunchUrl = await App.getLaunchUrl();
    if (appLaunchUrl?.url?.startsWith(SCHEME)) {
      const path = appLaunchUrl.url.slice(SCHEME.length) || "/";
      const normalized = ("/" + path.replace(/^\/+/, "")).replace(/\/+$/, "") || "/";
      // Small delay to let the app/auth settle before navigating
      setTimeout(() => router.push(normalized), 800);
    }

    return () => listener.remove();
  } catch (err) {
    console.error("[Rezonans] Deep link kurulum hatası:", err);
    return () => {};
  }
}
