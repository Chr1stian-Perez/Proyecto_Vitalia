import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase-config"

export interface Product {
    name: string
    description: string
    price: number
    stock: number
    category: string
}

export const getAllProducts = async () => {
    try {
        const snapshot = await getDocs(collection(db, "products"))
        const data = snapshot.docs.map((doc) => {
        const product = doc.data()
        return {
            id: doc.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            description: product.description,
        }
        })

        console.log("✅ Productos cargados desde Firestore:", data) // ✔️ Consola añadida aquí

        return { success: true, data }
    } catch (error: any) {
        console.error("❌ Error al obtener productos:", error.message) // ✔️ Consola de error
        return { success: false, error: error.message }
    }
}

export const createProduct = async (productData: Product) => {
    try {
        const newProduct = {
        ...productData,
        active: true,
        createdAt: new Date().toISOString(),
        }

        console.log("📦 Preparando creación de producto:", newProduct)

        const docRef = await addDoc(collection(db, "products"), newProduct)

        console.log(`✅ Producto creado con ID: ${docRef.id}`)

        return { success: true, data: { id: docRef.id, ...newProduct } }
    } catch (error: any) {
        console.error("❌ Error al crear producto:", error.message)
        return { success: false, error: error.message }
    }
}

export const updateProduct = async (productId: string, updates: Product) => {
    try {
        const productRef = doc(db, "products", productId)

        const updatePayload = {
        ...updates,
        updatedAt: new Date().toISOString(),
        }

        await updateDoc(productRef, updatePayload)

        console.log(`🔄 Producto ${productId} actualizado con:`, updatePayload)

        return { success: true }
    } catch (error: any) {
        console.error(`❌ Error al actualizar producto ${productId}:`, error.message)
        return { success: false, error: error.message }
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        const productRef = doc(db, "products", productId)
        await deleteDoc(productRef) // 🔥 Esto elimina el documento completo

        console.log(`🗑️ Producto ${productId} eliminado completamente de Firestore`)
        return { success: true }
    } catch (error: any) {
        console.error(`❌ Error al eliminar producto ${productId}:`, error.message)
        return { success: false, error: error.message }
    }
}

