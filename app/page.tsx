"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false) // false = registro | true = login

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h2>

        <form className="space-y-4">
          {/* Campos comunes */}
          {!isLogin && (
            <>
              <Input placeholder="Nombre completo" />
              <Input type="date" placeholder="Fecha de nacimiento" />
              <select className="w-full px-3 py-2 border rounded-md text-sm text-gray-700">
                <option value="">Seleccione género</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
              </select>
              <select className="w-full px-3 py-2 border rounded-md text-sm text-gray-700">
                <option value="">Estado civil</option>
                <option value="soltero">Soltero</option>
                <option value="casado">Casado</option>
              </select>
              <Input type="tel" placeholder="Teléfono fijo" />
              <Input type="tel" placeholder="Número de celular" />
            </>
          )}

          <Input placeholder="Correo electrónico" />
          <Input type="password" placeholder="Contraseña" />

          {!isLogin && (
            <Input type="password" placeholder="Repetir contraseña" />
          )}

          <Button type="submit" className="w-full bg-green-700 text-white">
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </Button>

          <p className="text-sm text-center">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-green-700 hover:underline cursor-pointer"
                >
                  Regístrate
                </span>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-green-700 hover:underline cursor-pointer"
                >
                  Inicia sesión
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}