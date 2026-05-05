import { messaging, db } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";

// Request permission and get FCM token
export const setupNotifications = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });

    if (token) {
      // Save token to Firestore
      await updateDoc(doc(db, "users", userId), {
        fcmToken: token,
      });
      console.log("FCM Token saved successfully");
    }
  } catch (err) {
    console.error("Notification setup error:", err);
  }
};

// Show browser notification
export const showBrowserNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "/logo192.png",
      badge: "/logo192.png",
      vibrate: [200, 100, 200],
    });
  }
};

// Listen for foreground messages
export const listenForMessages = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    if (callback) callback(payload);
  });
};