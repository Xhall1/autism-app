import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ParentProvider } from "@/lib/parent-context"
import AppContent from "./client-layout"
import { AppProvider } from "@/lib/app-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "San - App para niños con autismo",
  description: "Aplicación especializada para niños con autismo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="transition-colors duration-500">
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500`}
      >
        <ParentProvider>
          <AppProvider>
            <AppContent>{children}</AppContent>
          </AppProvider>
        </ParentProvider>
      </body>
    </html>
  )
}
