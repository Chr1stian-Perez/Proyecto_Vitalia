"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllPharmacies } from "@/lib/firebase-pharmacies"
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/firebase-products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  
  //

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "General",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  })

  const handleAddProduct = async () => {
    const newProduct = {
      userId: "demo-user",
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
    }

    const result = await createProduct(newProduct)

    if (result.success) {
      setProducts([...products, result.data as Product]) // ← agrega el producto al estado
      console.log("✅ Producto guardado en Firestore:", result.data)
    } else {
      console.error("❌ Error al guardar producto en Firestore:", result.error)
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    })
    setIsDialogOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    const updates = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stock,
      category: formData.category,
    }

    // 🔁 Actualizar en Firestore
    const result = await updateProduct(editingProduct.id.toString(), updates)

    if (result.success) {
      // 🧠 Actualizar en el estado local
      const updatedProducts = products.map((prod) =>
        prod.id === editingProduct.id ? { ...prod, ...updates } : prod
      )
      setProducts(updatedProducts)
      console.log("✅ Producto actualizado correctamente en Firestore:", updates)
    } else {
      console.error("❌ Error al actualizar producto:", result.error)
    }

    resetForm()
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteProduct = async (id: string) => {
    // El ID de Firestore debe estar en `id` si se guardó desde createProduct
    const result = await deleteProduct(id.toString())

    if (result.success) {
      setProducts(products.filter((prod) => prod.id !== id))
      console.log("🗑️ Producto eliminado correctamente en Firestore. ID:", id)
    } else {
      console.error("❌ Error al eliminar producto en Firestore:", result.error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "General",
    })
  }

  //

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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-700 hover:bg-green-800" onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-green-800">
                          {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProduct
                            ? "Modifica los datos del producto"
                            : "Añade un nuevo producto al inventario"}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Producto</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Paracetamol 500mg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ej: Analgésico para dolor leve"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Precio</Label>
                            <Input
                              id="price"
                              type="number"
                              min={0}
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                              placeholder="Ej: 2.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                              id="stock"
                              type="number"
                              min={0}
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                              placeholder="Ej: 100"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General">General</SelectItem>
                              <SelectItem value="Neurología">Neurología</SelectItem>
                              <SelectItem value="Cardiología">Cardiología</SelectItem>
                              <SelectItem value="Pediatría">Pediatría</SelectItem>
                              <SelectItem value="Ginecología">Ginecología</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                          className="w-full bg-green-700 hover:bg-green-800"
                          disabled={!formData.name || !formData.price || !formData.stock}
                        >
                          {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Lista de Productos */}
                <div className="grid gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="border-green-200">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-green-600" /> {/* Cambia el ícono si prefieres otro */}
                            </div>
                            <div>
                              <CardTitle className="text-green-800">{product.name}</CardTitle>
                              <CardDescription>
                                {product.category} • {product.stock} unidades
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProductToDelete(product)
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Precio</p>
                            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">Descripción</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {products.length === 0 && (
                  <Card className="border-green-200 text-center py-12">
                    <CardContent>
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" /> {/* Puedes usar otro ícono si prefieres */}
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes productos registrados</h3>
                      <p className="text-gray-600 mb-4">
                        Añade tu primer producto para comenzar a gestionar tu inventario
                      </p>
                      <Button className="bg-green-700 hover:bg-green-800" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Añadir Producto
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar <strong>{productToDelete?.name}</strong>. ¿Estás seguro?
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
                if (productToDelete) {
                  await handleDeleteProduct(productToDelete.id)
                  setIsDeleteDialogOpen(false)
                  setProductToDelete(null)
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
