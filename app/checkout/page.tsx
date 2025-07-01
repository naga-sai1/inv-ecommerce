"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, ArrowLeft, CheckCircle, Smartphone, Banknote, QrCode } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import OptimizedImage from "@/components/ui/optimized-image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type PaymentMethod = "card" | "upi" | "cod" | "netbanking"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [error, setError] = useState("")
  const [isGuestCheckout, setIsGuestCheckout] = useState(!user)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.profile?.full_name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    postalCode: user?.profile?.postal_code || "",
    country: user?.profile?.country || "India",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    // Card payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    // UPI payment
    upiId: "",
    // Net banking
    bankName: "",
  })

  const tax = totalPrice * 0.18 // 18% GST for India
  const shipping = totalPrice > 500 ? 0 : 50 // Free shipping above ₹500
  const codCharges = paymentMethod === "cod" ? 25 : 0 // COD charges
  const finalTotal = totalPrice + tax + shipping + codCharges

  const handleInputChange = (section: "shipping" | "payment", field: string, value: string) => {
    if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [field]: value }))
    } else {
      setPaymentInfo((prev) => ({ ...prev, [field]: value }))
    }
    setError("")
  }

  const validateForm = () => {
    // Validate shipping information
    if (
      !shippingInfo.fullName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city
    ) {
      setError("Please fill in all required shipping information")
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingInfo.email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(shippingInfo.phone.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }

    // Validate payment information based on method
    if (paymentMethod === "card") {
      if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv || !paymentInfo.nameOnCard) {
        setError("Please fill in all card information")
        return false
      }
    } else if (paymentMethod === "upi") {
      if (!paymentInfo.upiId) {
        setError("Please enter your UPI ID")
        return false
      }
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
      if (!upiRegex.test(paymentInfo.upiId)) {
        setError("Please enter a valid UPI ID")
        return false
      }
    } else if (paymentMethod === "netbanking") {
      if (!paymentInfo.bankName) {
        setError("Please select your bank")
        return false
      }
    }

    return true
  }

  const createGuestOrder = async () => {
    // For guest orders, we'll create a temporary user record or handle differently
    const guestOrderData = {
      user_id: null, // Guest order
      guest_email: shippingInfo.email,
      guest_phone: shippingInfo.phone,
      guest_name: shippingInfo.fullName,
      total_amount: Number(finalTotal.toFixed(2)),
      status: "processing",
      shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      payment_status: paymentMethod === "cod" ? "pending" : "completed",
      payment_method: paymentMethod,
    }

    const { data: order, error: orderError } = await supabase.from("orders").insert([guestOrderData]).select().single()

    if (orderError) {
      throw new Error(`Failed to create guest order: ${orderError.message}`)
    }

    return order
  }

  const updateUserProfile = async () => {
    if (!user || isGuestCheckout) return

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postal_code: shippingInfo.postalCode,
        country: shippingInfo.country,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error updating profile:", error)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Creating order...")
      console.log("Payment method:", paymentMethod)
      console.log("Is guest checkout:", isGuestCheckout)

      let order

      if (isGuestCheckout || !user) {
        // Guest checkout
        order = await createGuestOrder()
      } else {
        // Logged in user checkout
        await updateUserProfile()

        const orderData = {
          user_id: user.id,
          total_amount: Number(finalTotal.toFixed(2)),
          status: "processing",
          shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
          payment_status: paymentMethod === "cod" ? "pending" : "completed",
          payment_method: paymentMethod,
        }

        const { data: orderResult, error: orderError } = await supabase
          .from("orders")
          .insert([orderData])
          .select()
          .single()

        if (orderError) {
          throw new Error(`Failed to create order: ${orderError.message}`)
        }

        order = orderResult
      }

      if (!order) {
        throw new Error("Order was not created properly")
      }

      console.log("Order created successfully:", order)

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.product.price.toFixed(2)),
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Order items creation error:", itemsError)
        // Clean up the order if items failed
        await supabase.from("orders").delete().eq("id", order.id)
        throw new Error(`Failed to create order items: ${itemsError.message}`)
      }

      console.log("Order items created successfully")

      // Clear cart
      await clearCart()

      setOrderId(order.id)
      setOrderComplete(true)
    } catch (error: any) {
      console.error("Order error:", error)
      setError(error.message || "Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard">Name on Card *</Label>
              <Input
                id="nameOnCard"
                value={paymentInfo.nameOnCard}
                onChange={(e) => handleInputChange("payment", "nameOnCard", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={(e) => handleInputChange("payment", "cardNumber", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => handleInputChange("payment", "expiryDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={(e) => handleInputChange("payment", "cvv", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID *</Label>
              <Input
                id="upiId"
                placeholder="yourname@paytm"
                value={paymentInfo.upiId}
                onChange={(e) => handleInputChange("payment", "upiId", e.target.value)}
                required
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <QrCode className="h-4 w-4 inline mr-2" />
                You will be redirected to your UPI app to complete the payment
              </p>
            </div>
          </div>
        )

      case "netbanking":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Select Your Bank *</Label>
              <select
                id="bankName"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={paymentInfo.bankName}
                onChange={(e) => handleInputChange("payment", "bankName", e.target.value)}
                required
              >
                <option value="">Select Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                You will be redirected to your bank's secure website to complete the payment
              </p>
            </div>
          </div>
        )

      case "cod":
        return (
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-800">
              <Banknote className="h-4 w-4 inline mr-2" />
              Pay ₹{finalTotal.toFixed(2)} when your order is delivered. Additional COD charges: ₹25
            </p>
          </div>
        )

      default:
        return null
    }
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Thank you for your order. Your order #{orderId.slice(0, 8)} has been confirmed and is being processed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">Order Total: ₹{finalTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600">
                {paymentMethod === "cod"
                  ? "Pay when delivered. You will receive a call before delivery."
                  : "Payment completed successfully. You will receive an email confirmation shortly."}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              {user && (
                <Link href="/profile?tab=orders">
                  <Button>View Orders</Button>
                </Link>
              )}
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Guest/User Toggle */}
      {!user && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Already have an account?</h3>
                <p className="text-sm text-gray-600">Sign in for faster checkout</p>
              </div>
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange("shipping", "fullName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange("shipping", "email", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="10-digit mobile number"
                  value={shippingInfo.phone}
                  onChange={(e) => handleInputChange("shipping", "phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="House no, Street, Area"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("shipping", "address", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">PIN Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="6-digit PIN"
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange("shipping", "postalCode", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingInfo.country}
                    onChange={(e) => handleInputChange("shipping", "country", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-4 w-4" />
                    UPI (PhonePe, Paytm, GPay)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Lock className="h-4 w-4" />
                    Net Banking
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-4 w-4" />
                    Cash on Delivery (+₹25)
                  </Label>
                </div>
              </RadioGroup>

              {/* Payment Form */}
              <div className="mt-4">{renderPaymentForm()}</div>

              {paymentMethod !== "cod" && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  Your payment information is secure and encrypted
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <OptimizedImage
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {codCharges > 0 && (
                  <div className="flex justify-between">
                    <span>COD Charges</span>
                    <span>₹{codCharges}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? "Processing..." : `Place Order - ₹${finalTotal.toFixed(2)}`}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {paymentMethod === "cod"
                  ? "Pay when your order is delivered to your doorstep"
                  : "This is a demo checkout. No real payment will be processed."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
