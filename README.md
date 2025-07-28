# 🏥 Vitalia - Plataforma de Salud Digital

Una plataforma web completa para la gestión inteligente de medicamentos, recordatorios de salud y conexión con farmacias.

## Características Principales

- **Dashboard Interactivo** con gráficos de adherencia y métricas de salud
- **Gestión de Medicamentos** (CRUD completo)
- **Sistema de Recordatorios** inteligentes
- **Panel de Farmacias** (B2B y B2C)
- **Autenticación Segura** con Firebase
- **Diseño Responsive** optimizado para móviles
- **PWA Ready** - Funciona como app nativa

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Gráficos**: Recharts
- **Backend**: Firebase (Auth, Firestore, Cloud Messaging)
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Visual Studio Code (recomendado)
- Cuenta de Firebase (para producción)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd vitalia-platform
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno
El archivo `.env.local` ya está incluido con las configuraciones necesarias.

### 4. Ejecutar en modo desarrollo
\`\`\`bash
npm run dev
\`\`\`

### 5. Abrir en el navegador
Visita: http://localhost:3000

## 🔐 Credenciales de Demo

Para probar la aplicación, usa estas credenciales:
- **Email**: demo@vitalia.com
- **Contraseña**: demo123

## 📱 Funcionalidades Disponibles

### Para Pacientes
- ✅ Registro y login de usuarios
- ✅ Dashboard con métricas de salud
- ✅ Gestión completa de medicamentos
- ✅ Recordatorios interactivos
- ✅ Búsqueda de farmacias cercanas
- ✅ Gráficos de adherencia al tratamiento

### Para Farmacias
- ✅ Panel administrativo completo
- ✅ Gestión de catálogo de productos
- ✅ Analytics de ventas y clientes
- ✅ Dashboard con métricas de negocio

## 🏗️ Estructura del Proyecto

\`\`\`
vitalia-platform/
├── app/                    # Páginas de Next.js 14
│   ├── auth/              # Autenticación (login/registro)
│   ├── medications/       # Gestión de medicamentos
│   ├── pharmacy/          # Panel de farmacias
│   └── api/               # API Routes
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── public/                # Archivos estáticos
└── scripts/               # Scripts de utilidad

\`\`\`

## 🎨 Paleta de Colores

- **Verde Principal**: #2D5016
- **Dorado**: #D4AF37
- **Verde Claro**: #4A7C59
- **Verde Suave**: #8FBC8F

## 📊 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Verificar código

# Utilidades
npm run seed         # Inicializar base de datos
\`\`\`

## 🚀 Despliegue

### Vercel (Recomendado)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Firebase Hosting
\`\`\`bash
npm run build
firebase deploy
\`\`\`

## 🔧 Configuración Adicional

### Para Notificaciones Push
1. Configurar Firebase Cloud Messaging
2. Generar VAPID Key
3. Actualizar service worker

### Para Producción
1. Configurar dominio personalizado
2. Habilitar HTTPS
3. Configurar analytics
4. Configurar monitoreo de errores

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@vitalia.com
- Documentación: [docs.vitalia.com]

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
