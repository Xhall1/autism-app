"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/lib/app-context"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const { getFavoriteAnimalData } = useApp()

  const messages = [
    "¡Hola! Soy San 🐻",
    "Preparando tu espacio especial...",
    "Cargando sonidos relajantes...",
    "¡Ya casi estamos listos!",
  ]

  const animalData = getFavoriteAnimalData()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 750)

    return () => clearInterval(messageInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Mascot animado */}
        <div className="relative">
          <div
            className="text-8xl animate-bounce"
            style={{
              animationDuration: "2s",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            }}
          >
            {animalData.emoji}
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
        </div>

        {/* Mensaje actual */}
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700 transition-all duration-500 ease-in-out" key={currentMessage}>
            {messages[currentMessage]}
          </h1>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-lg text-gray-600 font-medium">{Math.round(progress)}%</p>
        </div>

        {/* Elementos decorativos */}
        <div className="flex justify-center space-x-4 text-3xl">
          <span className="animate-pulse" style={{ animationDelay: "0s" }}>
            🌟
          </span>
          <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>
            🎵
          </span>
          <span className="animate-pulse" style={{ animationDelay: "1s" }}>
            🎨
          </span>
        </div>
      </div>
    </div>
  )
}
