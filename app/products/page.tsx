"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Star, Filter, Grid, List } from "lucide-react";

const products = [
  {
    id: 1,
    name: "RFID Access Card - 125kHz",
    price: 12.99,
    originalPrice: 15.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "RFID Cards",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    inStock: true,
    description: "High-quality 125kHz RFID card for access control systems",
  },
  {
    id: 2,
    name: "NFC Business Card Set (10 pack)",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "NFC Cards",
    rating: 4.9,
    reviews: 89,
    badge: "New",
    inStock: true,
    description: "Professional NFC business cards with custom programming",
  },
  {
    id: 3,
    name: "3D Printed Phone Stand",
    price: 18.5,
    image: "/placeholder.svg?height=300&width=300",
    category: "3D Models",
    rating: 4.7,
    reviews: 156,
    badge: "Popular",
    inStock: true,
    description: "Ergonomic phone stand with adjustable viewing angles",
  },
  {
    id: 4,
    name: "Programmable RFID Key Fob",
    price: 8.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "RFID Cards",
    rating: 4.6,
    reviews: 203,
    badge: "",
    inStock: true,
    description: "Durable RFID key fob with 13.56MHz frequency",
  },
  {
    id: 5,
    name: "NFC Smart Ring",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "NFC Cards",
    rating: 4.5,
    reviews: 67,
    badge: "",
    inStock: false,
    description: "Wearable NFC ring for contactless payments and access",
  },
  {
    id: 6,
    name: "Custom 3D Miniature Figure",
    price: 45.0,
    image: "/placeholder.svg?height=300&width=300",
    category: "3D Models",
    rating: 4.9,
    reviews: 34,
    badge: "Custom",
    inStock: true,
    description: "Personalized 3D printed miniature figure from your photo",
  },
];

const categories = ["All", "RFID Cards", "NFC Cards", "3D Models"];
const priceRanges = [
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 - $25", min: 10, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "Over $50", min: 50, max: 1000 },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStock = !showInStockOnly || product.inStock;
    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const priceRange = priceRanges.find((r) => r.label === range);
        return (
          priceRange &&
          product.price >= priceRange.min &&
          product.price <= priceRange.max
        );
      });

    return matchesCategory && matchesSearch && matchesStock && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600">
          Discover our complete range of RFID cards, NFC solutions, and 3D
          printed models
        </p>
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
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
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
              <label className="block text-sm font-medium mb-2">
                Price Range
              </label>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div
                    key={range.label}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={range.label}
                      checked={selectedPriceRanges.includes(range.label)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPriceRanges([
                            ...selectedPriceRanges,
                            range.label,
                          ]);
                        } else {
                          setSelectedPriceRanges(
                            selectedPriceRanges.filter((r) => r !== range.label)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={range.label}
                      className="text-sm cursor-pointer"
                    >
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
                  onCheckedChange={setShowInStockOnly}
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
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                className={`hover:shadow-lg transition-shadow ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader
                  className={`p-0 ${
                    viewMode === "list" ? "w-48 flex-shrink-0" : ""
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={`object-cover rounded-t-lg ${
                        viewMode === "list"
                          ? "w-48 h-32 rounded-l-lg rounded-t-none"
                          : "w-full h-48"
                      }`}
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {product.badge}
                      </Badge>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <span className="text-white font-semibold">
                          Out of Stock
                        </span>
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
                    <CardTitle
                      className={`mb-2 ${
                        viewMode === "list" ? "text-lg" : "text-lg"
                      }`}
                    >
                      {product.name}
                    </CardTitle>
                    {viewMode === "list" && (
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" disabled={!product.inStock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setSelectedPriceRanges([]);
                  setShowInStockOnly(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
