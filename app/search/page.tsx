"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star, Search } from "lucide-react"
import { getProducts } from "@/lib/database"
import type { Product } from "@/lib/supabase"
import OptimizedImage from "@/components/ui/optimized-image"
import AddToCartButton from "@/app/components/add-to-cart-button"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    setLoading(true)
    try {
      const results = await getProducts({ search: query })
      setProducts(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      // Update URL without page reload
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                {products.length > 0
                  ? `Found ${products.length} result${products.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : `No results found for "${searchQuery}"`}
              </p>
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <OptimizedImage
                        src={product.image_url}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 rounded-t-lg"
                      />
                      {product.badge && <Badge className="absolute top-2 left-2 bg-red-500">{product.badge}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.review_count})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-blue-600">${product.price}</div>
                      {product.original_price && (
                        <div className="text-sm text-gray-500 line-through">${product.original_price}</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <AddToCartButton product={product} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products found matching your search.</p>
              <p className="text-gray-400 mb-8">Try different keywords or browse our categories.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setProducts([])
                }}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Enter a search term to find products.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
