"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Bell, Calendar, Pill, TrendingUp, Users, ShoppingCart, Activity, Clock } from "lucide-react"

// Datos simulados para los gráficos
const adherenceData = [
    { day: "Lun", adherencia: 95 },
    { day: "Mar", adherencia: 88 },
    { day: "Mié", adherencia: 92 },
    { day: "Jue", adherencia: 85 },
    { day: "Vie", adherencia: 90 },
    { day: "Sáb", adherencia: 78 },
    { day: "Dom", adherencia: 82 },
]

const medicationData = [
    { name: "Omeprazol", dosis: 8, color: "#2D5016" },
    { name: "Metformina", dosis: 6, color: "#D4AF37" },
    { name: "Losartán", dosis: 4, color: "#4A7C59" },
    { name: "Atorvastatina", dosis: 3, color: "#8FBC8F" },
]

const upcomingReminders = [
    { id: 1, medication: "Omeprazol 20mg", time: "08:00", status: "pending" },
    { id: 2, medication: "Metformina 500mg", time: "12:00", status: "pending" },
    { id: 3, medication: "Losartán 50mg", time: "20:00", status: "taken" },
]

export default function Dashboard() {
    const [user, setUser] = useState({ name: "María González", plan: "Premium" })
    const [currentTime, setCurrentTime] = useState(new Date())
    const [mounted, setMounted] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleMedicationTaken = (id: number) => {
        // Simular actualización de adherencia
        console.log(`Medicamento ${id} marcado como tomado`)
    }

    const handleLogout = () => {
    // Si usas Firebase Auth, puedes llamar a signOut(auth)
    // Aquí se simula borrando datos y redirigiendo al login
    localStorage.clear() // o sessionStorage.clear()
    router.push("/") // Ajusta a tu ruta de login
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-800 to-yellow-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-green-800">Vitalia</h1>
                            <p className="text-sm text-gray-600">Plataforma de Salud Digital</p>
                        </div>
                        </div>
                        <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {user.plan}
                        </Badge>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            {mounted && (
                            <p className="text-xs text-gray-500">
                                {currentTime.toLocaleTimeString("es-EC", { hour12: true })}
                            </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 flex items-center space-x-2"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar sesión</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Adherencia Semanal</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-800">87%</div>
                <p className="text-xs text-green-600">+2% desde la semana pasada</p>
                </CardContent>
            </Card>

            <Card className="border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Medicamentos Activos</CardTitle>
                <Pill className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-yellow-800">4</div>
                <p className="text-xs text-yellow-600">2 próximas dosis hoy</p>
                </CardContent>
            </Card>

            <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Recordatorios</CardTitle>
                <Bell className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-800">12</div>
                <p className="text-xs text-green-600">Enviados esta semana</p>
                </CardContent>
            </Card>

            <Card className="border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Próxima Cita</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-yellow-800">3</div>
                <p className="text-xs text-yellow-600">días restantes</p>
                </CardContent>
            </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gráfico de Adherencia */}
            <Card className="lg:col-span-2 border-green-200">
                <CardHeader>
                <CardTitle className="text-green-800">Adherencia al Tratamiento</CardTitle>
                <CardDescription>Porcentaje de cumplimiento semanal</CardDescription>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2e7" />
                    <XAxis dataKey="day" stroke="#2D5016" />
                    <YAxis stroke="#2D5016" />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #22c55e",
                        borderRadius: "8px",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="adherencia"
                        stroke="#2D5016"
                        strokeWidth={3}
                        dot={{ fill: "#D4AF37", strokeWidth: 2, r: 6 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Próximos Recordatorios */}
            <Card className="border-yellow-200">
                <CardHeader>
                <CardTitle className="text-yellow-800">Próximos Recordatorios</CardTitle>
                <CardDescription>Medicamentos programados para hoy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {upcomingReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <div>
                        <p className="text-sm font-medium text-gray-900">{reminder.medication}</p>
                        <p className="text-xs text-gray-500">{reminder.time}</p>
                        </div>
                    </div>
                    {reminder.status === "pending" ? (
                        <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMedicationTaken(reminder.id)}
                        >
                        Tomé
                        </Button>
                    ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Tomado
                        </Badge>
                    )}
                    </div>
                ))}
                </CardContent>
            </Card>
            </div>

            {/* Gráficos adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Distribución de Medicamentos */}
            <Card className="border-green-200">
                <CardHeader>
                <CardTitle className="text-green-800">Distribución de Dosis</CardTitle>
                <CardDescription>Medicamentos por frecuencia semanal</CardDescription>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={medicationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2e7" />
                    <XAxis dataKey="name" stroke="#2D5016" />
                    <YAxis stroke="#2D5016" />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #22c55e",
                        borderRadius: "8px",
                        }}
                    />
                    <Bar dataKey="dosis" fill="#2D5016" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico Circular de Medicamentos */}
            <Card className="border-yellow-200">
                <CardHeader>
                <CardTitle className="text-yellow-800">Medicamentos por Tipo</CardTitle>
                <CardDescription>Distribución de tu tratamiento actual</CardDescription>
                </CardHeader>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={medicationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="dosis"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {medicationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
            </div>

            {/* Navegación inferior */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 px-4 py-2">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <Button variant="ghost" className="flex flex-col items-center space-y-1 text-green-800">
                <Activity className="w-5 h-5" />
                <span className="text-xs">Inicio</span>
                </Button>
                <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 text-gray-600"
                onClick={() => router.push("/medications")}
                >
                <Pill className="w-5 h-5" />
                <span className="text-xs">Medicamentos</span>
                </Button>
                <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 text-gray-600"
                onClick={() => router.push("/pharmacy")}
                >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs">Farmacias</span>
                </Button>
                <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 text-gray-600"
                onClick={() => router.push("/profile")}
                >
                <Users className="w-5 h-5" />
                <span className="text-xs">Perfil</span>
                </Button>
            </div>
            </div>
        </div>
        </div>
    )
}