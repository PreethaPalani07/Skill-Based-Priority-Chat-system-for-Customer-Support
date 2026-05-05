importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "your api key",
  authDomain: "customer-support-chat-system.firebaseapp.com",
  databaseURL: "https://customer-support-chat-system-default-rtdb.firebaseio.com",
  projectId: "customer-support-chat-system",
  storageBucket: "customer-support-chat-system.appspot.com",
  messagingSenderId: "your messaging sender id",
  appId: "your app id",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo192.png",
      badge: "/logo192.png",
      vibrate: [200, 100, 200],
    }
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});