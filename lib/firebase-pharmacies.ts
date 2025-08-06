import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "./firebase-config"

export interface Pharmacy {
    id: string
    name: string
    address: string
    phone: string
    hours: string
    distanceKm: number
    rating: number
    delivery: boolean
}

export const getAllPharmacies = async (): Promise<{
    success: boolean
    data?: Pharmacy[]
    error?: string
    }> => {
    try {
        const snapshot = await getDocs(collection(db, "pharmacies"))
        const data: Pharmacy[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Pharmacy, "id">), // 🔥 Forzamos a completar el objeto
        }))
        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Insertar farmacias de forma masiva (solo ejecutar una vez)
/*export const seedPharmacies = async () => {
    const pharmacies = [
        {
        name: "Farmacia Cruz Azul",
        address: "Av. 6 de Diciembre y Eloy Alfaro",
        phone: "+593 2 333 1122",
        hours: "24 horas",
        distanceKm: 0.4,
        rating: 4.8,
        delivery: true,
        },
        {
        name: "Farmacia Sana Sana",
        address: "Av. Amazonas N34-122 y Naciones Unidas",
        phone: "+593 2 334 2211",
        hours: "8:00 AM - 9:00 PM",
        distanceKm: 1.0,
        rating: 4.6,
        delivery: true,
        },
        {
        name: "Farmacia Económica",
        address: "Calle Guayaquil y Rocafuerte, Centro Histórico",
        phone: "+593 2 295 4455",
        hours: "7:00 AM - 8:00 PM",
        distanceKm: 2.3,
        rating: 4.5,
        delivery: false,
        },
        {
        name: "Farmacia La Carolina",
        address: "Av. de los Shyris y República del Salvador",
        phone: "+593 2 333 7788",
        hours: "24 horas",
        distanceKm: 0.9,
        rating: 4.9,
        delivery: true,
        },
        {
        name: "Farmacia del Sur",
        address: "Av. Maldonado y Morán Valverde",
        phone: "+593 2 266 3344",
        hours: "7:00 AM - 10:00 PM",
        distanceKm: 3.5,
        rating: 4.4,
        delivery: true,
        },
        {
        name: "Farmacia Quito Norte",
        address: "Av. Galo Plaza y El Inca",
        phone: "+593 2 256 7789",
        hours: "8:00 AM - 9:00 PM",
        distanceKm: 1.8,
        rating: 4.2,
        delivery: false,
        },
        {
        name: "Farmacia Moderna",
        address: "Av. Mariana de Jesús y Nuño de Valderrama",
        phone: "+593 2 243 5599",
        hours: "24 horas",
        distanceKm: 0.7,
        rating: 4.7,
        delivery: true,
        },
        {
        name: "Farmacia MedicPlus",
        address: "Calle Gaspar de Villarroel y Av. Eloy Alfaro",
        phone: "+593 2 223 8899",
        hours: "9:00 AM - 10:00 PM",
        distanceKm: 1.2,
        rating: 4.3,
        delivery: true,
        },
        {
        name: "Farmacia Santa María",
        address: "Av. 10 de Agosto y Checa",
        phone: "+593 2 222 3344",
        hours: "6:00 AM - 9:00 PM",
        distanceKm: 2.0,
        rating: 4.0,
        delivery: false,
        },
        {
        name: "Farmacia del Valle",
        address: "Calle Eloy Alfaro y De los Granados",
        phone: "+593 2 334 9988",
        hours: "7:00 AM - 11:00 PM",
        distanceKm: 2.4,
        rating: 4.6,
        delivery: true,
        },
        {
        name: "Farmacia Salud Total",
        address: "Av. Colón y 10 de Agosto",
        phone: "+593 2 221 5566",
        hours: "24 horas",
        distanceKm: 1.3,
        rating: 4.8,
        delivery: true,
        },
        {
        name: "Farmacia Pichincha",
        address: "Calle Versalles y Juan León Mera",
        phone: "+593 2 228 6677",
        hours: "9:00 AM - 9:00 PM",
        distanceKm: 1.9,
        rating: 4.1,
        delivery: false,
        },
        {
        name: "Farmacia La Floresta",
        address: "Calle Lugo y 12 de Octubre",
        phone: "+593 2 252 7788",
        hours: "8:00 AM - 8:00 PM",
        distanceKm: 2.7,
        rating: 4.5,
        delivery: true,
        },
        {
        name: "Farmacia BioSalud",
        address: "Av. América y La Gasca",
        phone: "+593 2 299 7766",
        hours: "24 horas",
        distanceKm: 1.6,
        rating: 4.7,
        delivery: true,
        },
        {
        name: "Farmacia Quito Sur",
        address: "Calle Ajaví y Mariscal Sucre",
        phone: "+593 2 265 9988",
        hours: "7:00 AM - 10:00 PM",
        distanceKm: 3.0,
        rating: 4.3,
        delivery: false,
        },
        {
        name: "Farmacia Primavera",
        address: "Av. Ilaló y Gribaldo Miño",
        phone: "+593 2 222 8899",
        hours: "9:00 AM - 9:00 PM",
        distanceKm: 4.5,
        rating: 4.6,
        delivery: true,
        },
        {
        name: "Farmacia El Batán",
        address: "Av. Eloy Alfaro y Portugal",
        phone: "+593 2 246 7788",
        hours: "8:00 AM - 9:00 PM",
        distanceKm: 1.0,
        rating: 4.5,
        delivery: true,
        },
        {
        name: "Farmacia Metropolitana",
        address: "Av. Mariana de Jesús y La Prensa",
        phone: "+593 2 229 4455",
        hours: "6:00 AM - 11:00 PM",
        distanceKm: 1.7,
        rating: 4.4,
        delivery: true,
        },
        {
        name: "Farmacia Familiar",
        address: "Av. Rumichaca y Guaranda",
        phone: "+593 2 233 4455",
        hours: "8:00 AM - 10:00 PM",
        distanceKm: 2.6,
        rating: 4.2,
        delivery: false,
        },
        {
        name: "Farmacia Buena Salud",
        address: "Calle Quiteño Libre y Alonso de Angulo",
        phone: "+593 2 267 3344",
        hours: "24 horas",
        distanceKm: 3.8,
        rating: 4.9,
        delivery: true,
        },
    ]

    try {
        const batch = pharmacies.map((pharmacy) => addDoc(collection(db, "pharmacies"), pharmacy))
        await Promise.all(batch)
        console.log("✅ 20 farmacias insertadas correctamente en Firestore")
    } catch (error: any) {
        console.error("❌ Error al insertar farmacias:", error.message)
    }
}*/

// seedPharmacies()