/*export const seedProducts = async () => {
    const products = [
        { name: "Paracetamol 500mg", price: 2.0, stock: 200, category: "Analgésico", description: "Alivia el dolor y la fiebre" },
        { name: "Ibuprofeno 400mg", price: 2.5, stock: 180, category: "Antiinflamatorio", description: "Reduce inflamación y dolor" },
        { name: "Amoxicilina 500mg", price: 5.0, stock: 80, category: "Antibiótico", description: "Tratamiento de infecciones" },
        { name: "Omeprazol 20mg", price: 3.5, stock: 120, category: "Gastroenterología", description: "Reduce la acidez estomacal" },
        { name: "Metformina 500mg", price: 4.0, stock: 140, category: "Diabetes", description: "Controla niveles de glucosa" },
        { name: "Losartán 50mg", price: 3.8, stock: 100, category: "Cardiología", description: "Regula la presión arterial" },
        { name: "Atorvastatina 20mg", price: 4.2, stock: 90, category: "Cardiología", description: "Reduce colesterol en sangre" },
        { name: "Vitamina C 500mg", price: 1.5, stock: 300, category: "Vitaminas", description: "Refuerza el sistema inmune" },
        { name: "Cetirizina 10mg", price: 2.2, stock: 160, category: "Antialérgico", description: "Alivia síntomas de alergia" },
        { name: "Salbutamol Inhalador", price: 6.0, stock: 50, category: "Respiratorio", description: "Alivia crisis asmáticas" },
        { name: "Ácido Fólico 5mg", price: 1.8, stock: 210, category: "Suplemento", description: "Prevención de anemia" },
        { name: "Clonazepam 2mg", price: 2.6, stock: 70, category: "Neurología", description: "Tratamiento de convulsiones" },
        { name: "Enalapril 10mg", price: 2.9, stock: 110, category: "Cardiología", description: "Antihipertensivo oral" },
        { name: "Loratadina 10mg", price: 1.9, stock: 200, category: "Antialérgico", description: "Alivio de rinitis y urticaria" },
        { name: "Diclofenaco Sódico 50mg", price: 2.3, stock: 130, category: "Antiinflamatorio", description: "Alivio de dolores musculares" },
        { name: "Prednisona 20mg", price: 3.0, stock: 95, category: "Corticoide", description: "Antiinflamatorio y antialérgico" },
        { name: "Vitamina D 1000UI", price: 2.0, stock: 160, category: "Vitaminas", description: "Ayuda a absorber calcio" },
        { name: "Trimetoprima + Sulfa", price: 4.8, stock: 75, category: "Antibiótico", description: "Infecciones urinarias" },
        { name: "Clorfenamina 4mg", price: 1.7, stock: 180, category: "Antialérgico", description: "Controla síntomas alérgicos" },
        { name: "Bromuro de Ipratropio", price: 5.5, stock: 40, category: "Respiratorio", description: "Alivio en EPOC y asma" },
        { name: "Glibenclamida 5mg", price: 2.4, stock: 100, category: "Diabetes", description: "Estimula secreción de insulina" },
        { name: "Calcio + Vitamina D", price: 3.6, stock: 150, category: "Suplemento", description: "Fortalece huesos y dientes" },
        { name: "Ranitidina 150mg", price: 2.8, stock: 120, category: "Gastroenterología", description: "Alivio de acidez gástrica" },
        { name: "Ketorolaco 10mg", price: 3.0, stock: 90, category: "Analgésico", description: "Analgésico potente" },
        { name: "Clindamicina 300mg", price: 6.5, stock: 70, category: "Antibiótico", description: "Infecciones bacterianas graves" },
        { name: "Simvastatina 20mg", price: 3.3, stock: 110, category: "Cardiología", description: "Reduce colesterol LDL" },
        { name: "Complejo B", price: 2.2, stock: 140, category: "Vitaminas", description: "Sistema nervioso y energía" },
        { name: "Fluconazol 150mg", price: 4.0, stock: 85, category: "Antifúngico", description: "Tratamiento de candidiasis" },
        { name: "Amoxicilina + Ácido Clavulánico", price: 7.2, stock: 60, category: "Antibiótico", description: "Infecciones resistentes" },
        { name: "Levotiroxina 100mcg", price: 2.9, stock: 100, category: "Endocrino", description: "Tratamiento del hipotiroidismo" },
        { name: "Clopidogrel 75mg", price: 5.0, stock: 70, category: "Cardiología", description: "Previene formación de coágulos" },
        { name: "Mebendazol 500mg", price: 1.5, stock: 190, category: "Antiparasitario", description: "Elimina parásitos intestinales" },
        { name: "Aspirina 100mg", price: 1.8, stock: 210, category: "Cardiología", description: "Prevención de infartos" },
        { name: "Ciprofloxacino 500mg", price: 5.5, stock: 90, category: "Antibiótico", description: "Infecciones respiratorias y urinarias" },
        { name: "Dexametasona 4mg", price: 2.0, stock: 140, category: "Corticoide", description: "Antiinflamatorio y antialérgico" },
        { name: "Pantoprazol 40mg", price: 3.6, stock: 100, category: "Gastroenterología", description: "Inhibidor de ácido gástrico" },
        { name: "Hierro + Ácido Fólico", price: 1.9, stock: 200, category: "Suplemento", description: "Prevención de anemia ferropénica" },
        { name: "Loperamida 2mg", price: 1.6, stock: 180, category: "Gastroenterología", description: "Control de diarreas" },
        { name: "Tiamina 100mg", price: 2.0, stock: 130, category: "Vitaminas", description: "Vitamina B1 esencial" },
        { name: "Albendazol 400mg", price: 1.8, stock: 160, category: "Antiparasitario", description: "Tratamiento de lombrices" },
        { name: "Meloxicam 15mg", price: 2.4, stock: 120, category: "Antiinflamatorio", description: "Dolor articular y reumático" },
        { name: "Amlodipina 5mg", price: 2.7, stock: 150, category: "Cardiología", description: "Control de hipertensión" },
        { name: "Naproxeno 500mg", price: 3.0, stock: 100, category: "Antiinflamatorio", description: "Dolores musculares y menstruales" },
        { name: "Furosemida 40mg", price: 2.5, stock: 90, category: "Cardiología", description: "Diurético para insuficiencia cardíaca" },
        { name: "Cimetidina 300mg", price: 2.6, stock: 100, category: "Gastroenterología", description: "Reduce ácido gástrico" },
        { name: "Buscapina Compositum", price: 4.2, stock: 130, category: "Gastrointestinal", description: "Alivio de cólicos y dolor" },
        { name: "Desloratadina 5mg", price: 2.3, stock: 150, category: "Antialérgico", description: "Alivia síntomas de alergia" },
        { name: "Azitromicina 500mg", price: 6.0, stock: 70, category: "Antibiótico", description: "Infecciones respiratorias y dérmicas" },
        { name: "Insulina NPH", price: 12.0, stock: 30, category: "Diabetes", description: "Control de glucosa en sangre" },
        { name: "Multivitamínico Adultos", price: 3.0, stock: 200, category: "Vitaminas", description: "Mejora salud general" }
    ]

    try {
        const batch = products.map((product) => addDoc(collection(db, "products"), product))
        await Promise.all(batch)
        console.log("✅ 50 productos insertados correctamente en Firestore")
    } catch (error: any) {
        console.error("❌ Error al insertar productos:", error.message)
    }
}*/

// seedProducts()