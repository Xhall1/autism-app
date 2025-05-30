"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { useState, useEffect, useRef } from "react"

const amigos = [
  { id: 1, emoji: "🦁", nombre: "León", color: "bg-yellow-600", sonido: "roar" },
  { id: 2, emoji: "🦊", nombre: "Zorro", color: "bg-orange-400", sonido: "fox" },
  { id: 3, emoji: "🐯", nombre: "Tigre", color: "bg-orange-600", sonido: "tiger" },
  { id: 4, emoji: "🦌", nombre: "Venado", color: "bg-amber-600", sonido: "deer" },
  { id: 5, emoji: "🐨", nombre: "Koala", color: "bg-gray-400", sonido: "koala" },
  { id: 6, emoji: "🐧", nombre: "Pingüino", color: "bg-slate-600", sonido: "penguin" },
  { id: 7, emoji: "🐵", nombre: "Mono", color: "bg-amber-700", sonido: "monkey" },
  { id: 8, emoji: "🦜", nombre: "Loro", color: "bg-green-500", sonido: "parrot" },
  { id: 9, emoji: "🦉", nombre: "Búho", color: "bg-amber-800", sonido: "owl" },
  { id: 10, emoji: "🐻", nombre: "Oso", color: "bg-amber-600", sonido: "bear" },
]

const coloresFavoritos = [
  { id: 1, nombre: "Púrpura", color: "bg-gradient-to-br from-purple-500 to-purple-600", value: "purple", nota: 523.25 },
  { id: 2, nombre: "Azul", color: "bg-gradient-to-br from-blue-500 to-blue-600", value: "blue", nota: 587.33 },
  { id: 3, nombre: "Turquesa", color: "bg-gradient-to-br from-teal-400 to-teal-500", value: "teal", nota: 659.25 },
  { id: 4, nombre: "Verde", color: "bg-gradient-to-br from-green-500 to-green-600", value: "green", nota: 698.46 },
  { id: 5, nombre: "Rosa", color: "bg-gradient-to-br from-pink-400 to-pink-500", value: "pink", nota: 783.99 },
  { id: 6, nombre: "Amarillo", color: "bg-gradient-to-br from-yellow-400 to-yellow-500", value: "yellow", nota: 880.0 },
  { id: 7, nombre: "Naranja", color: "bg-gradient-to-br from-orange-400 to-orange-500", value: "orange", nota: 987.77 },
  { id: 8, nombre: "Rojo", color: "bg-gradient-to-br from-red-400 to-red-500", value: "red", nota: 1046.5 },
]

