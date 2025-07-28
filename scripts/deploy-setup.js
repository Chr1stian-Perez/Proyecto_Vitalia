// Script para configurar el despliegue
const fs = require("fs")
const path = require("path")

console.log("🚀 Configurando Vitalia para despliegue...")

// Verificar variables de entorno
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

console.log("✅ Verificando variables de entorno...")
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingVars.length > 0) {
  console.error("❌ Faltan las siguientes variables de entorno:")
  missingVars.forEach((varName) => console.error(`   - ${varName}`))
  console.error("\n📝 Copia .env.local.example a .env.local y completa los valores")
  process.exit(1)
}

// Verificar archivos necesarios
const requiredFiles = [
  "public/manifest.json",
  "public/firebase-messaging-sw.js",
  "public/icon-192x192.png",
  "public/icon-512x512.png",
]

console.log("✅ Verificando archivos necesarios...")
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)))

if (missingFiles.length > 0) {
  console.error("❌ Faltan los siguientes archivos:")
  missingFiles.forEach((file) => console.error(`   - ${file}`))
  process.exit(1)
}

console.log("✅ Configuración completa!")
console.log("\n📋 Pasos para desplegar:")
console.log("1. npm run build")
console.log("2. Configurar Firebase Hosting")
console.log("3. firebase deploy")
console.log("4. Configurar dominio personalizado")
console.log("5. Configurar SSL/HTTPS")

console.log("\n🔧 Servicios adicionales recomendados:")
console.log("- Google Analytics para métricas")
console.log("- Sentry para monitoreo de errores")
console.log("- Vercel/Netlify para hosting alternativo")
