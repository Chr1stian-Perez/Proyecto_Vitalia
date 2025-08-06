"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllPharmacies } from "@/lib/firebase-pharmacies"
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firebase-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import "@/lib/firebase-config"

import {
  Search,
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  MapPin,
  Phone,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

// Datos simulados para el panel de farmacia
const salesData = [
  { month: "Ene", ventas: 45000, pedidos: 120 },
  { month: "Feb", ventas: 52000, pedidos: 140 },
  { month: "Mar", ventas: 48000, pedidos: 135 },
  { month: "Abr", ventas: 61000, pedidos: 165 },
  { month: "May", ventas: 55000, pedidos: 150 },
  { month: "Jun", ventas: 67000, pedidos: 180 },
]

const topProducts = [
  { name: "Omeprazol 20mg", sales: 450, revenue: 13500 },
  { name: "Metformina 500mg", sales: 380, revenue: 11400 },
  { name: "Losartán 50mg", sales: 320, revenue: 9600 },
  { name: "Atorvastatina 20mg", sales: 280, revenue: 8400 },
]

const customerSegments = [
  { name: "Diabetes", value: 35, color: "#2D5016" },
  { name: "Hipertensión", value: 28, color: "#D4AF37" },
  { name: "Gastritis", value: 20, color: "#4A7C59" },
  { name: "Otros", value: 17, color: "#8FBC8F" },
]

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  description: string
}

interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  distanceKm: number
  rating: number
  delivery: boolean
}

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState("customer")
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])

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

  /*
  const pharmacies = [
    {
      id: 1,
      name: "Farmacia San Rafael",
      address: "Av. Principal 123, Centro",
      phone: "+1 234-567-8900",
      rating: 4.8,
      hours: "24 horas",
      distance: "0.5 km",
      hasDelivery: true,
    },
    {
      id: 2,
      name: "Farmacia Moderna",
      address: "Calle 45 #67-89, Norte",
      phone: "+1 234-567-8901",
      rating: 4.6,
      hours: "6:00 AM - 10:00 PM",
      distance: "1.2 km",
      hasDelivery: true,
    },
    {
      id: 3,
      name: "Farmacia Central",
      address: "Plaza Mayor, Local 15",
      phone: "+1 234-567-8902",
      rating: 4.5,
      hours: "7:00 AM - 9:00 PM",
      distance: "2.1 km",
      hasDelivery: false,
    },
  ]*/

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])

  useEffect(() => {
    const fetchPharmacies = async () => {
      const result = await getAllPharmacies()
      if (result.success) {
        setPharmacies(result.data || [])
        console.log("✅ Farmacias cargadas:", result.data)
      } else {
        console.error("❌ Error al cargar farmacias:", result.error)
      }
    }

    fetchPharmacies()
  }, [])
  
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  })

  const handleCreateProduct = async () => {
    const result = await createProduct(newProduct)
    if (result.success) {
      console.log("✅ Producto creado:", result.id)
      setShowCreateForm(false)
      setNewProduct({ name: "", description: "", price: 0, stock: 0, category: "" })
      const updated = await getAllProducts()
      if (updated.success) setProducts(updated.data)
    } else {
      console.error("❌ Error al crear producto:", result.error)
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Farmacias Vitalia</h1>
          <p className="text-gray-600 mt-2">Encuentra medicamentos y gestiona tu farmacia</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Buscar Farmacias</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Panel de Administración</span>
            </TabsTrigger>
          </TabsList>

          {/* Vista del Cliente */}
          <TabsContent value="customer" className="space-y-6">
            {/* Buscador */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Buscar Medicamentos</CardTitle>
                <CardDescription>Encuentra el medicamento que necesitas en farmacias cercanas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar medicamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-green-200"
                    />
                  </div>
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultados de Medicamentos */}
            {searchTerm && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Resultados de Búsqueda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-green-100"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-800">${product.price}</p>
                          <p className="text-sm text-gray-600">{product.stock} disponibles</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Farmacias */}
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold text-green-800">Farmacias Cercanas</h2>
              {pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="border-green-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-green-800">{pharmacy.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{pharmacy.rating}</span>
                          </div>
                          {pharmacy.delivery && <Badge>Delivery</Badge>}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {pharmacy.address} • {pharmacy.distanceKm} km
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{pharmacy.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{pharmacy.hours}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          className="bg-green-700 hover:bg-green-800"
                          onClick={() => router.push("/products")}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Ver Productos
                        </Button>
                        <Button variant="outline" className="border-green-200 text-green-700 bg-transparent">
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Panel de Administración para Farmacias */}
          <TabsContent value="admin" className="space-y-6">
            {/* Métricas del Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Ventas del Mes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">$67,000</div>
                  <p className="text-xs text-green-600">+12% vs mes anterior</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-800">Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-800">180</div>
                  <p className="text-xs text-yellow-600">+8% vs mes anterior</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Productos</CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">1,247</div>
                  <p className="text-xs text-green-600">En catálogo</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-800">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-800">2,341</div>
                  <p className="text-xs text-yellow-600">Activos este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos de Analítica */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Ventas Mensuales</CardTitle>
                  <CardDescription>Evolución de ventas y pedidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0f2e7" />
                      <XAxis dataKey="month" stroke="#2D5016" />
                      <YAxis stroke="#2D5016" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #22c55e",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="ventas" fill="#2D5016" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Segmentación de Clientes</CardTitle>
                  <CardDescription>Distribución por condición médica</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Productos Más Vendidos */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Productos Más Vendidos</CardTitle>
                <CardDescription>Top productos del mes actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-white rounded-lg border border-green-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-800">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.sales} unidades vendidas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-800">${product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Ingresos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Catálogo */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-green-800">Gestión de Catálogo</CardTitle>
                    <CardDescription>Administra tu inventario de productos</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)} className="bg-green-700 hover:bg-green-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Producto
                  </Button>
                  {showCreateForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-xl font-semibold text-green-700 mb-1">Nuevo Producto</h2>
                        <p className="text-sm text-gray-600 mb-4">Agrega un nuevo producto al catálogo</p>

                        <Input
                          placeholder="Nombre del producto"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="mb-2"
                        />
                        <Input
                          placeholder="Descripción"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          className="mb-2"
                        />
                        <div className="flex gap-2 mb-2">
                          <Input
                            type="number"
                            placeholder="Precio"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                          />
                          <Input
                            type="number"
                            placeholder="Stock"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                          />
                        </div>
                        <Input
                          placeholder="Categoría"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="mb-4"
                        />

                        <div className="flex justify-between">
                          <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateProduct}>
                            Añadir Producto
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                            Cancelar
                          </Button>
                        </div>

                        {/* Botón X de cierre arriba a la derecha */}
                        <button
                          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                          onClick={() => setShowCreateForm(false)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 bg-white rounded-lg border border-green-100"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-800">${product.price}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
