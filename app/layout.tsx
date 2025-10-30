import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import QueryProvider from "@/components/workflow/QueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Voice-Over Studio | NodeOps",
  description: "Transform text into professional voiceovers with AI - powered by ElevenLabs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
} 