"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ProgressData {
  rutinasCompletadas: number
  diasConsecutivos: number
  emocionesRegistradas: number
  medallasDesbloqueadas: number
  tiempoUsoSemanal: number[]
  ultimaActividad: string
  metasAlcanzadas: number
}

interface ParentContextType {
  isParentMode: boolean
  setIsParentMode: (mode: boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated: (auth: boolean) => void
  progressData: ProgressData
  updateProgress: (data: Partial<ProgressData>) => void
  parentSettings: {
    tiempoLimite: number
    notificacionesActivas: boolean
    reportesSemanal: boolean
    metasDiarias: {
      rutinas: number
      emociones: number
      tiempo: number
    }
  }
  updateParentSettings: (settings: any) => void
}

const ParentContext = createContext<ParentContextType | undefined>(undefined)

export function ParentProvider({ children }: { children: React.ReactNode }) {
  const [isParentMode, setIsParentMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [progressData, setProgressData] = useState<ProgressData>({
    rutinasCompletadas: 15,
    diasConsecutivos: 5,
    emocionesRegistradas: 8,
    medallasDesbloqueadas: 3,
    tiempoUsoSemanal: [45, 60, 30, 75, 50, 40, 55], // minutos por día
    ultimaActividad: "Rutina de la mañana",
    metasAlcanzadas: 12,
  })

  const [parentSettings, setParentSettings] = useState({
    tiempoLimite: 60, // minutos por día
    notificacionesActivas: true,
    reportesSemanal: true,
    metasDiarias: {
      rutinas: 2,
      emociones: 3,
      tiempo: 45,
    },
  })

  const updateProgress = (data: Partial<ProgressData>) => {
    setProgressData((prev) => ({ ...prev, ...data }))
  }

  const updateParentSettings = (settings: any) => {
    setParentSettings((prev) => ({ ...prev, ...settings }))
  }

  // Persistir datos
  useEffect(() => {
    const savedProgress = localStorage.getItem("parent-progress")
    const savedSettings = localStorage.getItem("parent-settings")

    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress))
    }
    if (savedSettings) {
      setParentSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("parent-progress", JSON.stringify(progressData))
  }, [progressData])

  useEffect(() => {
    localStorage.setItem("parent-settings", JSON.stringify(parentSettings))
  }, [parentSettings])

  return (
    <ParentContext.Provider
      value={{
        isParentMode,
        setIsParentMode,
        isAuthenticated,
        setIsAuthenticated,
        progressData,
        updateProgress,
        parentSettings,
        updateParentSettings,
      }}
    >
      {children}
    </ParentContext.Provider>
  )
}

export function useParent() {
  const context = useContext(ParentContext)
  if (context === undefined) {
    throw new Error("useParent must be used within a ParentProvider")
  }
  return context
}
