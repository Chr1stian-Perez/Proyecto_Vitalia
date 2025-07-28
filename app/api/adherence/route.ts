import { type NextRequest, NextResponse } from "next/server"

// Simulación de logs de adherencia
const adherenceLogs: any[] = []

// POST - Registrar adherencia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = "demo_user_id" // En producción, extraer del token

    const adherenceLog = {
      id: Date.now().toString(),
      userId,
      medicationId: body.medicationId,
      status: body.status, // 'tomado', 'pospuesto', 'omitido'
      scheduledTime: body.scheduledTime,
      actualTime: new Date().toISOString(),
      notes: body.notes || "",
      createdAt: new Date().toISOString(),
    }

    adherenceLogs.push(adherenceLog)

    return NextResponse.json(
      {
        success: true,
        data: adherenceLog,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al registrar adherencia" }, { status: 500 })
  }
}

// GET - Obtener estadísticas de adherencia
export async function GET(request: NextRequest) {
  try {
    const userId = "demo_user_id"
    const userLogs = adherenceLogs.filter((log) => log.userId === userId)

    // Calcular estadísticas
    const totalDoses = userLogs.length
    const takenDoses = userLogs.filter((log) => log.status === "tomado").length
    const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        totalDoses,
        takenDoses,
        adherenceRate: Math.round(adherenceRate),
        logs: userLogs.slice(-50), // Últimos 50 registros
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
