// Sistema de notificaciones push con Firebase Cloud Messaging
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "./firebase-config"

// Solicitar permisos y obtener token
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return { success: false, error: "Messaging not supported" }

    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })

      return { success: true, token }
    } else {
      return { success: false, error: "Permission denied" }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Escuchar mensajes en primer plano
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) return

    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}

// Registrar token del dispositivo en Firestore
export const saveNotificationToken = async (userId: string, token: string) => {
  try {
    // Guardar token en el perfil del usuario
    const { doc, updateDoc } = await import("firebase/firestore")
    const { db } = await import("./firebase-config")

    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      notificationToken: token,
      tokenUpdatedAt: new Date().toISOString(),
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
