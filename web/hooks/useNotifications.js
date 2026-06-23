import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  showLocalNotification,
  addLocalNotificationTapListener
} from "../src/services/notifications";

/**
 * Hook that:
 *  1. Listens for tapped local notifications and navigates to their target route.
 *  2. Exposes helpers to fire in-app notifications.
 */
export function useNotifications() {
  const router = useRouter();

  useEffect(() => {
    let cleanup = () => {};

    addLocalNotificationTapListener((route) => {
      router.push(route);
    }).then((fn) => {
      cleanup = fn;
    });

    return () => cleanup();
  }, [router]);

  /**
   * Notify user of a new direct message.
   * Call this after sendMessage() resolves if the recipient is someone else.
   */
  const notifyNewMessage = useCallback(
    async ({ fromName, subject }) => {
      await showLocalNotification({
        title: `Yeni mesaj – ${fromName}`,
        body: subject,
        route: "/messages"
      });
    },
    []
  );

  /**
   * Notify all users of a new announcement.
   * Call this after createAnnouncement() resolves (admin-only flow).
   */
  const notifyNewAnnouncement = useCallback(async ({ title }) => {
    await showLocalNotification({
      title: "Yeni Duyuru",
      body: title,
      route: "/announcements"
    });
  }, []);

  /**
   * Generic local notification with a target route.
   */
  const notify = useCallback(async ({ title, body, route }) => {
    await showLocalNotification({ title, body, route });
  }, []);

  return { notifyNewMessage, notifyNewAnnouncement, notify };
}
