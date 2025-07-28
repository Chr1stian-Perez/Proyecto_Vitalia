import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos en memoria
const medications: any[] = [
  {
    id: "1",
    userId: "demo_user_id",
    name: "Omeprazol",
    dosage: "20mg",
    format: "Cápsula",
    frequency: "Una vez al día",
    times: ["08:00"],
    notes: "Tomar antes del desayuno",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    createdAt: new Date().toISOString(),
  },
]

// GET - Obtener medicamentos del usuario
export async function GET(request: NextRequest) {
  try {
    // En producción, extraer el UID del token JWT
    const userId = "demo_user_id" // Simulado

    // Filtrar medicamentos por usuario
    const userMedications = medications.filter((med) => med.userId === userId)

    return NextResponse.json({
      success: true,
      data: userMedications,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener medicamentos" }, { status: 500 })
  }
}

// POST - Crear nuevo medicamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = "demo_user_id" // En producción, extraer del token

    // Validar datos requeridos
    if (!body.name || !body.dosage || !body.startDate) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos" }, { status: 400 })
    }

    const newMedication = {
      id: Date.now().toString(),
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    }

    medications.push(newMedication)

    return NextResponse.json(
      {
        success: true,
        data: newMedication,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al crear medicamento" }, { status: 500 })
  }
}