// Función para simular cómo ve realmente una persona con daltonismo
const simulateColorBlindness = (hexColor: string, type: string): string => {
  // Convertir hex a RGB
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  // Matrices de simulación basadas en investigación científica
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

// Colores base para la simulación
const coloresBase = [
  { nombre: "Rojo", hex: "#DC2626" },
  { nombre: "Verde", hex: "#16A34A" },
  { nombre: "Azul", hex: "#2563EB" },
  { nombre: "Amarillo", hex: "#CA8A04" },
  { nombre: "Púrpura", hex: "#9333EA" },
]

export default function PersonalizarPage() {
  const {
    theme,
    setTheme,
    audioEnabled,
    setAudioEnabled,
    musicEnabled,
    setMusicEnabled,
    favoriteAnimal,
    setFavoriteAnimal,
    favoriteColor,
    setFavoriteColor,
    userName,
    setUserName,
    getFavoriteAnimalData,
    getAdaptedColor,
    getAdaptedGradient,
    getAdaptedBorder,
    accessibilitySettings,
    setAccessibilitySettings,
  } = useApp()

  const favoriteAnimalData = getFavoriteAnimalData()
  const [selectedAmigo, setSelectedAmigo] = useState(favoriteAnimal)
  const [selectedColor, setSelectedColor] = useState(coloresFavoritos.find((c) => c.value === favoriteColor)?.id || 1)
  const [tempName, setTempName] = useState(userName || "")
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Estado local para configuraciones de accesibilidad
  const [localAccessibilitySettings, setLocalAccessibilitySettings] = useState({
    colorBlindMode: accessibilitySettings.colorBlindMode,
    colorBlindType: accessibilitySettings.colorBlindType,
    blackWhiteMode: accessibilitySettings.blackWhiteMode,
  })

  // Inicializar AudioContext
  useEffect(() => {
    if (audioEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.log("Error al crear AudioContext:", error)
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [audioEnabled])

  // Función para reproducir sonidos de animales
  const playAnimalSound = (tipoSonido: string) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime
      const baseVolume = theme === "dark" ? 0.08 : 0.12

      switch (tipoSonido) {
        case "roar": // León
          createAnimalSound(audioContext, currentTime, [120, 150, 100], "sawtooth", baseVolume * 0.7, 1.2)
          break
        case "fox": // Zorro
          createAnimalSound(audioContext, currentTime, [800, 600, 800], "square", baseVolume * 0.6, 0.5)
          break
        case "tiger": // Tigre
          createAnimalSound(audioContext, currentTime, [150, 120, 180], "sawtooth", baseVolume * 0.7, 1.0)
          break
        case "deer": // Venado
          createAnimalSound(audioContext, currentTime, [300, 250, 280], "triangle", baseVolume * 0.5, 0.8)
          break
        case "koala": // Koala
          createAnimalSound(audioContext, currentTime, [180, 160, 170], "sawtooth", baseVolume * 0.4, 1.0)
          break
        case "penguin": // Pingüino
          createAnimalSound(audioContext, currentTime, [400, 300, 350], "square", baseVolume * 0.6, 0.6)
          break
        case "monkey": // Mono
          createAnimalSound(audioContext, currentTime, [1000, 1200, 800], "sawtooth", baseVolume * 0.7, 0.4)
          break
        case "parrot": // Loro
          createAnimalSound(audioContext, currentTime, [800, 1200, 600], "square", baseVolume * 0.6, 0.7)
          break
        case "owl": // Búho
          createAnimalSound(audioContext, currentTime, [200, 180, 200], "triangle", baseVolume * 0.5, 0.8)
          break
        case "bear": // Oso
          createAnimalSound(audioContext, currentTime, [140, 120, 130], "sawtooth", baseVolume * 0.6, 0.8)
          break
      }
    } catch (error) {
      console.log("Error al reproducir sonido de animal:", error)
    }
  }

  const createAnimalSound = (
    audioContext: AudioContext,
    startTime: number,
    frequencies: number[],
    type: OscillatorType,
    volume: number,
    duration: number,
  ) => {
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, startTime + index * 0.2)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, startTime + index * 0.2)
      gainNode.gain.linearRampToValueAtTime(volume, startTime + index * 0.2 + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.2 + duration)

      oscillator.start(startTime + index * 0.2)
      oscillator.stop(startTime + index * 0.2 + duration)
    })
  }

  // Función para reproducir sonidos de colores
  const playColorSound = (nota: number) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime
      const baseVolume = theme === "dark" ? 0.06 : 0.1

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(nota, currentTime)
      oscillator.type = "triangle"

      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.4)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + 0.4)
    } catch (error) {
      console.log("Error al reproducir sonido de color:", error)
    }
  }

  // Función para reproducir sonido de confirmación
  const playConfirmationSound = () => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime
      const frequencies = [523.25, 659.25, 783.99, 1046.5] // Do, Mi, Sol, Do alto

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, currentTime + index * 0.15)
        oscillator.type = "sine"

        const baseVolume = theme === "dark" ? 0.08 : 0.12
        gainNode.gain.setValueAtTime(0, currentTime + index * 0.15)
        gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + index * 0.15 + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + index * 0.15 + 0.3)

        oscillator.start(currentTime + index * 0.15)
        oscillator.stop(currentTime + index * 0.15 + 0.3)
      })
    } catch (error) {
      console.log("Error al reproducir sonido de confirmación:", error)
    }
  }

  const handleAmigoSelect = (amigoId: number) => {
    setSelectedAmigo(amigoId)
    const amigo = amigos.find((a) => a.id === amigoId)
    if (amigo) {
      playAnimalSound(amigo.sonido)
    }
  }

  const handleColorSelect = (colorId: number) => {
    setSelectedColor(colorId)
    const color = coloresFavoritos.find((c) => c.id === colorId)
    if (color) {
      playColorSound(color.nota)
    }
  }

  // Manejar cambios en configuraciones de accesibilidad
  const handleAccessibilityChange = (setting: string, value: any) => {
    setLocalAccessibilitySettings((prev) => {
      // Si activamos el modo blanco y negro, desactivamos el modo daltónico
      if (setting === "blackWhiteMode" && value === true) {
        return { ...prev, [setting]: value, colorBlindMode: false }
      }
      // Si activamos el modo daltónico, desactivamos el modo blanco y negro
      if (setting === "colorBlindMode" && value === true) {
        return { ...prev, [setting]: value, blackWhiteMode: false }
      }
      return { ...prev, [setting]: value }
    })
  }

  const handleSaveSettings = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim())
    }
    setFavoriteAnimal(selectedAmigo)
    const selectedColorValue = coloresFavoritos.find((c) => c.id === selectedColor)?.value || "purple"
    setFavoriteColor(selectedColorValue as any)

    // Guardar configuraciones de accesibilidad
    setAccessibilitySettings({
      ...accessibilitySettings,
      colorBlindMode: localAccessibilitySettings.colorBlindMode,
      colorBlindType: localAccessibilitySettings.colorBlindType,
      blackWhiteMode: localAccessibilitySettings.blackWhiteMode,
    })

    playConfirmationSound()
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-pink-50 to-purple-50"}`}
    >
      <AppSidebar />

      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header with user profile */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <span className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {userName || "Juan"}
            </span>
            <div
              className={`h-12 w-12 border-4 ${getAdaptedBorder("border-teal-400")} rounded-full ${amigos.find((a) => a.id === selectedAmigo)?.color} flex items-center justify-center text-white text-xl`}
            >
              {amigos.find((a) => a.id === selectedAmigo)?.emoji}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-48 h-48 mx-auto relative">
                <div
                  className={`w-full h-full ${amigos.find((a) => a.id === selectedAmigo)?.color} rounded-full flex items-center justify-center text-8xl shadow-lg transition-all duration-500 hover:scale-105`}
                >
                  {amigos.find((a) => a.id === selectedAmigo)?.emoji}
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 w-12 h-12 ${getAdaptedColor("bg-yellow-400")} rounded-full flex items-center justify-center text-2xl animate-bounce`}
                >
                  👋
                </div>
              </div>
            </div>
            <h2 className={`text-4xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4`}>
              ¿Cómo quieres que se vea tu amigo?
            </h2>
            <p className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
              ¡Escoge el que más te guste!
            </p>
            <p className={`text-lg font-medium ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
              Ahora eres: {amigos.find((a) => a.id === selectedAmigo)?.nombre}
            </p>
            {audioEnabled && (
              <p className={`text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"} mt-2`}>
                🔊 Haz clic para escuchar cómo suena cada animal de verdad
              </p>
            )}
          </div>

          {/* Save message */}
          {showSaveMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce">
              ¡Configuración guardada! ✅
            </div>
          )}

          {/* User name section */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              👤 Tu Nombre
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  ¿Cómo te llamas?
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Escribe tu nombre aquí..."
                  className={`w-full px-4 py-3 rounded-2xl text-lg border-2 transition-colors duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-purple-400"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-purple-500"
                  } focus:outline-none`}
                />
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Tu nombre aparecerá en toda la aplicación para hacer la experiencia más personal.
              </p>
            </div>
          </div>

          {/* Selección de amigo */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              🐾 Tu Animal Favorito
            </h3>
            <div className="grid grid-cols-5 gap-6">
              {amigos.map((amigo) => (
                <button
                  key={amigo.id}
                  onClick={() => handleAmigoSelect(amigo.id)}
                  className={`relative p-6 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    selectedAmigo === amigo.id
                      ? `ring-4 ${getAdaptedBorder("ring-purple-400")} ${getAdaptedColor("bg-purple-50")} shadow-lg transform scale-105`
                      : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-5xl mb-2 transition-transform duration-200 hover:scale-110">{amigo.emoji}</div>
                  <p
                    className={`text-sm font-medium ${
                      selectedAmigo === amigo.id
                        ? theme === "dark"
                          ? "text-purple-300"
                          : "text-purple-700"
                        : theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                    }`}
                  >
                    {amigo.nombre}
                  </p>
                  {selectedAmigo === amigo.id && (
                    <>
                      <div
                        className={`absolute -top-2 -right-2 w-8 h-8 ${getAdaptedColor("bg-purple-500")} rounded-full flex items-center justify-center animate-pulse`}
                      >
                        <span className="text-white text-lg">❤️</span>
                      </div>
                      <div
                        className={`absolute inset-0 ${getAdaptedColor("bg-purple-200")}/20 rounded-2xl animate-pulse`}
                      ></div>
                    </>
                  )}
                  {audioEnabled && (
                    <div
                      className={`absolute bottom-1 right-1 w-4 h-4 ${getAdaptedColor("bg-blue-500")} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-xs text-white">🔊</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-4`}>
              Tu animal favorito será tu compañero en toda la aplicación.
            </p>
          </div>

          {/* Selección de color favorito */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              🎨 Tu Color Favorito
            </h3>
            {audioEnabled && (
              <p className={`text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"} mb-4`}>
                🎵 Cada color tiene su propia nota musical
              </p>
            )}
            {localAccessibilitySettings.colorBlindMode && (
              <p className={`text-sm ${getAdaptedColor("text-blue-600")} mb-4`}>
                ✨ Los colores se adaptan automáticamente para tu tipo de visión
              </p>
            )}
            <div className="grid grid-cols-4 gap-6">
              {coloresFavoritos.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color.id)}
                  className={`relative group transition-all duration-300 hover:scale-110`}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl ${getAdaptedGradient(color.color)} ${
                      selectedColor === color.id
                        ? `ring-4 ${getAdaptedBorder("ring-purple-400")} shadow-lg transform scale-105`
                        : "hover:shadow-md"
                    } transition-all duration-300`}
                  />
                  <p
                    className={`text-sm font-medium mt-2 ${
                      selectedColor === color.id
                        ? theme === "dark"
                          ? "text-purple-300"
                          : "text-purple-700"
                        : theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                    }`}
                  >
                    {color.nombre}
                  </p>
                  {selectedColor === color.id && (
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 ${getAdaptedColor("bg-purple-500")} rounded-full flex items-center justify-center animate-pulse`}
                    >
                      <span className="text-white text-sm">❤️</span>
                    </div>
                  )}
                  {audioEnabled && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAdaptedColor("bg-blue-500")} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-xs text-white">♪</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-4`}>
              Tu color favorito se usará en toda la aplicación para personalizar tu experiencia.
            </p>
          </div>

          {/* NUEVA SECCIÓN: Configuración de accesibilidad */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              👁️ Accesibilidad Visual
            </h3>

            {/* Modo daltónico */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Modo Daltónico
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Adapta los colores para diferentes tipos de daltonismo
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleAccessibilityChange("colorBlindMode", !localAccessibilitySettings.colorBlindMode)
                  }
                  className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                    localAccessibilitySettings.colorBlindMode
                      ? "bg-green-500"
                      : theme === "dark"
                        ? "bg-gray-600"
                        : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                      localAccessibilitySettings.colorBlindMode ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Selector de tipo de daltonismo */}
              {localAccessibilitySettings.colorBlindMode && (
                <div className="mt-4 pl-4 border-l-4 border-green-500">
                  <h5 className={`text-md font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-3`}>
                    Tipo de Daltonismo:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAccessibilityChange("colorBlindType", "protanopia")}
                      className={`p-3 rounded-xl transition-all ${
                        localAccessibilitySettings.colorBlindType === "protanopia"
                          ? "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="font-medium">Protanopia</div>
                      <div className="text-xs mt-1">Dificultad con rojos</div>
                    </button>
                    <button
                      onClick={() => handleAccessibilityChange("colorBlindType", "deuteranopia")}
                      className={`p-3 rounded-xl transition-all ${
                        localAccessibilitySettings.colorBlindType === "deuteranopia"
                          ? "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="font-medium">Deuteranopia</div>
                      <div className="text-xs mt-1">Dificultad con verdes</div>
                    </button>
                    <button
                      onClick={() => handleAccessibilityChange("colorBlindType", "tritanopia")}
                      className={`p-3 rounded-xl transition-all ${
                        localAccessibilitySettings.colorBlindType === "tritanopia"
                          ? "bg-blue-500 text-white"
                          : theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="font-medium">Tritanopia</div>
                      <div className="text-xs mt-1">Dificultad con azules</div>
                    </button>
                  </div>

                  {/* Muestra de colores adaptados */}
                  <div className="mt-4">
                    <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
                      Así ves tú los colores:
                    </h6>
                    <div className="flex space-x-2">
                      {coloresBase.map((color) => (
                        <div key={color.nombre} className="text-center">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                            style={{
                              backgroundColor: localAccessibilitySettings.colorBlindMode
                                ? simulateColorBlindness(color.hex, localAccessibilitySettings.colorBlindType)
                                : color.hex,
                            }}
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{color.nombre}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comparación con colores normales */}
                    {localAccessibilitySettings.colorBlindMode && (
                      <div className="mt-4">
                        <h6
                          className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}
                        >
                          Como los ven los demás:
                        </h6>
                        <div className="flex space-x-2">
                          {coloresBase.map((color) => (
                            <div key={color.nombre} className="text-center">
                              <div
                                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: color.hex }}
                              />
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{color.nombre}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                      {localAccessibilitySettings.colorBlindMode
                        ? `💡 Arriba: como tú ves los colores con ${localAccessibilitySettings.colorBlindType}. Abajo: como los ven los demás.`
                        : "💡 Estos son los colores normales que puedes ver perfectamente."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modo blanco y negro */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Modo Blanco y Negro
                </h4>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Convierte todos los colores a escala de grises
                </p>
              </div>
              <button
                onClick={() => handleAccessibilityChange("blackWhiteMode", !localAccessibilitySettings.blackWhiteMode)}
                className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                  localAccessibilitySettings.blackWhiteMode
                    ? "bg-green-500"
                    : theme === "dark"
                      ? "bg-gray-600"
                      : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    localAccessibilitySettings.blackWhiteMode ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Muestra de colores en blanco y negro */}
            {localAccessibilitySettings.blackWhiteMode && (
              <div className="mt-4 pl-4 border-l-4 border-green-500">
                <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
                  Así se ven los colores en escala de grises:
                </h6>
                <div className="flex space-x-2">
                  {coloresBase.map((color) => {
                    // Convertir a escala de grises usando la fórmula estándar
                    const r = Number.parseInt(color.hex.slice(1, 3), 16)
                    const g = Number.parseInt(color.hex.slice(3, 5), 16)
                    const b = Number.parseInt(color.hex.slice(5, 7), 16)
                    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
                    const grayHex = `#${gray.toString(16).padStart(2, "0").repeat(3)}`

                    return (
                      <div key={color.nombre} className="text-center">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: grayHex }}
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{color.nombre}</p>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  ⚫⚪ Todos los colores se convierten a diferentes tonos de gris
                </p>
              </div>
            )}

            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-4`}>
              Estas opciones te ayudarán a ver mejor los colores según tus necesidades.
            </p>
          </div>

          {/* Theme selection */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              🌓 Tema de la App
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setTheme("light")}
                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "light"
                    ? "bg-yellow-400 shadow-lg transform scale-105"
                    : theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-4xl mb-2">☀️</div>
                <p
                  className={`font-medium ${
                    theme === "light" ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Modo Claro
                </p>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark" ? "bg-purple-600 shadow-lg transform scale-105" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-4xl mb-2">🌙</div>
                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-700"}`}>Modo Oscuro</p>
              </button>
            </div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-4`}>
              Elige el tema que sea más cómodo para tus ojos.
            </p>
          </div>

          {/* Audio settings */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mb-8`}>
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              🔊 Configuración de Audio
            </h3>
            <div className="space-y-6">
              {/* Audio effects toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Efectos de Sonido
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Sonidos cuando interactúas con botones y elementos
                  </p>
                </div>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                    audioEnabled ? "bg-green-500" : theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                      audioEnabled ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Background music toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Música de Fondo
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Música relajante mientras usas la aplicación
                  </p>
                </div>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-200 ${
                    musicEnabled ? "bg-blue-500" : theme === "dark" ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                      musicEnabled ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="text-center">
            <button
              onClick={handleSaveSettings}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              💾 Guardar Configuración
            </button>
            {audioEnabled && (
              <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                🎉 Escucha la melodía de éxito al guardar
              </p>
            )}
          </div>

          {/* Vista previa */}
          <div className="mt-12 text-center">
            <div className={`inline-block p-6 rounded-3xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <h3 className={`text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4`}>
                ¡Así se ve tu configuración!
              </h3>
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-20 h-20 ${amigos.find((a) => a.id === selectedAmigo)?.color} rounded-full flex items-center justify-center text-4xl shadow-lg transition-transform duration-300 hover:scale-110`}
                >
                  {amigos.find((a) => a.id === selectedAmigo)?.emoji}
                </div>
                <div className="text-left">
                  <p className={`font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {tempName || "Juan"} - {amigos.find((a) => a.id === selectedAmigo)?.nombre}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Color favorito: {coloresFavoritos.find((c) => c.id === selectedColor)?.nombre}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Tema: {theme === "dark" ? "Oscuro" : "Claro"}
                  </p>
                  {audioEnabled && (
                    <p className={`text-xs ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                      🎵 Con sonidos realistas
                    </p>
                  )}
                  {localAccessibilitySettings.colorBlindMode && (
                    <p className={`text-xs ${getAdaptedColor("text-blue-600")} mt-1`}>
                      ✨ Colores adaptados para{" "}
                      {localAccessibilitySettings.colorBlindType === "protanopia"
                        ? "protanopia"
                        : localAccessibilitySettings.colorBlindType === "deuteranopia"
                          ? "deuteranopia"
                          : "tritanopia"}
                    </p>
                  )}
                  {localAccessibilitySettings.blackWhiteMode && (
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>
                      ⚫⚪ Modo escala de grises activado
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
