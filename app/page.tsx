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
import { ShoppingCart, Star, Zap, Shield, Printer } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "RFID Access Card - 125kHz",
    price: 599.99,
    image: "/img/RFID Access Card - 125kHz.jpg?height=300&width=300",
    category: "RFID Cards",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "NFC Business Card Set",
    price: 1249.99,
    image: "/img/NFC Business Card Set.jpg?height=300&width=300",
    category: "NFC Cards",
    rating: 4.9,
    reviews: 89,
    badge: "New",
  },
  {
    id: 3,
    name: "3D Printed Phone Stand",
    price: 280.5,
    image: "/img/3D Printed Phone Stand image.jpg?height=300&width=300",
    category: "3D Models",
    rating: 4.7,
    reviews: 156,
    badge: "Popular",
  },
  {
    id: 4,
    name: "Programmable RFID Key Fob",
    price: 398.99,
    image: "/img/Programmable RFID Key Fob.jpg?height=300&width=300",
    category: "RFID Cards",
    rating: 4.6,
    reviews: 203,
    badge: "",
  },
];

const categories = [
  {
    name: "RFID Cards",
    description: "Access control and identification solutions",
    icon: Shield,
    count: 45,
    image: "/img/e181a7bc-aab0-4ea4-8d99-46fe4c62bdd9.jpg?height=300&width=300",
  },
  {
    name: "NFC Cards",
    description: "Smart cards for modern connectivity",
    icon: Zap,
    count: 32,
    image: "/img/nfc-card.jpg?height=200&width=300",
  },
  {
    name: "3D Models",
    description: "Custom printed objects and prototypes",
    icon: Printer,
    count: 78,
    image: "/img/127d23b7-6803-441c-9a0c-f0a206b78450.jpg?height=200&width=300",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div
            className="grid lg:grid-cols-2 gap-12 items-center p-8"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Next-Gen RFID & 3D Solutions
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover premium RFID cards, NFC technology, and custom 3D
                printed models. Your one-stop shop for modern identification and
                prototyping solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-blue-600"
                >
                  View Catalog
                </Button>
              </div>
            </div>
            <div
              className="relative"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                borderRadius: "12px",
              }}
            >
              <Image
                src="/img/3539a6f3-3ff3-48b3-96c4-db9950b588c4.jpg?height=500&width=600"
                alt="RFID and 3D Printing Products"
                width={500}
                height={300}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of RFID cards, NFC solutions, and
              3D printed models
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <category.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {category.count} products
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Browse {category.name}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">
              Discover our most popular and innovative products
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={400}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {product.name}
                  </CardTitle>
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
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{product.price}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600">
              Leading provider of RFID, NFC, and 3D printing solutions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All our RFID and NFC cards are manufactured to the highest
                industry standards
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick turnaround times for both standard products and custom 3D
                prints
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Solutions</h3>
              <p className="text-gray-600">
                Personalized RFID programming and bespoke 3D printing services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Browse our complete catalog or contact us for custom solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              View All Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-purple-600 hover:bg-white hover:text-blue-600"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
