// Servicios para gestión de medicamentos con Firestore
import { collection, doc, addDoc, updateDoc, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "./firebase-config"

export interface Medication {
  id?: string
  userId: string
  name: string
  dosage: string
  format: string
  frequency: string
  times: string[]
  notes?: string
  startDate: string
  endDate?: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

// Obtener medicamentos del usuario
export const getUserMedications = async (userId: string) => {
  try {
    const q = query(
      collection(db, "medications"),
      where("userId", "==", userId),
      where("active", "==", true),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const medications: Medication[] = []

    querySnapshot.forEach((doc) => {
      medications.push({ id: doc.id, ...doc.data() } as Medication)
    })

    return { success: true, data: medications }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Crear nuevo medicamento
export const createMedication = async (medicationData: Omit<Medication, "id" | "createdAt">) => {
  try {
    // 🔍 Validación mínima para evitar errores silenciosos
    if (!medicationData.userId) {
      console.error("🚨 Error: userId está vacío o indefinido. No se guardará el medicamento.")
      return { success: false, error: "userId es requerido" }
    }

    const newMedication = {
      ...medicationData,
      active: true,
      createdAt: new Date().toISOString(),
    }

    console.log("🚀 Enviando medicamento a Firestore:", newMedication)

    const docRef = await addDoc(collection(db, "medications"), newMedication)

    return { success: true, data: { id: docRef.id, ...newMedication } }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Actualizar medicamento
export const updateMedication = async (medicationId: string, updates: Partial<Medication>) => {
  try {
    const medicationRef = doc(db, "medications", medicationId)
    await updateDoc(medicationRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Eliminar medicamento (soft delete)
export const deleteMedication = async (medicationId: string) => {
  try {
    const medicationRef = doc(db, "medications", medicationId)
    await updateDoc(medicationRef, {
      active: false,
      updatedAt: new Date().toISOString(),
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
