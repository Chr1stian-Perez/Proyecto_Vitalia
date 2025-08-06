"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()

    const user = {
        name: "María González",
        email: "maria.gonzalez@example.com",
        plan: "Premium",
    }

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-10">
            {/* Encabezado */}
            <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-green-700" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-green-800">Mi Perfil</h1>
                <p className="text-gray-600 text-sm">Consulta tu información personal y plan actual</p>
            </div>
            </div>

            {/* Datos en dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 text-gray-800 mb-10">
            <div>
                <p className="font-semibold">👤 Nombre:</p>
                <p>{user.name}</p>
            </div>

            <div>
                <p className="font-semibold">📦 Plan actual:</p>
                <Badge className="bg-yellow-100 text-yellow-800">{user.plan}</Badge>
            </div>

            <div className="md:col-span-2">
                <p className="font-semibold">✉️ Correo electrónico:</p>
                <p>{user.email}</p>
            </div>
            </div>

            {/* Botón de volver */}
            <div className="text-right">
            <Button
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => router.push("/")}
            >
                ← Volver al inicio
            </Button>
            </div>
        </div>
        </div>
    )
}
