// Servicios para gestión de medicamentos con Firestore
import { collection, doc, addDoc, updateDoc, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "./firebase-config"

// Estructura del objeto Medication que se usará para tipado TypeScript
export interface Medication {
  id: string                      // ID asignado por Firestore (se agrega después de la creación)
  userId: string                   // ID del usuario que registró el medicamento
  name: string                     // Nombre del medicamento
  dosage: string                   // Dosis (ej. "500mg")
  format: string                   // Formato (ej. "Tableta", "Jarabe")
  frequency: string                // Frecuencia de uso (ej. "Una vez al día")
  times: string[]                  // Horarios programados (ej. ["08:00", "20:00"])
  notes?: string                   // Notas adicionales (opcional)
  startDate: string                // Fecha de inicio (formato ISO)
  endDate?: string                 // Fecha de fin (opcional)
  active: boolean                  // Si el medicamento está activo o fue eliminado (soft delete)
  createdAt: string                // Fecha de creación del documento
  updatedAt?: string              // Fecha de última actualización (opcional)
}

// Obtener medicamentos del usuario
/*
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
}*/

// Obtener todos los medicamentos (activos + finalizados) de un usuario
export const getAllUserMedications = async (userId: string) => {
  try {
    const q = query(
      collection(db, "medications"),
      where("userId", "==", userId),
      where("active", "==", true)
    )

    const snapshot = await getDocs(q)

    const medications = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name ?? "",
        dosage: data.dosage ?? "",
        format: data.format ?? "",
        frequency: data.frequency ?? "",
        times: data.times ?? [],
        notes: data.notes ?? "",
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? undefined,
      }
    })

    return { success: true, data: medications }
  } catch (error) {
    return { success: false, error }
  }
}

// 📥 Obtener medicamentos activos de un usuario
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
      medications.push({ id: doc.id, ...doc.data() } as Medication)  // 👈 Asegura que 'id' es string
    })

    return { success: true, data: medications }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Crear nuevo medicamento
/*
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
}*/
export const createMedication = async (medicationData: Omit<Medication, "id" | "createdAt">) => {
  try {
    if (!medicationData.userId) {
      console.error("🚨 Error: userId está vacío o indefinido. No se guardará el medicamento.")
      return { success: false, error: "userId es requerido" }
    }

    const newMedication = {
      ...medicationData,
      active: true,
      createdAt: new Date().toISOString(),
    }

    console.log("📦 Preparando creación de medicamento:", newMedication)

    const docRef = await addDoc(collection(db, "medications"), newMedication)

    console.log(`✅ Medicamento creado con ID: ${docRef.id}`)

    return { success: true, data: { id: docRef.id, ...newMedication } }
  } catch (error: any) {
    console.error("❌ Error al crear medicamento:", error.message)
    return { success: false, error: error.message }
  }
}

// Actualizar medicamento
/*
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
}*/
export const updateMedication = async (medicationId: string, updates: Partial<Medication>) => {
  try {
    const medicationRef = doc(db, "medications", medicationId)

    const updatePayload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(medicationRef, updatePayload)

    console.log(`🔄 Medicamento ${medicationId} actualizado con:`, updatePayload)

    return { success: true }
  } catch (error: any) {
    console.error(`❌ Error al actualizar medicamento ${medicationId}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Eliminar medicamento (soft delete)
/*
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
}*/

// 🗑️ Eliminar medicamento lógicamente (marcar como inactivo)
export const deleteMedication = async (medicationId: string) => {
  try {
    const medicationRef = doc(db, "medications", medicationId)

    const updatePayload = {
      active: false,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(medicationRef, updatePayload)

    console.log(`🗑️ Medicamento ${medicationId} eliminado lógicamente (active = false)`)

    return { success: true }
  } catch (error: any) {
    console.error(`❌ Error al eliminar medicamento ${medicationId}:`, error.message)
    return { success: false, error: error.message }
  }
}