"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash.substring(1)
        const params = new URLSearchParams(hashFragment)

        // Check if this is an email confirmation
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        const type = params.get("type")

        if (type === "signup" && accessToken && refreshToken) {
          // Set the session with the tokens from the email link
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Session error:", error)
            setStatus("error")
            setMessage("Failed to confirm email. Please try again.")
            return
          }

          if (data.user) {
            setStatus("success")
            setMessage("Email confirmed successfully! Redirecting to your account...")

            // Redirect to home page after a short delay
            setTimeout(() => {
              router.push("/")
            }, 2000)
          }
        } else {
          // No valid confirmation parameters found
          setStatus("error")
          setMessage("Invalid confirmation link. Please check your email and try again.")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("An error occurred during email confirmation.")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === "error" && <XCircle className="h-6 w-6 text-red-600" />}

            {status === "loading" && "Confirming Email..."}
            {status === "success" && "Email Confirmed!"}
            {status === "error" && "Confirmation Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {status === "error" && (
            <div className="space-y-2">
              <Button onClick={() => router.push("/auth/login")} className="w-full">
                Go to Sign In
              </Button>
              <Button variant="outline" onClick={() => router.push("/auth/register")} className="w-full">
                Create New Account
              </Button>
            </div>
          )}

          {status === "success" && (
            <Button onClick={() => router.push("/")} className="w-full">
              Continue to Home
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
