// Script para verificar que Firebase está configurado correctamente
const admin = require("firebase-admin")

// Verificar variables de entorno
const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

console.log("🔥 Verificando configuración de Firebase...\n")

// Verificar variables de entorno
console.log("📋 Variables de entorno:")
requiredVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`)
  }
})

// Verificar formato de las variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

console.log("\n🔍 Verificando formato:")

if (apiKey && apiKey.startsWith("AIza")) {
  console.log("✅ API Key tiene formato correcto")
} else {
  console.log('❌ API Key formato incorrecto (debe empezar con "AIza")')
}

if (projectId && projectId.length > 0) {
  console.log("✅ Project ID configurado")
} else {
  console.log("❌ Project ID no configurado")
}

if (appId && appId.includes(":")) {
  console.log("✅ App ID tiene formato correcto")
} else {
  console.log('❌ App ID formato incorrecto (debe contener ":")')
}

console.log("\n🎯 Próximos pasos:")
console.log("1. Habilitar Authentication en Firebase Console")
console.log("2. Crear Firestore Database")
console.log("3. Configurar Cloud Messaging")
console.log("4. Ejecutar: npm run dev")

console.log("\n📚 Enlaces útiles:")
console.log("- Firebase Console: https://console.firebase.google.com/")
console.log("- Documentación: https://firebase.google.com/docs")
