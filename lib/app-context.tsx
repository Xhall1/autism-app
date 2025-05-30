"use client"

import { useRef } from "react"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

// Añadir nuevos tipos para el animal y color favoritos
type Theme = "light" | "dark"
type MusicType = "ambient" | "classical" | "nature" | "instrumental"
type FavoriteColor = "purple" | "blue" | "teal" | "green" | "pink" | "yellow" | "orange" | "red" | "black" | "white"

interface AccessibilitySettings {
  soundFrequency: number
  colorBlindMode: boolean
  colorBlindType: "normal" | "protanopia" | "deuteranopia" | "tritanopia"
  blackWhiteMode: boolean
  reducedMotion: boolean
  highContrast: boolean
}

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
  musicEnabled: boolean
  setMusicEnabled: (enabled: boolean) => void
  musicType: MusicType
  setMusicType: (type: MusicType) => void
  toggleTheme: () => void
  medallasDesbloqueadas: number[]
  desbloquearMedalla: (medallaId: number) => void
  favoriteAnimal: number
  setFavoriteAnimal: (animalId: number) => void
  favoriteColor: FavoriteColor
  setFavoriteColor: (color: FavoriteColor) => void
  getColorClasses: () => any
  getFavoriteAnimalData: () => any
  accessibilitySettings: AccessibilitySettings
  setAccessibilitySettings: (settings: AccessibilitySettings) => void
  isInitialSetupComplete: boolean
  setIsInitialSetupComplete: (complete: boolean) => void
  getAdaptedColor: (originalColor: string) => string
  getAdaptedGradient: (gradient: string) => string
  getAdaptedBorder: (border: string) => string
  userName: string
  setUserName: (name: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Datos de los animales
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

// Mapeo de colores mejorado
const colorClasses = {
  purple: {
    text: { light: "text-purple-600", dark: "text-purple-400" },
    hover: { light: "hover:text-purple-600 hover:bg-purple-50", dark: "hover:text-purple-400 hover:bg-purple-900/30" },
    active: { light: "bg-purple-200 text-purple-800", dark: "bg-purple-900/50 text-purple-300" },
    bg: { light: "bg-purple-50", dark: "bg-purple-900/30" },
  },
  blue: {
    text: { light: "text-blue-600", dark: "text-blue-400" },
    hover: { light: "hover:text-blue-600 hover:bg-blue-50", dark: "hover:text-blue-400 hover:bg-blue-900/30" },
    active: { light: "bg-blue-200 text-blue-800", dark: "bg-blue-900/50 text-blue-300" },
    bg: { light: "bg-blue-50", dark: "bg-blue-900/30" },
  },
  teal: {
    text: { light: "text-teal-600", dark: "text-teal-400" },
    hover: { light: "hover:text-teal-600 hover:bg-teal-50", dark: "hover:text-teal-400 hover:bg-teal-900/30" },
    active: { light: "bg-teal-200 text-teal-800", dark: "bg-teal-900/50 text-teal-300" },
    bg: { light: "bg-teal-50", dark: "bg-teal-900/30" },
  },
  green: {
    text: { light: "text-green-600", dark: "text-green-400" },
    hover: { light: "hover:text-green-600 hover:bg-green-50", dark: "hover:text-green-400 hover:bg-green-900/30" },
    active: { light: "bg-green-200 text-green-800", dark: "bg-green-900/50 text-green-300" },
    bg: { light: "bg-green-50", dark: "bg-green-900/30" },
  },
  pink: {
    text: { light: "text-pink-600", dark: "text-pink-400" },
    hover: { light: "hover:text-pink-600 hover:bg-pink-50", dark: "hover:text-pink-400 hover:bg-pink-900/30" },
    active: { light: "bg-pink-200 text-pink-800", dark: "bg-pink-900/50 text-pink-300" },
    bg: { light: "bg-pink-50", dark: "bg-pink-900/30" },
  },
  yellow: {
    text: { light: "text-yellow-600", dark: "text-yellow-400" },
    hover: { light: "hover:text-yellow-600 hover:bg-yellow-50", dark: "hover:text-yellow-400 hover:bg-yellow-900/30" },
    active: { light: "bg-yellow-200 text-yellow-800", dark: "bg-yellow-900/50 text-yellow-300" },
    bg: { light: "bg-yellow-50", dark: "bg-yellow-900/30" },
  },
  orange: {
    text: { light: "text-orange-600", dark: "text-orange-400" },
    hover: { light: "hover:text-orange-600 hover:bg-orange-50", dark: "hover:text-orange-400 hover:bg-orange-900/30" },
    active: { light: "bg-orange-200 text-orange-800", dark: "bg-orange-900/50 text-orange-300" },
    bg: { light: "bg-orange-50", dark: "bg-orange-900/30" },
  },
  red: {
    text: { light: "text-red-600", dark: "text-red-400" },
    hover: { light: "hover:text-red-600 hover:bg-red-50", dark: "hover:text-red-400 hover:bg-red-900/30" },
    active: { light: "bg-red-200 text-red-800", dark: "bg-red-900/50 text-red-300" },
    bg: { light: "bg-red-50", dark: "bg-red-900/30" },
  },
  black: {
    text: { light: "text-gray-800", dark: "text-gray-300" },
    hover: { light: "hover:text-gray-800 hover:bg-gray-100", dark: "hover:text-gray-300 hover:bg-gray-700" },
    active: { light: "bg-gray-200 text-gray-900", dark: "bg-gray-700 text-gray-200" },
    bg: { light: "bg-gray-100", dark: "bg-gray-700" },
  },
  white: {
    text: { light: "text-gray-600", dark: "text-gray-300" },
    hover: { light: "hover:text-gray-700 hover:bg-gray-50", dark: "hover:text-gray-200 hover:bg-gray-800" },
    active: { light: "bg-gray-100 text-gray-800", dark: "bg-gray-800 text-gray-200" },
    bg: { light: "bg-gray-50", dark: "bg-gray-800" },
  },
}

// Paletas de colores científicamente precisas para daltonismo
const colorBlindPalettes = {
  normal: {
    // Colores normales
    red: "#DC2626",
    green: "#16A34A",
    blue: "#2563EB",
    yellow: "#CA8A04",
    purple: "#9333EA",
    orange: "#EA580C",
    pink: "#EC4899",
    teal: "#0D9488",
    gray: "#6B7280",
  },
  protanopia: {
    // Dificultad con rojos - usar azules y amarillos
    red: "#1D4ED8", // Azul fuerte en lugar de rojo
    green: "#CA8A04", // Amarillo en lugar de verde
    blue: "#2563EB", // Azul se mantiene
    yellow: "#F59E0B", // Amarillo más intenso
    purple: "#3B82F6", // Azul en lugar de púrpura
    orange: "#F59E0B", // Amarillo en lugar de naranja
    pink: "#60A5FA", // Azul claro en lugar de rosa
    teal: "#06B6D4", // Cian se mantiene bien
    gray: "#6B7280", // Gris se mantiene
  },
  deuteranopia: {
    // Dificultad con verdes - usar azules y naranjas
    red: "#DC2626", // Rojo se mantiene
    green: "#F97316", // Naranja en lugar de verde
    blue: "#2563EB", // Azul se mantiene
    yellow: "#F59E0B", // Amarillo se mantiene
    purple: "#7C3AED", // Púrpura se mantiene
    orange: "#EA580C", // Naranja se mantiene
    pink: "#F472B6", // Rosa se mantiene
    teal: "#0EA5E9", // Azul cian en lugar de teal
    gray: "#6B7280", // Gris se mantiene
  },
  tritanopia: {
    // Dificultad con azules - usar rojos y verdes
    red: "#DC2626", // Rojo se mantiene
    green: "#16A34A", // Verde se mantiene
    blue: "#059669", // Verde en lugar de azul
    yellow: "#DC2626", // Rojo en lugar de amarillo
    purple: "#BE185D", // Rosa fuerte en lugar de púrpura
    orange: "#EA580C", // Naranja se mantiene
    pink: "#EC4899", // Rosa se mantiene
    teal: "#16A34A", // Verde en lugar de teal
    gray: "#6B7280", // Gris se mantiene
  },
}

// Añadir los nuevos estados en el AppProvider
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light")
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicType, setMusicType] = useState<MusicType>("ambient")
  const [medallasDesbloqueadas, setMedallasDesbloqueadas] = useState<number[]>([1, 2, 3])
  const [favoriteAnimal, setFavoriteAnimal] = useState<number>(10) // Oso por defecto
  const [favoriteColor, setFavoriteColor] = useState<FavoriteColor>("purple") // Púrpura por defecto
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    soundFrequency: 440,
    colorBlindMode: false,
    colorBlindType: "normal",
    blackWhiteMode: false,
    reducedMotion: false,
    highContrast: false,
  })

  // Referencias para el manejo de música
  const musicContextRef = useRef<AudioContext | null>(null)
  const musicNodesRef = useRef<{
    oscillators: OscillatorNode[]
    gainNodes: GainNode[]
    masterGain: GainNode | null
    interval: NodeJS.Timeout | null
  }>({
    oscillators: [],
    gainNodes: [],
    masterGain: null,
    interval: null,
  })

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Aplicar el tema globalmente al documento
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const desbloquearMedalla = (medallaId: number) => {
    setMedallasDesbloqueadas((prev) => {
      if (!prev.includes(medallaId)) {
        return [...prev, medallaId]
      }
      return prev
    })
  }

  // Función para obtener las clases de color según la preferencia y accesibilidad
  const getColorClasses = () => {
    // Si está activado el modo blanco y negro
    if (accessibilitySettings.blackWhiteMode) {
      return {
        text: theme === "dark" ? "text-gray-300" : "text-gray-700",
        hover: theme === "dark" ? "hover:text-gray-200 hover:bg-gray-700" : "hover:text-gray-800 hover:bg-gray-100",
        active: theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800",
        bg: theme === "dark" ? "bg-gray-700" : "bg-gray-100",
      }
    }

    // Modo normal o con adaptaciones para daltonismo
    const colors = colorClasses[favoriteColor] || colorClasses.purple
    const mode = theme === "dark" ? "dark" : "light"

    let baseClasses = {
      text: colors.text[mode],
      hover: colors.hover[mode],
      active: colors.active[mode],
      bg: colors.bg[mode],
    }

    // Si está activado el modo daltónico, adaptar los colores
    if (accessibilitySettings.colorBlindMode) {
      const palette = colorBlindPalettes[accessibilitySettings.colorBlindType]
      const adaptedColor = palette[favoriteColor as keyof typeof palette] || palette.purple

      // Crear clases adaptadas manteniendo la estructura
      baseClasses = {
        text: `text-[${adaptedColor}]`,
        hover: `hover:text-[${adaptedColor}] hover:bg-[${adaptedColor}]/10`,
        active: `bg-[${adaptedColor}]/20 text-[${adaptedColor}]`,
        bg: `bg-[${adaptedColor}]/10`,
      }
    }

    return baseClasses
  }

  // Función mejorada para obtener colores específicos adaptados
  const getAdaptedColor = (originalColor: string) => {
    if (accessibilitySettings.blackWhiteMode) {
      // Convertir a escala de grises
      if (originalColor.includes("red") || originalColor.includes("green") || originalColor.includes("blue")) {
        return theme === "dark" ? "text-gray-300" : "text-gray-700"
      }
      return originalColor.replace(/-(red|green|blue|yellow|purple|orange|pink|teal)-/g, "-gray-")
    }

    if (accessibilitySettings.colorBlindMode) {
      const palette = colorBlindPalettes[accessibilitySettings.colorBlindType]

      // Mapear colores específicos
      const colorMap: { [key: string]: string } = {
        "from-yellow-400": `from-[${palette.yellow}]`,
        "to-yellow-600": `to-[${palette.yellow}]`,
        "from-blue-400": `from-[${palette.blue}]`,
        "to-blue-600": `to-[${palette.blue}]`,
        "from-green-400": `from-[${palette.green}]`,
        "to-green-600": `to-[${palette.green}]`,
        "from-red-400": `from-[${palette.red}]`,
        "to-red-600": `to-[${palette.red}]`,
        "from-purple-400": `from-[${palette.purple}]`,
        "to-purple-600": `to-[${palette.purple}]`,
        "from-orange-400": `from-[${palette.orange}]`,
        "to-orange-600": `to-[${palette.orange}]`,
        "border-yellow-400": `border-[${palette.yellow}]`,
        "border-blue-400": `border-[${palette.blue}]`,
        "border-green-400": `border-[${palette.green}]`,
        "border-red-400": `border-[${palette.red}]`,
        "border-purple-400": `border-[${palette.purple}]`,
        "border-orange-400": `border-[${palette.orange}]`,
        "bg-gradient-to-r": "bg-gradient-to-r",
        "shadow-yellow-400/50": `shadow-[${palette.yellow}]/50`,
        "shadow-blue-400/50": `shadow-[${palette.blue}]/50`,
        "shadow-green-400/50": `shadow-[${palette.green}]/50`,
        "shadow-red-400/50": `shadow-[${palette.red}]/50`,
        "shadow-purple-400/50": `shadow-[${palette.purple}]/50`,
        "shadow-orange-400/50": `shadow-[${palette.orange}]/50`,
      }

      return colorMap[originalColor] || originalColor
    }

    return originalColor
  }

  // Función para adaptar gradientes completos
  const getAdaptedGradient = (gradient: string) => {
    if (accessibilitySettings.blackWhiteMode) {
      return gradient.replace(/from-\w+-\d+/g, "from-gray-400").replace(/to-\w+-\d+/g, "to-gray-600")
    }

    if (accessibilitySettings.colorBlindMode) {
      const palette = colorBlindPalettes[accessibilitySettings.colorBlindType]

      return gradient
        .replace(/from-yellow-\d+/g, `from-[${palette.yellow}]`)
        .replace(/to-yellow-\d+/g, `to-[${palette.yellow}]`)
        .replace(/from-blue-\d+/g, `from-[${palette.blue}]`)
        .replace(/to-blue-\d+/g, `to-[${palette.blue}]`)
        .replace(/from-green-\d+/g, `from-[${palette.green}]`)
        .replace(/to-green-\d+/g, `to-[${palette.green}]`)
        .replace(/from-red-\d+/g, `from-[${palette.red}]`)
        .replace(/to-red-\d+/g, `to-[${palette.red}]`)
        .replace(/from-purple-\d+/g, `from-[${palette.purple}]`)
        .replace(/to-purple-\d+/g, `to-[${palette.purple}]`)
        .replace(/from-orange-\d+/g, `from-[${palette.orange}]`)
        .replace(/to-orange-\d+/g, `to-[${palette.orange}]`)
    }

    return gradient
  }

  // Función para adaptar bordes
  const getAdaptedBorder = (border: string) => {
    if (accessibilitySettings.blackWhiteMode) {
      return border.replace(/border-\w+-\d+/g, "border-gray-500")
    }

    if (accessibilitySettings.colorBlindMode) {
      const palette = colorBlindPalettes[accessibilitySettings.colorBlindType]

      return border
        .replace(/border-yellow-\d+/g, `border-[${palette.yellow}]`)
        .replace(/border-blue-\d+/g, `border-[${palette.blue}]`)
        .replace(/border-green-\d+/g, `border-[${palette.green}]`)
        .replace(/border-red-\d+/g, `border-[${palette.red}]`)
        .replace(/border-purple-\d+/g, `border-[${palette.purple}]`)
        .replace(/border-orange-\d+/g, `border-[${palette.orange}]`)
    }

    return border
  }

  // Función para obtener los datos del animal favorito
  const getFavoriteAnimalData = () => {
    return amigos.find((animal) => animal.id === favoriteAnimal) || amigos[9] // Oso por defecto
  }

  // Obtener volumen base según el tema
  const getBaseVolume = () => {
    return theme === "dark" ? 0.05 : 0.1 // Volumen más bajo en modo oscuro
  }

  // Detener música actual - MEJORADO
  const stopCurrentMusic = () => {
    console.log("Stopping music...")

    if (musicNodesRef.current.interval) {
      clearInterval(musicNodesRef.current.interval)
      musicNodesRef.current.interval = null
    }

    if (musicContextRef.current) {
      // Detener todos los osciladores de forma segura
      musicNodesRef.current.oscillators.forEach((osc) => {
        try {
          if (osc.context.state !== "closed") {
            osc.stop()
          }
        } catch (e) {
          // Ignorar errores
        }
      })

      // Desconectar todos los nodos de ganancia
      musicNodesRef.current.gainNodes.forEach((gain) => {
        try {
          if (gain.context.state !== "closed") {
            gain.disconnect()
          }
        } catch (e) {
          // Ignorar errores
        }
      })

      // Cerrar el contexto de audio
      try {
        if (musicContextRef.current.state !== "closed") {
          musicContextRef.current.close()
        }
      } catch (e) {
        // Ignorar errores
      }

      musicContextRef.current = null
      musicNodesRef.current = {
        oscillators: [],
        gainNodes: [],
        masterGain: null,
        interval: null,
      }
    }
  }

  // Crear música ambiental (adaptada para modo oscuro)
  const createAmbientMusic = () => {
    if (!musicEnabled || !isInitialSetupComplete) return

    try {
      stopCurrentMusic()

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      musicContextRef.current = audioContext

      // Crear ganancia master para controlar el volumen general
      const masterGain = audioContext.createGain()
      masterGain.connect(audioContext.destination)
      masterGain.gain.setValueAtTime(getBaseVolume(), audioContext.currentTime)
      musicNodesRef.current.masterGain = masterGain

      // Acordes más suaves para modo nocturno
      const chords =
        theme === "dark"
          ? [
              [130.81, 164.81, 196.0], // C3, E3, G3 (octava más baja)
              [146.83, 184.99, 220.0], // D3, F#3, A3
              [164.81, 207.65, 246.94], // E3, G#3, B3
              [174.61, 220.0, 261.63], // F3, A3, C4
              [196.0, 246.94, 293.66], // G3, B3, D4
              [220.0, 261.63, 329.63], // A3, C4, E4
            ]
          : [
              [261.63, 329.63, 392.0], // C Major (C-E-G)
              [293.66, 369.99, 440.0], // D Minor (D-F-A)
              [329.63, 415.3, 493.88], // E Minor (E-G-B)
              [349.23, 440.0, 523.25], // F Major (F-A-C)
              [392.0, 493.88, 587.33], // G Major (G-B-D)
              [440.0, 523.25, 659.25], // A Minor (A-C-E)
            ]

      let chordIndex = 0

      const playChord = () => {
        if (!musicEnabled || !musicContextRef.current) return

        // Limpiar osciladores anteriores
        musicNodesRef.current.oscillators.forEach((osc) => {
          try {
            osc.stop()
          } catch (e) {
            // Ignorar errores si ya está parado
          }
        })
        musicNodesRef.current.gainNodes.forEach((gain) => {
          try {
            gain.disconnect()
          } catch (e) {
            // Ignorar errores de desconexión
          }
        })

        musicNodesRef.current.oscillators = []
        musicNodesRef.current.gainNodes = []

        const currentChord = chords[chordIndex]
        const currentTime = musicContextRef.current.currentTime

        currentChord.forEach((frequency, index) => {
          const oscillator = musicContextRef.current!.createOscillator()
          const gainNode = musicContextRef.current!.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(masterGain)

          oscillator.frequency.setValueAtTime(frequency, currentTime)
          oscillator.type = "sine"

          // Transiciones más lentas y suaves para modo nocturno
          const fadeTime = theme === "dark" ? 2 : 1
          const sustainTime = theme === "dark" ? 6 : 3
          const totalTime = theme === "dark" ? 8 : 4

          gainNode.gain.setValueAtTime(0, currentTime)
          gainNode.gain.linearRampToValueAtTime(theme === "dark" ? 0.015 : 0.03, currentTime + fadeTime)
          gainNode.gain.linearRampToValueAtTime(theme === "dark" ? 0.015 : 0.03, currentTime + sustainTime)
          gainNode.gain.linearRampToValueAtTime(0, currentTime + totalTime)

          oscillator.start(currentTime)
          oscillator.stop(currentTime + totalTime)

          musicNodesRef.current.oscillators.push(oscillator)
          musicNodesRef.current.gainNodes.push(gainNode)
        })

        chordIndex = (chordIndex + 1) % chords.length
      }

      // Iniciar la música con el primer acorde
      playChord()

      // Continuar con acordes (más lento en modo nocturno)
      const interval = theme === "dark" ? 8000 : 4000
      const musicInterval = setInterval(() => {
        if (musicEnabled) {
          playChord()
        } else {
          clearInterval(musicInterval)
        }
      }, interval)

      musicNodesRef.current.interval = musicInterval

      return () => {
        clearInterval(musicInterval)
        stopCurrentMusic()
      }
    } catch (error) {
      console.log("Error creating ambient music:", error)
    }
  }

  // Crear música clásica (adaptada para modo oscuro)
  const createClassicalMusic = () => {
    if (!musicEnabled || !isInitialSetupComplete) return

    try {
      stopCurrentMusic()

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      musicContextRef.current = audioContext

      const masterGain = audioContext.createGain()
      masterGain.connect(audioContext.destination)
      masterGain.gain.setValueAtTime(getBaseVolume(), audioContext.currentTime)
      musicNodesRef.current.masterGain = masterGain

      // Notas más graves y lentas para modo nocturno
      const pianoNotes =
        theme === "dark"
          ? [
              { note: 130.81, duration: 1.5 }, // C3
              { note: 146.83, duration: 1.5 }, // D3
              { note: 164.81, duration: 1.5 }, // E3
              { note: 174.61, duration: 1.5 }, // F3
              { note: 196.0, duration: 1.5 }, // G3
              { note: 220.0, duration: 1.5 }, // A3
              { note: 246.94, duration: 1.5 }, // B3
              { note: 261.63, duration: 2.0 }, // C4 (más largo)
            ]
          : [
              { note: 261.63, duration: 0.5 }, // C4
              { note: 293.66, duration: 0.5 }, // D4
              { note: 329.63, duration: 0.5 }, // E4
              { note: 349.23, duration: 0.5 }, // F4
              { note: 392.0, duration: 0.5 }, // G4
              { note: 440.0, duration: 0.5 }, // A4
              { note: 493.88, duration: 0.5 }, // B4
              { note: 523.25, duration: 0.5 }, // C5
              { note: 493.88, duration: 0.5 }, // B4
              { note: 440.0, duration: 0.5 }, // A4
              { note: 392.0, duration: 0.5 }, // G4
              { note: 349.23, duration: 0.5 }, // F4
              { note: 329.63, duration: 0.5 }, // E4
              { note: 293.66, duration: 0.5 }, // D4
              { note: 261.63, duration: 1.0 }, // C4 (más largo)
            ]

      let noteIndex = 0

      const playPianoNote = () => {
        if (!musicEnabled || !musicContextRef.current) return

        const currentNote = pianoNotes[noteIndex]
        const currentTime = musicContextRef.current.currentTime

        const oscillator = musicContextRef.current.createOscillator()
        const gainNode = musicContextRef.current.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(masterGain)

        oscillator.frequency.setValueAtTime(currentNote.note, currentTime)
        oscillator.type = "triangle"

        // Envolvente más suave para modo nocturno
        const attackTime = theme === "dark" ? 0.1 : 0.05
        const maxGain = theme === "dark" ? 0.03 : 0.1
        const decayGain = theme === "dark" ? 0.015 : 0.05

        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(maxGain, currentTime + attackTime)
        gainNode.gain.linearRampToValueAtTime(decayGain, currentTime + 0.2)
        gainNode.gain.linearRampToValueAtTime(decayGain, currentTime + currentNote.duration * 0.8)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + currentNote.duration)

        oscillator.start(currentTime)
        oscillator.stop(currentTime + currentNote.duration)

        musicNodesRef.current.oscillators.push(oscillator)
        musicNodesRef.current.gainNodes.push(gainNode)

        noteIndex = (noteIndex + 1) % pianoNotes.length

        const nextNoteTime = currentTime + currentNote.duration
        const timeoutDuration = (nextNoteTime - audioContext.currentTime) * 1000

        const timeout = setTimeout(() => {
          playPianoNote()
        }, timeoutDuration)

        return () => clearTimeout(timeout)
      }

      playPianoNote()

      const keepAliveInterval = setInterval(() => {
        if (!musicEnabled) {
          clearInterval(keepAliveInterval)
          stopCurrentMusic()
        }
      }, 5000)

      musicNodesRef.current.interval = keepAliveInterval

      return () => {
        clearInterval(keepAliveInterval)
        stopCurrentMusic()
      }
    } catch (error) {
      console.log("Error creating classical music:", error)
    }
  }

  // Crear sonidos de naturaleza (adaptados para modo nocturno)
  const createNatureMusic = () => {
    if (!musicEnabled || !isInitialSetupComplete) return

    try {
      stopCurrentMusic()

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      musicContextRef.current = audioContext

      const masterGain = audioContext.createGain()
      masterGain.connect(audioContext.destination)
      masterGain.gain.setValueAtTime(getBaseVolume(), audioContext.currentTime)
      musicNodesRef.current.masterGain = masterGain

      // Función para crear sonido de agua (más suave en modo nocturno)
      const createWaterSound = () => {
        if (!musicContextRef.current || musicContextRef.current !== audioContext) return

        const currentTime = audioContext.currentTime
        const bufferSize = 2 * audioContext.sampleRate
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = noiseBuffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }

        const whiteNoise = audioContext.createBufferSource()
        whiteNoise.buffer = noiseBuffer
        whiteNoise.loop = true

        const filter = audioContext.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = theme === "dark" ? 500 : 1000
        filter.Q.value = 1.0

        const gainNode = audioContext.createGain()
        gainNode.gain.setValueAtTime(theme === "dark" ? 0.005 : 0.01, currentTime)

        whiteNoise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(masterGain)

        whiteNoise.start(currentTime)

        musicNodesRef.current.oscillators.push(whiteNoise as unknown as OscillatorNode)
        musicNodesRef.current.gainNodes.push(gainNode)

        // Modulación más lenta en modo nocturno
        const lfoFrequency = audioContext.createOscillator()
        lfoFrequency.frequency.value = theme === "dark" ? 0.1 : 0.2
        const lfoGain = audioContext.createGain()
        lfoGain.gain.value = theme === "dark" ? 100 : 200

        lfoFrequency.connect(lfoGain)
        lfoGain.connect(filter.frequency)
        lfoFrequency.start(currentTime)

        musicNodesRef.current.oscillators.push(lfoFrequency)
      }

      // Variable para controlar si el contexto sigue activo
      let isContextActive = true

      // Función para crear sonidos nocturnos (grillos en lugar de pájaros)
      const createNightSound = () => {
        if (!musicEnabled || !isContextActive || !musicContextRef.current || musicContextRef.current !== audioContext)
          return

        const currentTime = audioContext.currentTime

        if (theme === "dark") {
          // Sonido de grillos
          const cricketOsc = audioContext.createOscillator()
          const cricketGain = audioContext.createGain()

          cricketOsc.frequency.setValueAtTime(3000 + Math.random() * 1000, currentTime)
          cricketOsc.type = "square"

          cricketGain.gain.setValueAtTime(0, currentTime)
          cricketGain.gain.linearRampToValueAtTime(0.005, currentTime + 0.05)
          cricketGain.gain.linearRampToValueAtTime(0, currentTime + 0.1)

          cricketOsc.connect(cricketGain)
          cricketGain.connect(masterGain)

          cricketOsc.start(currentTime)
          cricketOsc.stop(currentTime + 0.1)

          musicNodesRef.current.oscillators.push(cricketOsc)
          musicNodesRef.current.gainNodes.push(cricketGain)

          // Próximo sonido de grillo
          const nextCricketTime = Math.random() * 3000 + 2000
          const timeout = setTimeout(() => {
            if (musicEnabled && musicType === "nature" && theme === "dark" && isContextActive) {
              createNightSound()
            }
          }, nextCricketTime)

          return () => clearTimeout(timeout)
        } else {
          // Sonido de pájaros (modo día)
          const birdOsc = audioContext.createOscillator()
          const birdGain = audioContext.createGain()

          const baseFreq = 2000 + Math.random() * 1000
          birdOsc.frequency.setValueAtTime(baseFreq, currentTime)
          birdOsc.type = "sine"

          birdGain.gain.setValueAtTime(0, currentTime)
          birdGain.gain.linearRampToValueAtTime(0.02, currentTime + 0.1)
          birdGain.gain.linearRampToValueAtTime(0, currentTime + 0.3)

          birdOsc.connect(birdGain)
          birdGain.connect(masterGain)

          birdOsc.start(currentTime)
          birdOsc.stop(currentTime + 0.3)

          musicNodesRef.current.oscillators.push(birdOsc)
          musicNodesRef.current.gainNodes.push(birdGain)

          const nextBirdTime = Math.random() * 5000 + 3000
          const timeout = setTimeout(() => {
            if (musicEnabled && musicType === "nature" && theme === "light" && isContextActive) {
              createNightSound()
            }
          }, nextBirdTime)

          return () => clearTimeout(timeout)
        }
      }

      // Función para crear sonido de viento (más suave en modo nocturno)
      const createWindSound = () => {
        if (!musicContextRef.current || musicContextRef.current !== audioContext) return

        const currentTime = audioContext.currentTime
        const bufferSize = 2 * audioContext.sampleRate
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = noiseBuffer.getChannelData(0)

        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.969 * b2 + white * 0.153852
          b3 = 0.8665 * b3 + white * 0.3104856
          b4 = 0.55 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.016898
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
          output[i] *= 0.11
        }

        const pinkNoise = audioContext.createBufferSource()
        pinkNoise.buffer = noiseBuffer
        pinkNoise.loop = true

        const filter = audioContext.createBiquadFilter()
        filter.type = "bandpass"
        filter.frequency.value = theme === "dark" ? 200 : 400
        filter.Q.value = 0.5

        const gainNode = audioContext.createGain()
        gainNode.gain.setValueAtTime(theme === "dark" ? 0.003 : 0.01, currentTime)

        pinkNoise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(masterGain)

        pinkNoise.start(currentTime)

        musicNodesRef.current.oscillators.push(pinkNoise as unknown as OscillatorNode)
        musicNodesRef.current.gainNodes.push(gainNode)

        // Modulación más lenta en modo nocturno
        const lfoGain = audioContext.createOscillator()
        const lfoGainAmp = audioContext.createGain()
        lfoGain.frequency.value = theme === "dark" ? 0.02 : 0.05
        lfoGainAmp.gain.value = theme === "dark" ? 0.001 : 0.005

        lfoGain.connect(lfoGainAmp)
        lfoGainAmp.connect(gainNode.gain)
        lfoGain.start(currentTime)

        musicNodesRef.current.oscillators.push(lfoGain)
      }

      createWaterSound()
      createWindSound()
      createNightSound()

      const keepAliveInterval = setInterval(() => {
        if (!musicEnabled || musicType !== "nature") {
          isContextActive = false
          clearInterval(keepAliveInterval)
          stopCurrentMusic()
        }
      }, 5000)

      musicNodesRef.current.interval = keepAliveInterval

      return () => {
        isContextActive = false
        clearInterval(keepAliveInterval)
        stopCurrentMusic()
      }
    } catch (error) {
      console.log("Error creating nature sounds:", error)
    }
  }

  // Crear música instrumental (adaptada para modo nocturno)
  const createInstrumentalMusic = () => {
    if (!musicEnabled || !isInitialSetupComplete) return

    try {
      stopCurrentMusic()

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      musicContextRef.current = audioContext

      const masterGain = audioContext.createGain()
      masterGain.connect(audioContext.destination)
      masterGain.gain.setValueAtTime(getBaseVolume(), audioContext.currentTime)
      musicNodesRef.current.masterGain = masterGain

      // Patrones más graves y lentos para modo nocturno
      const guitarPattern =
        theme === "dark"
          ? [
              { notes: [98.0, 146.83, 185.0], duration: 2.0 }, // G2, D3, F#3 (octava más baja)
              { notes: [110.0, 164.81, 196.0], duration: 2.0 }, // A2, E3, G3
              { notes: [123.47, 185.0, 220.0], duration: 2.0 }, // B2, F#3, A3
              { notes: [98.0, 146.83, 196.0], duration: 2.0 }, // G2, D3, G3
            ]
          : [
              { notes: [196.0, 293.66, 370.0], duration: 1.0 }, // G, D, F# (G major)
              { notes: [220.0, 329.63, 392.0], duration: 1.0 }, // A, E, G (A minor)
              { notes: [246.94, 370.0, 440.0], duration: 1.0 }, // B, F#, A (B minor)
              { notes: [196.0, 293.66, 392.0], duration: 1.0 }, // G, D, G (G major)
            ]

      let patternIndex = 0

      const playGuitarPattern = () => {
        if (!musicEnabled || !musicContextRef.current) return

        const currentPattern = guitarPattern[patternIndex]
        const currentTime = musicContextRef.current.currentTime

        // Limpiar osciladores anteriores
        musicNodesRef.current.oscillators.forEach((osc) => {
          try {
            osc.stop()
          } catch (e) {
            // Ignorar errores si ya está parado
          }
        })
        musicNodesRef.current.gainNodes.forEach((gain) => {
          try {
            gain.disconnect()
          } catch (e) {
            // Ignorar errores de desconexión
          }
        })

        musicNodesRef.current.oscillators = []
        musicNodesRef.current.gainNodes = []

        // Tocar cada nota del acorde en secuencia (arpegio más lento en modo nocturno)
        const noteSpacing = theme === "dark" ? 0.5 : 0.2
        currentPattern.notes.forEach((note, index) => {
          const oscillator = musicContextRef.current!.createOscillator()
          const gainNode = musicContextRef.current!.createGain()

          const filter = musicContextRef.current!.createBiquadFilter()
          filter.type = "lowpass"
          filter.frequency.value = theme === "dark" ? 1000 : 2000 // Filtro más suave en modo nocturno

          oscillator.connect(filter)
          filter.connect(gainNode)
          gainNode.connect(masterGain)

          oscillator.frequency.setValueAtTime(note, currentTime + index * noteSpacing)
          oscillator.type = "triangle"

          const startTime = currentTime + index * noteSpacing
          const maxGain = theme === "dark" ? 0.02 : 0.05
          const sustainTime = theme === "dark" ? 1.0 : 0.5
          const releaseTime = theme === "dark" ? 1.5 : 0.8

          gainNode.gain.setValueAtTime(0, startTime)
          gainNode.gain.linearRampToValueAtTime(maxGain, startTime + 0.02)
          gainNode.gain.exponentialRampToValueAtTime(maxGain * 0.3, startTime + sustainTime)
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + releaseTime)

          oscillator.start(startTime)
          oscillator.stop(startTime + releaseTime)

          musicNodesRef.current.oscillators.push(oscillator)
          musicNodesRef.current.gainNodes.push(gainNode)
        })

        patternIndex = (patternIndex + 1) % guitarPattern.length
      }

      playGuitarPattern()

      // Intervalo más lento en modo nocturno
      const interval = theme === "dark" ? 4000 : 2000
      const musicInterval = setInterval(() => {
        if (musicEnabled && musicType === "instrumental") {
          playGuitarPattern()
        } else {
          clearInterval(musicInterval)
        }
      }, interval)

      musicNodesRef.current.interval = musicInterval

      return () => {
        clearInterval(musicInterval)
        stopCurrentMusic()
      }
    } catch (error) {
      console.log("Error creating instrumental music:", error)
    }
  }

  // Iniciar música según el tipo seleccionado (SOLO después de completar configuración inicial)
  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (musicEnabled && isInitialSetupComplete) {
      const timer = setTimeout(() => {
        switch (musicType) {
          case "ambient":
            cleanup = createAmbientMusic()
            break
          case "classical":
            cleanup = createClassicalMusic()
            break
          case "nature":
            cleanup = createNatureMusic()
            break
          case "instrumental":
            cleanup = createInstrumentalMusic()
            break
        }
      }, 1000)

      return () => {
        clearTimeout(timer)
        if (cleanup) cleanup()
      }
    } else {
      stopCurrentMusic()
    }

    return () => {
      if (cleanup) cleanup()
    }
  }, [musicEnabled, musicType, theme, isInitialSetupComplete])

  // NUEVO: Effect para detener música cuando se desactiva
  useEffect(() => {
    if (!musicEnabled) {
      stopCurrentMusic()
    }
  }, [musicEnabled])

  // Limpiar al desmontar el componente
  useEffect(() => {
    return () => {
      stopCurrentMusic()
    }
  }, [])

  // Aplicar tema al documento cuando cambie
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [theme])

  // Cargar configuración inicial
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme
    const savedAudio = localStorage.getItem("app-audio")
    const savedMusic = localStorage.getItem("app-music")
    const savedMusicType = localStorage.getItem("app-music-type") as MusicType
    const savedMedallas = localStorage.getItem("medallas-desbloqueadas")
    const savedFavoriteAnimal = localStorage.getItem("favorite-animal")
    const savedFavoriteColor = localStorage.getItem("favorite-color") as FavoriteColor
    const savedSetupComplete = localStorage.getItem("initial-setup-complete")
    const savedAccessibilitySettings = localStorage.getItem("accessibility-settings")
    const savedUserName = localStorage.getItem("user-name")

    if (savedTheme) setTheme(savedTheme)
    if (savedAudio !== null) setAudioEnabled(savedAudio === "true")
    if (savedMusic !== null) setMusicEnabled(savedMusic === "true")
    if (savedMusicType) setMusicType(savedMusicType)
    if (savedMedallas) setMedallasDesbloqueadas(JSON.parse(savedMedallas))
    if (savedFavoriteAnimal) setFavoriteAnimal(Number.parseInt(savedFavoriteAnimal))
    if (savedFavoriteColor) setFavoriteColor(savedFavoriteColor)
    if (savedSetupComplete) setIsInitialSetupComplete(savedSetupComplete === "true")
    if (savedAccessibilitySettings) setAccessibilitySettings(JSON.parse(savedAccessibilitySettings))
    if (savedUserName) setUserName(savedUserName)
  }, [])

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem("app-theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("app-audio", audioEnabled.toString())
  }, [audioEnabled])

  useEffect(() => {
    localStorage.setItem("app-music", musicEnabled.toString())
  }, [musicEnabled])

  useEffect(() => {
    localStorage.setItem("app-music-type", musicType)
  }, [musicType])

  useEffect(() => {
    localStorage.setItem("medallas-desbloqueadas", JSON.stringify(medallasDesbloqueadas))
  }, [medallasDesbloqueadas])

  useEffect(() => {
    localStorage.setItem("favorite-animal", favoriteAnimal.toString())
  }, [favoriteAnimal])

  useEffect(() => {
    localStorage.setItem("favorite-color", favoriteColor)
  }, [favoriteColor])

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(accessibilitySettings))
  }, [accessibilitySettings])

  useEffect(() => {
    localStorage.setItem("user-name", userName)
  }, [userName])

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        audioEnabled,
        setAudioEnabled,
        musicEnabled,
        setMusicEnabled,
        musicType,
        setMusicType,
        toggleTheme,
        medallasDesbloqueadas,
        desbloquearMedalla,
        favoriteAnimal,
        setFavoriteAnimal,
        favoriteColor,
        setFavoriteColor,
        getColorClasses,
        getFavoriteAnimalData,
        accessibilitySettings,
        setAccessibilitySettings,
        isInitialSetupComplete,
        setIsInitialSetupComplete,
        getAdaptedColor,
        getAdaptedGradient,
        getAdaptedBorder,
        userName,
        setUserName,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
