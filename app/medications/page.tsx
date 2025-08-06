"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Importa las funciones de Firebase
import { getAllUserMedications, getUserMedications, createMedication, updateMedication, deleteMedication } from "@/lib/firebase-medications"

import "@/lib/firebase-config"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pill, Clock, Edit, Trash2, Calendar } from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  format: string
  frequency: string
  times: string[]
  notes?: string
  startDate: string
  endDate?: string
}

export default function MedicationsPage() {
  const router = useRouter()
  /*const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Omeprazol",
      dosage: "20mg",
      format: "Cápsula",
      frequency: "Una vez al día",
      times: ["08:00"],
      notes: "Tomar antes del desayuno",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
    },
    {
      id: 2,
      name: "Metformina",
      dosage: "500mg",
      format: "Tableta",
      frequency: "Dos veces al día",
      times: ["08:00", "20:00"],
      notes: "Tomar con las comidas",
      startDate: "2024-01-10",
    },
    {
      id: 3,
      name: "Losartán",
      dosage: "50mg",
      format: "Tableta",
      frequency: "Una vez al día",
      times: ["20:00"],
      startDate: "2024-02-01",
    },
  ])*/
  const [medications, setMedications] = useState<Medication[]>([])

  // Cargar medicamentos desde Firestore al iniciar
  useEffect(() => {
  const fetchAllMedications = async () => {
    const result = await getAllUserMedications("demo-user")
    if (result.success) {
      setMedications(result.data ?? [])
      console.log("📥 Medicamentos cargados:", result.data)
    } else {
      console.error("❌ Error al cargar medicamentos:", result.error)
    }
  }

    fetchAllMedications()
  }, [])



  //

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    format: "Tableta",
    frequency: "Una vez al día",
    times: ["08:00"],
    notes: "",
    startDate: "",
    endDate: "",
  })

  const handleAddMedication = async () => {
    const newMedication = {
      userId: "demo-user", // ← Asegúrate de incluir esto si tu función lo espera
      name: formData.name,
      dosage: formData.dosage,
      format: formData.format,
      frequency: formData.frequency,
      times: formData.times,
      notes: formData.notes,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    }

    const result = await createMedication(newMedication)

    if (result.success) {
      setMedications([...medications, result.data as Medication]) // añade también el ID del documento
      console.log("✅ Medicamento guardado en Firestore:", result.data)
    } else {
      console.error("❌ Error al guardar en Firestore:", result.error)
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication)
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      format: medication.format,
      frequency: medication.frequency,
      times: medication.times,
      notes: medication.notes || "",
      startDate: medication.startDate,
      endDate: medication.endDate || "",
    })
    setIsDialogOpen(true)
  }

  /*const handleUpdateMedication = () => {
    if (!editingMedication) return

    const updatedMedications = medications.map((med) =>
      med.id === editingMedication.id
        ? {
            ...med,
            name: formData.name,
            dosage: formData.dosage,
            format: formData.format,
            frequency: formData.frequency,
            times: formData.times,
            notes: formData.notes,
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
          }
        : med,
    )

    setMedications(updatedMedications)
    resetForm()
    setEditingMedication(null)
    setIsDialogOpen(false)
  }*/
 const handleUpdateMedication = async () => {
  if (!editingMedication) return

    const updates = {
      name: formData.name,
      dosage: formData.dosage,
      format: formData.format,
      frequency: formData.frequency,
      times: formData.times,
      notes: formData.notes,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
    }

    // 🔁 Actualizar en Firestore
    const result = await updateMedication(editingMedication.id.toString(), updates)

    if (result.success) {
      // 🧠 Actualizar en el estado local
      const updatedMedications = medications.map((med) =>
        med.id === editingMedication.id ? { ...med, ...updates } : med
      )
      setMedications(updatedMedications)
      console.log("✅ Medicamento actualizado correctamente en Firestore:", updates)
    } else {
      console.error("❌ Error al actualizar medicamento:", result.error)
    }

    resetForm()
    setEditingMedication(null)
    setIsDialogOpen(false)
  }

  /*const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
  }*/
  //const [deleteId, setDeleteId] = useState<string | null>(null)
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteMedication = async (id: string) => {
    // El ID de Firestore debe estar en `id` si se guardó desde createMedication
    const result = await deleteMedication(id.toString())

    if (result.success) {
      setMedications(medications.filter((med) => med.id !== id))
      console.log("🗑️ Medicamento marcado como inactivo en Firestore. ID:", id)
    } else {
      console.error("❌ Error al eliminar medicamento en Firestore:", result.error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      format: "Tableta",
      frequency: "Una vez al día",
      times: ["08:00"],
      notes: "",
      startDate: "",
      endDate: "",
    })
  }

  const getStatusBadge = (medication: Medication) => {
    const today = new Date()
    const endDate = medication.endDate ? new Date(medication.endDate) : null

    if (endDate && endDate < today) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Finalizado
        </Badge>
      )
    }
    return <Badge className="bg-green-100 text-green-800">Activo</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Mis Medicamentos</h1>
            <p className="text-gray-600 mt-2">Gestiona tu tratamiento médico</p>
          </div>

          <Button
            variant="outline"
            className="text-green-800 border-green-800 hover:bg-green-100"
            onClick={() => router.push('/')} // o '/dashboard' si es tu ruta real
          >
            ← Volver al inicio
          </Button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Medicamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  {editingMedication ? "Editar Medicamento" : "Nuevo Medicamento"}
                </DialogTitle>
                <DialogDescription>
                  {editingMedication
                    ? "Modifica los datos del medicamento"
                    : "Añade un nuevo medicamento a tu tratamiento"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Medicamento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Omeprazol"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosis</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      placeholder="Ej: 20mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData({ ...formData, format: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tableta">Tableta</SelectItem>
                        <SelectItem value="Cápsula">Cápsula</SelectItem>
                        <SelectItem value="Jarabe">Jarabe</SelectItem>
                        <SelectItem value="Inyección">Inyección</SelectItem>
                        <SelectItem value="Gotas">Gotas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frecuencia</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Una vez al día">Una vez al día</SelectItem>
                      <SelectItem value="Dos veces al día">Dos veces al día</SelectItem>
                      <SelectItem value="Tres veces al día">Tres veces al día</SelectItem>
                      <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                      <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha de Fin (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas (Opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Instrucciones especiales, efectos secundarios, etc."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={editingMedication ? handleUpdateMedication : handleAddMedication}
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={!formData.name || !formData.dosage || !formData.startDate}
                >
                  {editingMedication ? "Actualizar Medicamento" : "Añadir Medicamento"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        
        
        
        </div>

        {/* Lista de Medicamentos */}
        <div className="grid gap-6">
          {medications.map((medication) => (
            <Card key={medication.id} className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Pill className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-green-800">{medication.name}</CardTitle>
                      <CardDescription>
                        {medication.dosage} • {medication.format} • {medication.frequency}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(medication)}
                    <Button variant="ghost" size="sm" onClick={() => handleEditMedication(medication)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMedicationToDelete(medication)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Horarios</p>
                      <p className="text-sm text-gray-600">{medication.times.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duración</p>
                      <p className="text-sm text-gray-600">
                        {new Date(medication.startDate).toLocaleDateString()} -{" "}
                        {medication.endDate ? new Date(medication.endDate).toLocaleDateString() : "Indefinido"}
                      </p>
                    </div>
                  </div>

                  {medication.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notas</p>
                      <p className="text-sm text-gray-600">{medication.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {medications.length === 0 && (
          <Card className="border-green-200 text-center py-12">
            <CardContent>
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes medicamentos registrados</h3>
              <p className="text-gray-600 mb-4">Añade tu primer medicamento para comenzar a gestionar tu tratamiento</p>
              <Button className="bg-green-700 hover:bg-green-800" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Medicamento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar medicamento?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar <strong>{medicationToDelete?.name}</strong>. ¿Estás seguro?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (medicationToDelete) {
                  await handleDeleteMedication(medicationToDelete.id)
                  setIsDeleteDialogOpen(false)
                  setMedicationToDelete(null)
                }
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}