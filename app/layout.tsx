import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import  ClientLayout  from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechCard Pro - RFID, NFC & 3D Printing Solutions",
  description:
    "Premium RFID cards, NFC technology, and custom 3D printed models. Your trusted partner for identification and prototyping solutions.",
  keywords: "RFID cards, NFC cards, 3D printing, access control, identification, custom models",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}