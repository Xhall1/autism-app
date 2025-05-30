"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { useParent } from "@/lib/parent-context"
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ParentLoginPage() {
  const { theme } = useApp()
  const { isAuthenticated, setIsAuthenticated, setIsParentMode } = useParent()
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const correctPin = "1234" // En una app real, esto estaría encriptado

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === correctPin) {
      setIsAuthenticated(true)
      setIsParentMode(true)
      setError("")
      router.push("/padres/dashboard")
    } else {
      setError("PIN incorrecto. Inténtalo de nuevo.")
      setPin("")
    }
  }

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value)
      setError("")
    }
  }

  if (isAuthenticated) {
    router.push("/padres/dashboard")
    return null
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-blue-50"
      }`}
    >
      {/* Back button */}
      <Link href="/" className="fixed top-4 left-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
      </Link>

      <div className={`max-w-md w-full mx-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-8`}>
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 ${
              theme === "dark" ? "bg-orange-900/50" : "bg-orange-100"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <Lock className={`h-8 w-8 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
          </div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-2`}>
            Acceso para Padres
          </h1>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Ingresa tu PIN para acceder al panel de control parental
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
              PIN de 4 dígitos
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-purple-500"
                      : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
                } focus:ring-2 focus:border-transparent`}
                placeholder="••••"
                maxLength={4}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={pin.length !== 4}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              pin.length === 4
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:scale-105"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Acceder al Panel
          </button>
        </form>

        <div className={`mt-8 p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
          <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-2`}>
            ¿Qué puedes hacer aquí?
          </h3>
          <ul className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} space-y-1`}>
            <li>• Ver el progreso detallado de Juan</li>
            <li>• Configurar rutinas personalizadas</li>
            <li>• Establecer metas y límites de tiempo</li>
            <li>• Generar reportes de actividad</li>
            <li>• Ajustar configuraciones de la aplicación</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            PIN por defecto: 1234 (cámbialo en configuraciones)
          </p>
        </div>
      </div>
    </div>
  )
}
