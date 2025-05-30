"use client"

import { useState, useRef } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Volume2,
  VolumeX,
  Palette,
  Heart,
  Settings,
  Sparkles,
  Eye,
  User,
} from "lucide-react"

interface InitialSetupProps {
  onComplete: () => void
}

export function InitialSetup({ onComplete }: InitialSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const {
    favoriteAnimal,
    setFavoriteAnimal,
    favoriteColor,
    setFavoriteColor,
    audioEnabled,
    setAudioEnabled,
    musicEnabled,
    setMusicEnabled,
    musicType,
    setMusicType,
    accessibilitySettings,
    setAccessibilitySettings,
    getFavoriteAnimalData,
    getColorClasses,
    userName,
    setUserName,
    getAdaptedColor,
    getAdaptedGradient,
    getAdaptedBorder,
  } = useApp()

  // Ref para controlar el audio de prueba
  const audioContextRef = useRef<AudioContext | null>(null)
  const currentOscillatorRef = useRef<OscillatorNode | null>(null)

  const totalSteps = 8 // Aumentamos a 8 pasos

  // Datos de animales
  const amigos = [
    { id: 1, emoji: "🦁", nombre: "León", color: "bg-yellow-600" },
    { id: 2, emoji: "🦊", nombre: "Zorro", color: "bg-orange-400" },
    { id: 3, emoji: "🐯", nombre: "Tigre", color: "bg-orange-600" },
    { id: 4, emoji: "🦌", nombre: "Venado", color: "bg-amber-600" },
    { id: 5, emoji: "🐨", nombre: "Koala", color: "bg-gray-400" },
    { id: 6, emoji: "🐧", nombre: "Pingüino", color: "bg-slate-600" },
    { id: 7, emoji: "🐵", nombre: "Mono", color: "bg-amber-700" },
    { id: 8, emoji: "🦜", nombre: "Loro", color: "bg-green-500" },
    { id: 9, emoji: "🦉", nombre: "Búho", color: "bg-amber-800" },
    { id: 10, emoji: "🐻", nombre: "Oso", color: "bg-amber-600" },
  ]

  // Datos de colores con sus valores hexadecimales para simulación precisa
  const colores = [
    { name: "purple", emoji: "💜", label: "Morado", hex: "#9333EA" },
    { name: "blue", emoji: "💙", label: "Azul", hex: "#2563EB" },
    { name: "green", emoji: "💚", label: "Verde", hex: "#16A34A" },
    { name: "pink", emoji: "🩷", label: "Rosa", hex: "#EC4899" },
    { name: "yellow", emoji: "💛", label: "Amarillo", hex: "#CA8A04" },
    { name: "orange", emoji: "🧡", label: "Naranja", hex: "#EA580C" },
    { name: "red", emoji: "❤️", label: "Rojo", hex: "#DC2626" },
    { name: "teal", emoji: "💚", label: "Turquesa", hex: "#0D9488" },
  ]

  // Tipos de música
  const tiposMusica = [
    { type: "ambient", emoji: "🌙", label: "Relajante", description: "Sonidos suaves y calmantes" },
    { type: "classical", emoji: "🎹", label: "Clásica", description: "Melodías de piano tranquilas" },
    { type: "nature", emoji: "🌿", label: "Naturaleza", description: "Sonidos del bosque y agua" },
    { type: "instrumental", emoji: "🎸", label: "Instrumental", description: "Música suave de guitarra" },
  ]

  // Función para simular cómo ve realmente una persona con daltonismo
  const simulateColorBlindness = (hexColor: string, type: string): string => {
    // Convertir hex a RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Matrices de simulación basadas en investigación científica
    // Fuente: https://www.color-blindness.com/coblis-color-blindness-simulator/

    let simR, simG, simB

    switch (type) {
      case "protanopia": // Tipo 1: No ve bien los rojos
        simR = 0.567 * r + 0.433 * g + 0.0 * b
        simG = 0.558 * r + 0.442 * g + 0.0 * b
        simB = 0.0 * r + 0.242 * g + 0.758 * b
        break
      case "deuteranopia": // Tipo 2: No ve bien los verdes
        simR = 0.625 * r + 0.375 * g + 0.0 * b
        simG = 0.7 * r + 0.3 * g + 0.0 * b
        simB = 0.0 * r + 0.3 * g + 0.7 * b
        break
      case "tritanopia": // Tipo 3: No ve bien los azules
        simR = 0.95 * r + 0.05 * g + 0.0 * b
        simG = 0.0 * r + 0.433 * g + 0.567 * b
        simB = 0.0 * r + 0.475 * g + 0.525 * b
        break
      default: // Visión normal
        return hexColor
    }

    // Convertir de nuevo a hex
    const toHex = (c: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(simR)}${toHex(simG)}${toHex(simB)}`
  }

  const handleComplete = () => {
    // Detener cualquier sonido de prueba
    stopTestSound()
    localStorage.setItem("initial-setup-complete", "true")
    onComplete()
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Función para detener el sonido de prueba actual
  const stopTestSound = () => {
    if (currentOscillatorRef.current) {
      try {
        currentOscillatorRef.current.stop()
      } catch (e) {
        // Ignorar errores
      }
      currentOscillatorRef.current = null
    }
  }

  // Función para reproducir sonido en tiempo real mientras se mueve el slider
  const playRealtimeSound = (frequency: number) => {
    if (!audioEnabled) return

    try {
      // Detener sonido anterior
      stopTestSound()

      // Crear nuevo contexto si no existe
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = "sine"

      // Configurar volumen suave
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.2)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)

      currentOscillatorRef.current = oscillator
    } catch (error) {
      console.log("Error playing realtime sound:", error)
    }
  }

  // Función para manejar el cambio de frecuencia con sonido en tiempo real
  const handleFrequencyChange = (value: number) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      soundFrequency: value,
    })
    playRealtimeSound(value)
  }

  const playTestSound = () => {
    playRealtimeSound(accessibilitySettings.soundFrequency)
  }

  const colorClasses = getColorClasses()
  const animalData = getFavoriteAnimalData()

  // Obtener el color actual seleccionado con su valor hexadecimal
  const currentColor = colores.find((c) => c.name === favoriteColor) || colores[0]

  // Obtener cómo ve realmente el niño el color según su tipo de daltonismo
  const simulatedColor = accessibilitySettings.colorBlindMode
    ? simulateColorBlindness(currentColor.hex, accessibilitySettings.colorBlindType)
    : currentColor.hex

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="text-8xl animate-bounce">{animalData.emoji}</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">¡Hola! Soy San</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Te voy a ayudar a configurar tu aplicación especial. Vamos a hacer que todo sea perfecto para ti.
            </p>
            <div className="flex justify-center space-x-2 text-2xl">
              <span className="animate-pulse">🌟</span>
              <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>
                ✨
              </span>
              <span className="animate-pulse" style={{ animationDelay: "1s" }}>
                🎨
              </span>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Eye className="text-blue-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Test de visión de colores</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Vamos a revisar cómo ves los colores. Esto nos ayudará a hacer la aplicación perfecta para ti.
            </p>

            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Test mejorado con círculos de colores más científicos */}

              {/* Test 1: Protanopia (Dificultad con rojos) */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-medium mb-4 text-lg text-gray-800 dark:text-gray-100">
                  Test 1: ¿Puedes ver el número 8 en este círculo?
                </h3>
                <div className="flex justify-center mb-4">
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, 
                      #228B22 0%, #228B22 20%,
                      #DC143C 20%, #DC143C 25%,
                      #228B22 25%, #228B22 30%,
                      #DC143C 30%, #DC143C 35%,
                      #228B22 35%, #228B22 40%,
                      #DC143C 40%, #DC143C 45%,
                      #228B22 45%, #228B22 50%,
                      #DC143C 50%, #DC143C 55%,
                      #228B22 55%, #228B22 60%,
                      #DC143C 60%, #DC143C 65%,
                      #228B22 65%, #228B22 70%,
                      #DC143C 70%, #DC143C 75%,
                      #228B22 75%, #228B22 80%,
                      #DC143C 80%, #DC143C 85%,
                      #228B22 85%, #228B22 90%,
                      #DC143C 90%, #DC143C 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-yellow-400 drop-shadow-lg">8</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: false,
                        colorBlindType: "normal",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "normal" && !accessibilitySettings.colorBlindMode
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ✅ Veo el número 8 claramente
                  </button>
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: true,
                        colorBlindType: "protanopia",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "protanopia"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ❓ No veo ningún número
                  </button>
                </div>
              </div>

              {/* Test 2: Deuteranopia (Dificultad con verdes) */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-medium mb-4 text-lg text-gray-800 dark:text-gray-100">
                  Test 2: ¿Puedes ver el número 3 en este círculo?
                </h3>
                <div className="flex justify-center mb-4">
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, 
                      #FF6347 0%, #FF6347 15%,
                      #32CD32 15%, #32CD32 25%,
                      #FF6347 25%, #FF6347 35%,
                      #32CD32 35%, #32CD32 45%,
                      #FF6347 45%, #FF6347 55%,
                      #32CD32 55%, #32CD32 65%,
                      #FF6347 65%, #FF6347 75%,
                      #32CD32 75%, #32CD32 85%,
                      #FF6347 85%, #FF6347 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white drop-shadow-lg">3</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: false,
                        colorBlindType: "normal",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "normal" && !accessibilitySettings.colorBlindMode
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ✅ Veo el número 3 claramente
                  </button>
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: true,
                        colorBlindType: "deuteranopia",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "deuteranopia"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ❓ No veo ningún número
                  </button>
                </div>
              </div>

              {/* Test 3: Tritanopia (Dificultad con azules) */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-medium mb-4 text-lg text-gray-800 dark:text-gray-100">
                  Test 3: ¿Puedes ver el número 5 en este círculo?
                </h3>
                <div className="flex justify-center mb-4">
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden"
                    style={{
                      background: `radial-gradient(circle, 
                      #FFD700 0%, #FFD700 20%,
                      #4169E1 20%, #4169E1 30%,
                      #FFD700 30%, #FFD700 40%,
                      #4169E1 40%, #4169E1 50%,
                      #FFD700 50%, #FFD700 60%,
                      #4169E1 60%, #4169E1 70%,
                      #FFD700 70%, #FFD700 80%,
                      #4169E1 80%, #4169E1 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-red-600 drop-shadow-lg">5</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: false,
                        colorBlindType: "normal",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "normal" && !accessibilitySettings.colorBlindMode
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ✅ Veo el número 5 claramente
                  </button>
                  <button
                    onClick={() =>
                      setAccessibilitySettings({
                        ...accessibilitySettings,
                        colorBlindMode: true,
                        colorBlindType: "tritanopia",
                      })
                    }
                    className={`p-3 rounded-lg border transition-all ${
                      accessibilitySettings.colorBlindType === "tritanopia"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    ❓ No veo ningún número
                  </button>
                </div>
              </div>

              {/* Resultado del test */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">Resultado de tu test:</h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    {accessibilitySettings.colorBlindMode
                      ? `🎨 Modo especial activado: ${
                          accessibilitySettings.colorBlindType === "protanopia"
                            ? "Ayuda para rojos y verdes (Tipo 1)"
                            : accessibilitySettings.colorBlindType === "deuteranopia"
                              ? "Ayuda para verdes y rojos (Tipo 2)"
                              : accessibilitySettings.colorBlindType === "tritanopia"
                                ? "Ayuda para azules y amarillos (Tipo 3)"
                                : "Colores normales"
                        }`
                      : "👁️ Visión de colores normal - ¡Perfecto!"}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    {accessibilitySettings.colorBlindMode
                      ? "Todos los colores de la aplicación se adaptarán automáticamente para ti"
                      : "Podrás ver todos los colores sin problemas"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <User className="text-green-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">¿Cómo te llamas?</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Me gustaría conocerte mejor. ¿Cuál es tu nombre?</p>

            <div className="max-w-md mx-auto space-y-6">
              <div className="text-6xl">{animalData.emoji}</div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Escribe tu nombre aquí..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-center text-lg p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  maxLength={20}
                />

                {userName && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      ¡Hola {userName}! {animalData.emoji} Me alegra mucho conocerte.
                    </p>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                💡 Puedes cambiar tu nombre cuando quieras en la configuración
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="text-red-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Elige tu amigo favorito</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {userName ? `${userName}, ¿cuál` : "¿Cuál"} de estos amigos te gusta más?
            </p>

            <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto">
              {amigos.map((amigo) => (
                <button
                  key={amigo.id}
                  onClick={() => setFavoriteAnimal(amigo.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    favoriteAnimal === amigo.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-4xl mb-2">{amigo.emoji}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{amigo.nombre}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 font-medium">
                Has elegido: {animalData.emoji} {animalData.nombre}
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Palette className="text-purple-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Elige tu color favorito</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">¿Qué color te hace sentir más feliz?</p>

            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {colores.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setFavoriteColor(color.name as any)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 relative ${
                    favoriteColor === color.name
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="text-3xl mb-2">{color.emoji}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{color.label}</div>

                  {/* Corazón adaptado según daltonismo */}
                  {favoriteColor === color.name && (
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 ${getAdaptedColor("bg-red-500")} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-sm">❤️</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Vista previa de colores con simulación de daltonismo */}
            <div className="mt-8 space-y-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Así ves los colores</h3>

              {/* Explicación educativa */}
              {accessibilitySettings.colorBlindMode && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-6">
                  <p className="text-blue-800 dark:text-blue-300 font-medium">
                    {accessibilitySettings.colorBlindType === "protanopia"
                      ? "Tienes daltonismo tipo 1 (protanopia). Ves diferente los colores rojos."
                      : accessibilitySettings.colorBlindType === "deuteranopia"
                        ? "Tienes daltonismo tipo 2 (deuteranopia). Ves diferente los colores verdes."
                        : "Tienes daltonismo tipo 3 (tritanopia). Ves diferente los colores azules."}
                  </p>
                </div>
              )}

              {/* Paleta de colores como los ve el niño */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  {accessibilitySettings.colorBlindMode ? "Así ves tú los colores:" : "Todos los colores:"}
                </h4>
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                  {colores.map((color) => (
                    <div key={color.name} className="text-center space-y-2">
                      <div
                        className="w-12 h-12 mx-auto rounded-full border-2 border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: accessibilitySettings.colorBlindMode
                            ? simulateColorBlindness(color.hex, accessibilitySettings.colorBlindType)
                            : color.hex,
                        }}
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400">{color.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparación del color seleccionado */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Tu color favorito: {currentColor.label}
                </h4>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  {/* Cómo lo ve el niño */}
                  <div className="text-center space-y-3">
                    <div
                      className="w-24 h-24 mx-auto rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg"
                      style={{ backgroundColor: simulatedColor }}
                    />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {accessibilitySettings.colorBlindMode ? "Como tú lo ves" : "Color normal"}
                    </p>
                  </div>

                  {/* Separador */}
                  {accessibilitySettings.colorBlindMode && (
                    <div className="hidden md:block text-gray-400 dark:text-gray-500 text-2xl">vs</div>
                  )}

                  {/* Color original (solo si tiene daltonismo) */}
                  {accessibilitySettings.colorBlindMode && (
                    <div className="text-center space-y-3">
                      <div
                        className="w-24 h-24 mx-auto rounded-full border-4 border-gray-300 dark:border-gray-600 shadow-lg"
                        style={{ backgroundColor: currentColor.hex }}
                      />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Como lo ven los demás</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Explicación adicional */}
              {accessibilitySettings.colorBlindMode && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    La aplicación adaptará los colores para que puedas distinguirlos mejor.
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Volume2 className="text-green-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Configuración de sonidos</h2>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              {/* Control de audio */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {audioEnabled ? <Volume2 className="text-green-500" /> : <VolumeX className="text-gray-400" />}
                      <span className="font-medium text-gray-800 dark:text-gray-200">Sonidos de la aplicación</span>
                    </div>
                    <Button
                      variant={audioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? "Activado" : "Desactivado"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Frecuencia de sonidos con sonido en tiempo real */}
              {audioEnabled && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <label className="font-medium text-gray-800 dark:text-gray-200">Tono de los sonidos</label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="200"
                          max="800"
                          value={accessibilitySettings.soundFrequency}
                          onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Grave</span>
                          <span>{accessibilitySettings.soundFrequency} Hz</span>
                          <span>Agudo</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                          💡 Mueve la barra para escuchar diferentes tonos
                        </p>
                        <Button variant="outline" size="sm" onClick={playTestSound} className="w-full">
                          🔊 Probar sonido
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Control de música (SIN reproducir durante configuración) */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🎵</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">Música de fondo</span>
                    </div>
                    <Button
                      variant={musicEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMusicEnabled(!musicEnabled)}
                    >
                      {musicEnabled ? "Activada" : "Desactivada"}
                    </Button>
                  </div>

                  {musicEnabled && (
                    <div className="grid grid-cols-2 gap-2">
                      {tiposMusica.map((tipo) => (
                        <button
                          key={tipo.type}
                          onClick={() => setMusicType(tipo.type as any)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            musicType === tipo.type
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="text-lg mb-1">{tipo.emoji}</div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{tipo.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tipo.description}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {musicEnabled && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      La música empezará cuando termines la configuración
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Settings className="text-blue-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Opciones de accesibilidad</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Estas opciones te ayudarán a usar mejor la aplicación
            </p>

            <div className="space-y-4 max-w-md mx-auto">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-gray-200">⚫ Modo blanco y negro</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Sin colores, solo grises</div>
                    </div>
                    <Button
                      variant={accessibilitySettings.blackWhiteMode ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setAccessibilitySettings({
                          ...accessibilitySettings,
                          blackWhiteMode: !accessibilitySettings.blackWhiteMode,
                        })
                      }
                    >
                      {accessibilitySettings.blackWhiteMode ? "Sí" : "No"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-gray-200">🔆 Alto contraste</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Colores más intensos y claros</div>
                    </div>
                    <Button
                      variant={accessibilitySettings.highContrast ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setAccessibilitySettings({
                          ...accessibilitySettings,
                          highContrast: !accessibilitySettings.highContrast,
                        })
                      }
                    >
                      {accessibilitySettings.highContrast ? "Sí" : "No"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-gray-800 dark:text-gray-200">🐌 Movimiento reducido</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Animaciones más lentas</div>
                    </div>
                    <Button
                      variant={accessibilitySettings.reducedMotion ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setAccessibilitySettings({
                          ...accessibilitySettings,
                          reducedMotion: !accessibilitySettings.reducedMotion,
                        })
                      }
                    >
                      {accessibilitySettings.reducedMotion ? "Sí" : "No"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="text-yellow-500" size={32} />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">¡Todo listo!</h2>
            </div>

            <div className="text-6xl animate-bounce">{animalData.emoji}</div>

            <div className="space-y-4 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                {userName ? `¡Perfecto ${userName}!` : "¡Perfecto!"} Tu configuración:
              </h3>

              <div className="space-y-2 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {userName && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Nombre:</span>
                    <span className="text-gray-800 dark:text-gray-200">{userName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Amigo favorito:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {animalData.emoji} {animalData.nombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Color favorito:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {colores.find((c) => c.name === favoriteColor)?.emoji}{" "}
                    {colores.find((c) => c.name === favoriteColor)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Visión de colores:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {accessibilitySettings.colorBlindMode
                      ? `Adaptada (${accessibilitySettings.colorBlindType})`
                      : "Normal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Sonidos:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {audioEnabled ? "Activados" : "Desactivados"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Música:</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {musicEnabled ? tiposMusica.find((t) => t.type === musicType)?.label : "Desactivada"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                ¡Perfecto! Tu aplicación está configurada especialmente para ti. Todos los colores se adaptarán
                automáticamente según tu visión.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-4xl">
        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Paso {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenido del paso */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-500">
          <CardContent className="p-8">{getStepContent()}</CardContent>
        </Card>

        {/* Botones de navegación */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={20} />
            <span>Anterior</span>
          </Button>

          <Button
            onClick={nextStep}
            className="flex items-center space-x-2"
            disabled={currentStep === 2 && !userName.trim()} // Deshabilitar si no hay nombre en el paso 2
          >
            <span>{currentStep === totalSteps - 1 ? "¡Empezar!" : "Siguiente"}</span>
            {currentStep === totalSteps - 1 ? <Check size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>
      </div>
    </div>
  )
}
