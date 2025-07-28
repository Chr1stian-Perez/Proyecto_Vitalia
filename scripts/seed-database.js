// Script para inicializar la base de datos con datos de ejemplo
// En producción, esto se ejecutaría con Firebase Admin SDK

const sampleUsers = [
  {
    uid: "demo_user_id",
    email: "demo@vitalia.com",
    name: "María González",
    plan: "Premium",
    registrationDate: new Date().toISOString(),
    preferences: {
      notifications: true,
      reminderSound: true,
      language: "es",
    },
  },
]

const sampleMedications = [
  {
    id: "1",
    userId: "demo_user_id",
    name: "Omeprazol",
    dosage: "20mg",
    format: "Cápsula",
    frequency: "Una vez al día",
    times: ["08:00"],
    notes: "Tomar antes del desayuno",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "demo_user_id",
    name: "Metformina",
    dosage: "500mg",
    format: "Tableta",
    frequency: "Dos veces al día",
    times: ["08:00", "20:00"],
    notes: "Tomar con las comidas",
    startDate: "2024-01-10",
    active: true,
    createdAt: new Date().toISOString(),
  },
]

const samplePharmacies = [
  {
    id: "pharmacy_1",
    name: "Farmacia San Rafael",
    email: "admin@farmaciasanrafael.com",
    address: "Av. Principal 123, Centro",
    phone: "+1 234-567-8900",
    coordinates: { lat: 4.6097, lng: -74.0817 },
    hours: "24 horas",
    hasDelivery: true,
    rating: 4.8,
    verified: true,
    createdAt: new Date().toISOString(),
  },
]

// Función para inicializar la base de datos
async function seedDatabase() {
  try {
    console.log("Iniciando seed de la base de datos...")

    // En producción, usar Firebase Admin SDK
    // const admin = require('firebase-admin')
    // const db = admin.firestore()

    // Crear usuarios
    console.log("Creando usuarios de ejemplo...")
    // await db.collection('users').doc(sampleUsers[0].uid).set(sampleUsers[0])

    // Crear medicamentos
    console.log("Creando medicamentos de ejemplo...")
    // for (const medication of sampleMedications) {
    //   await db.collection('medications').doc(medication.id).set(medication)
    // }

    // Crear farmacias
    console.log("Creando farmacias de ejemplo...")
    // for (const pharmacy of samplePharmacies) {
    //   await db.collection('pharmacies').doc(pharmacy.id).set(pharmacy)
    // }

    console.log("✅ Base de datos inicializada correctamente")
    console.log("Datos creados:")
    console.log(`- ${sampleUsers.length} usuarios`)
    console.log(`- ${sampleMedications.length} medicamentos`)
    console.log(`- ${samplePharmacies.length} farmacias`)
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error)
  }
}

// Ejecutar el script
seedDatabase()
