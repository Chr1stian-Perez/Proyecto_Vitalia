"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User as UserIcon } from "lucide-react"
import { onAuthChange } from "@/lib/firebase-auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface UserProfile {
    uid?: string
    name: string
    email: string
    birthdate: string
    gender: string
    civilStatus: string
    phone: string
    mobile: string
    plan: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState<Partial<UserProfile>>({})

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
            const data = userDoc.data() as UserProfile
            setUser({ ...data, uid: firebaseUser.uid })
            setForm(data)
        } else {
            router.push("/")
        }
        })

        return () => unsubscribe()
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        try {
        if (user?.uid) {
            await updateDoc(doc(db, "users", user.uid), {
            name: form.name,
            birthdate: form.birthdate,
            civilStatus: form.civilStatus,
            phone: form.phone,
            mobile: form.mobile,
            })
            alert("Perfil actualizado con éxito")
            setEditMode(false)
            setUser({ ...user, ...form })
        }
        } catch (error) {
        console.error("Error al actualizar perfil:", error)
        alert("No se pudo actualizar el perfil")
        }
    }

    if (!user) return <p className="text-center mt-10">Cargando perfil...</p>

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-10">
            {/* Encabezado */}
            <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-green-700" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-green-800">Mi Perfil</h1>
                <p className="text-gray-600 text-sm">Consulta o edita tu información personal</p>
            </div>
            </div>

            {/* Datos en dos columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-gray-800 mb-10">
            <div>
                <p className="font-semibold">👤 Nombre completo:</p>
                {editMode ? (
                <Input name="name" value={form.name} onChange={handleChange} />
                ) : (
                <p>{user.name}</p>
                )}
            </div>

            <div>
                <p className="font-semibold">📦 Plan actual:</p>
                <Badge className="bg-yellow-100 text-yellow-800">{user.plan}</Badge>
            </div>

            <div>
                <p className="font-semibold">📅 Fecha de nacimiento:</p>
                {editMode ? (
                <Input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
                ) : (
                <p>{user.birthdate}</p>
                )}
            </div>

            <div>
                <p className="font-semibold">⚧️ Género:</p>
                <p>{user.gender}</p>
            </div>

            <div>
                <p className="font-semibold">💍 Estado civil:</p>
                {editMode ? (
                <select
                    name="civilStatus"
                    value={form.civilStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                >
                    <option value="">Seleccione</option>
                    <option value="soltero">Soltero</option>
                    <option value="casado">Casado</option>
                </select>
                ) : (
                <p>{user.civilStatus}</p>
                )}
            </div>

            <div>
                <p className="font-semibold">☎️ Teléfono fijo:</p>
                {editMode ? (
                <Input name="phone" value={form.phone} onChange={handleChange} />
                ) : (
                <p>{user.phone}</p>
                )}
            </div>

            <div>
                <p className="font-semibold">📱 Celular:</p>
                {editMode ? (
                <Input name="mobile" value={form.mobile} onChange={handleChange} />
                ) : (
                <p>{user.mobile}</p>
                )}
            </div>

            <div className="md:col-span-2">
                <p className="font-semibold">✉️ Correo electrónico:</p>
                <p>{user.email}</p>
            </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center">
            <Button
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => router.push("/dashboard")}
            >
                ← Volver al inicio
            </Button>

            {editMode ? (
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleUpdate}>
                Guardar cambios
                </Button>
            ) : (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditMode(true)}>
                Editar perfil
                </Button>
            )}
            </div>
        </div>
        </div>
    )
}