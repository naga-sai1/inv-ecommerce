"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  Heart,
  CreditCard,
  Zap,
  Shield,
  Printer,
  LogOut,
  Settings,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user, signOut } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  // Check if user is admin
  const isAdmin =
    user && (user.email?.includes("admin") || user.profile?.role === "admin" || user.email === "admin@techcardpro.com")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">INV Tech Card Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-600 p-6 no-underline outline-none focus:shadow-md text-white"
                          href="/products"
                        >
                          <CreditCard className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">All Products</div>
                          <p className="text-sm leading-tight text-blue-100">
                            Browse our complete catalog of RFID, NFC, and 3D printed solutions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-2">
                      <Link
                        href="/products?category=RFID Cards"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                      >
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">RFID Cards</div>
                          <div className="text-sm text-gray-500">Access control solutions</div>
                        </div>
                      </Link>
                      <Link
                        href="/products?category=NFC Cards"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                      >
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">NFC Cards</div>
                          <div className="text-sm text-gray-500">Smart connectivity cards</div>
                        </div>
                      </Link>
                      <Link
                        href="/products?category=3D Models"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50"
                      >
                        <Printer className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">3D Models</div>
                          <div className="text-sm text-gray-500">Custom printed objects</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/about"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/contact"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="search" placeholder="Search products..." className="pl-10 pr-4" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.profile?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <Badge variant="secondary" className="text-xs w-fit">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=orders">Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input type="search" placeholder="Search products..." className="pl-10 pr-4" />
                  </div>
                  <div className="space-y-2">
                    <Link href="/products" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      All Products
                    </Link>
                    <Link href="/products?category=RFID Cards" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      RFID Cards
                    </Link>
                    <Link href="/products?category=NFC Cards" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      NFC Cards
                    </Link>
                    <Link href="/products?category=3D Models" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      3D Models
                    </Link>
                    <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      About
                    </Link>
                    <Link href="/contact" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                      Contact
                    </Link>
                    {user ? (
                      <>
                        <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                          Sign In
                        </Link>
                        <Link href="/auth/register" className="block px-3 py-2 rounded-md hover:bg-gray-100">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
