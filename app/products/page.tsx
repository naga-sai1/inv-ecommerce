"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Star, Filter, Grid, List } from "lucide-react"
import { getProducts, getCategories } from "@/lib/database"
import AddToCartButton from "../components/add-to-cart-button"
import type { Product, Category } from "@/lib/supabase"

const priceRanges = [
  { label: "Under ₹200", min: 0, max: 200 },
  { label: "₹200 - ₹500", min: 200, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "Over ₹1000", min: 1000, max: 10000 },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [showInStockOnly, setShowInStockOnly] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        setProducts(productsData)
        const categoryNames = ["All", ...categoriesData.map((cat: Category) => cat.name)]
        setCategories(categoryNames)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStock = !showInStockOnly || product.in_stock
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const priceRange = priceRanges.find((r) => r.label === range)
        return priceRange && product.price >= priceRange.min && product.price <= priceRange.max
      })

    return matchesCategory && matchesSearch && matchesStock && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600">Discover our complete range of RFID cards, NFC solutions, and 3D printed models</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h3>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.label} className="flex items-center space-x-2">
                    <Checkbox
                      id={range.label}
                      checked={selectedPriceRanges.includes(range.label)}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          setSelectedPriceRanges([...selectedPriceRanges, range.label])
                        } else {
                          setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range.label))
                        }
                      }}
                    />
                    <label htmlFor={range.label} className="text-sm cursor-pointer">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={showInStockOnly} 
                  onCheckedChange={(checked) => setShowInStockOnly(checked === true)} 
                />
                <label htmlFor="in-stock" className="text-sm cursor-pointer">
                  In stock only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="text-sm text-gray-600">
              Showing {sortedProducts.length} of {products.length} products
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                className={`hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-row" : ""}`}
              >
                <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <div className="relative">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={`object-cover rounded-t-lg ${
                        viewMode === "list" ? "w-48 h-32 rounded-l-lg rounded-t-none" : "w-full h-48"
                      }`}
                    />
                    {product.badge && <Badge className="absolute top-2 left-2 bg-red-500">{product.badge}</Badge>}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <div className="flex-1">
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <CardTitle className={`mb-2 ${viewMode === "list" ? "text-lg" : "text-lg"}`}>
                      {product.name}
                    </CardTitle>
                    {viewMode === "list" && <p className="text-sm text-gray-600 mb-3">{product.description}</p>}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-blue-600">₹{product.price}</div>
                      {product.original_price && (
                        <div className="text-sm text-gray-500 line-through">₹{product.original_price}</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <AddToCartButton product={product} />
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchQuery("")
                  setSelectedPriceRanges([])
                  setShowInStockOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
