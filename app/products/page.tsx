"use client"

import { useEffect, useState } from "react"
import { getAllProducts } from "@/lib/firebase-products"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
    id: string
    name: string
    price: number
    stock: number
    category: string
    description: string
}

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchProducts = async () => {
        const result = await getAllProducts()
        if (result.success) {
            setProducts(result.data || [])
            console.log("✅ Productos cargados:", result.data)
        } else {
            console.error("❌ Error al cargar productos:", result.error)
        }
        }

        fetchProducts()
    }, [])

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-green-50">
        {/* Encabezado con botón regresar */}
        <div className="relative mb-6 h-12 flex items-center justify-end">
            {/* Título centrado */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-green-800">
                Catálogo de Productos
            </h1>

            {/* Botón Regresar alineado a la derecha */}
            <Button className="bg-green-700 hover:bg-green-800" onClick={() => router.push("/pharmacy")}>
                ⬅️ Regresar
            </Button>
        </div>

        {/* Grid de productos */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
            <Card key={product.id} className="border-green-200">
                <CardHeader>
                <CardTitle className="text-green-800">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-gray-700 mb-2">
                    <strong>Precio:</strong> ${product.price}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    <strong>Stock:</strong> {product.stock}
                </p>
                <Badge variant="secondary">{product.category}</Badge>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    )
}
