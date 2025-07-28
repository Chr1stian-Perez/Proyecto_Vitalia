"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulación de autenticación con Firebase
    try {
      // Validación básica
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos")
      }

      if (!email.includes("@")) {
        throw new Error("Por favor, ingresa un correo electrónico válido")
      }

      // Simular llamada a Firebase Auth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular éxito (en producción sería signInWithEmailAndPassword)
      if (email === "demo@vitalia.com" && password === "demo123") {
        // Simular almacenamiento del token
        localStorage.setItem("vitalia_token", "demo_jwt_token")
        router.push("/")
      } else {
        throw new Error("Credenciales incorrectas")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-800 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-green-800">Bienvenido a Vitalia</CardTitle>
            <CardDescription className="text-gray-600">
              Inicia sesión para acceder a tu plataforma de salud
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-800">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-green-200 focus:border-green-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                ¿Olvidaste tu contraseña?
              </Link>
              <div className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/auth/register" className="text-green-600 hover:text-green-800 font-medium">
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-2">Credenciales de demostración:</p>
            <p className="text-xs text-yellow-700">Email: demo@vitalia.com</p>
            <p className="text-xs text-yellow-700">Contraseña: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
