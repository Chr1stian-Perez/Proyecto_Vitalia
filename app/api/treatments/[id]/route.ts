import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos en memoria (compartida con route.ts)
const medications: any[] = []

// PUT - Actualizar medicamento
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const medicationId = params.id
    const userId = "demo_user_id" // En producción, extraer del token

    const medicationIndex = medications.findIndex((med) => med.id === medicationId && med.userId === userId)

    if (medicationIndex === -1) {
      return NextResponse.json({ success: false, error: "Medicamento no encontrado" }, { status: 404 })
    }

    medications[medicationIndex] = {
      ...medications[medicationIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: medications[medicationIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al actualizar medicamento" }, { status: 500 })
  }
}

// DELETE - Eliminar medicamento
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const medicationId = params.id
    const userId = "demo_user_id" // En producción, extraer del token

    const medicationIndex = medications.findIndex((med) => med.id === medicationId && med.userId === userId)

    if (medicationIndex === -1) {
      return NextResponse.json({ success: false, error: "Medicamento no encontrado" }, { status: 404 })
    }

    medications.splice(medicationIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Medicamento eliminado correctamente",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al eliminar medicamento" }, { status: 500 })
  }
}
