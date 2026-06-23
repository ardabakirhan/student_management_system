import "../styles/globals.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AppDataProvider } from "../hooks/useAppData";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import LoginScreen from "../components/LoginScreen";
import { useAppData } from "../hooks/useAppData";
import {
  registerPushNotifications,
  addPushListeners
} from "../src/services/notifications";
import { setupDeepLinks } from "../src/services/deepLinks";
import { useNotifications } from "../hooks/useNotifications";

const PUBLIC_ROUTES = ["/login", "/demo", "/change-password"];
const roleHome = { admin: "/", teacher: "/", student: "/", veli: "/evaluations" };

function AppGate({ Component, pageProps }) {
  const router = useRouter();
  const { isAuthenticated, isReady: authReady, currentUser } = useAuth();
  const { isReady: dataReady, refresh } = useAppData();
  const { notify } = useNotifications();

  // Re-fetch all data once the user is authenticated (after login or session restore).
  // Without this, getAppState() runs on mount before the token exists → all 401s → empty data.
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    if (currentUser.must_change_password && router.pathname !== "/change-password") {
      router.replace("/change-password");
    } else if (!currentUser.must_change_password && router.pathname === "/login") {
      router.replace(roleHome[currentUser.role] ?? "/");
    }
  }, [currentUser, isAuthenticated, router]);

  useEffect(() => {
    if (authReady && dataReady && !isAuthenticated && !PUBLIC_ROUTES.includes(router.pathname)) {
      router.replace("/login");
    }
  }, [authReady, dataReady, isAuthenticated, router]);

  // Wire push notification tap → navigation
  useEffect(() => {
    let cleanup = () => {};

    addPushListeners(
      // foreground: show in-app local notification
      (notification) => {
        const route = notification.data?.route ?? "/";
        notify({
          title: notification.title ?? "Bildirim",
          body: notification.body ?? "",
          route
        });
      },
      // tap from system tray
      (action) => {
        const route = action.notification.data?.route ?? "/";
        if (route && isAuthenticated) {
          router.push(route);
        }
      }
    ).then((fn) => {
      cleanup = fn;
    });

    return () => cleanup();
  }, [isAuthenticated, notify, router]);

  if (!authReady || !dataReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium shadow-soft">
          Sistem hazırlanıyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(router.pathname)) {
    return <LoginScreen />;
  }

  return <Component {...pageProps} />;
}

function NativeInit() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function boot() {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        // Status bar styling
        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#581c87" });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch {}

        // Push notification registration
        await registerPushNotifications();

        // Deep link handling
        const cleanupDeepLinks = await setupDeepLinks(router);

        // Hide splash screen after everything is wired up
        try {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide({ fadeOutDuration: 300 });
        } catch {}

        return cleanupDeepLinks;
      } catch (err) {
        console.error("[Rezonans] Native boot hatası:", err);
      }
    }

    let cleanupFn = null;
    boot().then((fn) => {
      cleanupFn = fn ?? null;
    });

    return () => {
      cleanupFn?.();
    };
  }, [router]);

  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <AppDataProvider>
      <AuthProvider>
        <NativeInit />
        <AppGate Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </AppDataProvider>
  );
}
