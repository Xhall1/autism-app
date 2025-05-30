"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { ThemeColorProvider } from "@/components/theme-color-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { InitialSetup } from "@/components/initial-setup"

function AppContent({ children }: { children: React.ReactNode }) {
  const { isInitialSetupComplete, setIsInitialSetupComplete } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isInitialSetupComplete) {
        setShowSetup(true)
      }
    }, 3000) // 3 segundos de pantalla de carga

    return () => clearTimeout(timer)
  }, [isInitialSetupComplete])

  const handleSetupComplete = () => {
    setShowSetup(false)
    setIsInitialSetupComplete(true)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  if (showSetup) {
    return <InitialSetup onComplete={handleSetupComplete} />
  }

  return (
    <>
      <ThemeColorProvider />
      {children}
    </>
  )
}

export default AppContent
