// Servicios de autenticación real con Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase-config"

export interface UserProfile {
  uid: string
  email: string
  name: string
  plan: "Freemium" | "Premium"
  registrationDate: string
  preferences: {
    notifications: boolean
    reminderSound: boolean
    language: string
  }
}

// Registrar nuevo usuario
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Crear perfil en Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name,
      plan: "Freemium",
      registrationDate: new Date().toISOString(),
      preferences: {
        notifications: true,
        reminderSound: true,
        language: "es",
      },
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return { success: true, user: userProfile }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Iniciar sesión
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Obtener perfil del usuario
    const userDoc = await getDoc(doc(db, "users", user.uid))
    const userProfile = userDoc.data() as UserProfile

    return { success: true, user: userProfile }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Observador de estado de autenticación
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
