// Service Worker para notificaciones en segundo plano
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebase = window.firebase
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "medication-reminder",
    requireInteraction: true,
    actions: [
      {
        action: "taken",
        title: "Tomé mi medicamento",
      },
      {
        action: "postpone",
        title: "Posponer",
      },
    ],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
