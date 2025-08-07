"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerUser, loginUser } from "@/lib/firebase-auth"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false)

  // Estado común
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    gender: "",
    civilStatus: "",
    phone: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      alert("Correo y contraseña son obligatorios")
      return
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (isLogin) {
      const res = await loginUser(form.email, form.password)
      if (res.success) {
        alert("¡Inicio de sesión exitoso!")
        router.push("/dashboard") // Redirige a dashboard
      } else {
        alert("Error: " + res.error)
      }
    } else {
      const res = await registerUser(
        form.email,
        form.password,
        form.name,
        form.birthdate,
        form.gender,
        form.civilStatus,
        form.phone,
        form.mobile
      )
      if (res.success) {
        alert("¡Registro exitoso!")
        router.push("/dashboard")
      } else {
        alert("Error: " + res.error)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} />
              <Input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
              <select name="gender" className="w-full px-3 py-2 border rounded-md text-sm text-gray-700" onChange={handleChange} value={form.gender}>
                <option value="">Seleccione género</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
              </select>
              <select name="civilStatus" className="w-full px-3 py-2 border rounded-md text-sm text-gray-700" onChange={handleChange} value={form.civilStatus}>
                <option value="">Estado civil</option>
                <option value="soltero">Soltero</option>
                <option value="casado">Casado</option>
              </select>
              <Input name="phone" type="tel" placeholder="Teléfono fijo" value={form.phone} onChange={handleChange} />
              <Input name="mobile" type="tel" placeholder="Número de celular" value={form.mobile} onChange={handleChange} />
            </>
          )}

          <Input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
          {!isLogin && (
            <Input name="confirmPassword" type="password" placeholder="Repetir contraseña" value={form.confirmPassword} onChange={handleChange} />
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