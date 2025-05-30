"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useApp } from "@/lib/app-context"
import {
  Home,
  Award,
  Smile,
  Calendar,
  Palette,
  Volume2,
  VolumeX,
  Music,
  MicOffIcon as MusicOff,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { ParentAccessButton } from "@/components/parent-access-button"

export function AppSidebar() {
  const {
    theme,
    audioEnabled,
    setAudioEnabled,
    musicEnabled,
    setMusicEnabled,
    musicType,
    setMusicType,
    toggleTheme,
    getColorClasses,
    getFavoriteAnimalData,
    accessibilitySettings,
    favoriteColor,
    colorBlindPalettes,
  } = useApp()

  const [showMusicOptions, setShowMusicOptions] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const colorClasses = getColorClasses()
  const favoriteAnimal = getFavoriteAnimalData()

  // Obtener colores para estilos inline cuando sea necesario
const getInlineColorStyle = (type: "bg" | "active" | "text") => {
  if (!accessibilitySettings || !colorBlindPalettes) return {}
  
  const { colorBlindMode, blackWhiteMode, colorBlindType } = accessibilitySettings
  const color = favoriteColor || "purple"

  if (colorBlindMode || blackWhiteMode) {
    if (blackWhiteMode) {
      return type === "bg" ? { backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6" } : {}
    }

    const palette = colorBlindPalettes[colorBlindType] || colorBlindPalettes["normal"]
    const adaptedColor = palette?.[color] || "#888" // fallback seguro

    if (type === "bg") return { backgroundColor: `${adaptedColor}20` }
    if (type === "active") return { backgroundColor: `${adaptedColor}30`, color: adaptedColor }
    if (type === "text") return { color: adaptedColor }
  }

  return {}
}

  const musicOptions = [
    {
      id: "ambient",
      name: "Relajante",
      description: theme === "dark" ? "Acordes ultra suaves" : "Acordes suaves y tranquilos",
      icon: "🎵",
      color: theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800",
    },
    {
      id: "classical",
      name: "Clásica",
      description: theme === "dark" ? "Piano nocturno suave" : "Melodías de piano suaves",
      icon: "🎹",
      color: theme === "dark" ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800",
    },
    {
      id: "nature",
      name: "Naturaleza",
      description: theme === "dark" ? "Sonidos nocturnos" : "Sonidos de bosque y agua",
      icon: theme === "dark" ? "🌙" : "🌿",
      color: theme === "dark" ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800",
    },
    {
      id: "instrumental",
      name: "Instrumental",
      description: theme === "dark" ? "Guitarra susurrante" : "Melodías de guitarra suave",
      icon: "🎸",
      color: theme === "dark" ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-800",
    },
  ]

  const navigationItems = [
    {
      href: "/",
      icon: Home,
      label: "INICIO",
    },
    {
      href: "/recompensas",
      icon: Award,
      label: "Recompensas",
    },
    {
      href: "/emociones",
      icon: Smile,
      label: "Emociones",
    },
    {
      href: "/rutinas",
      icon: Calendar,
      label: "Rutinas",
    },
    {
      href: "/personalizar",
      icon: Palette,
      label: "Personalizar",
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg ${
          theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        } shadow-lg`}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeMobileMenu} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-colors duration-500`}
      >
        <div className="p-6">
          <h1 className={`text-3xl font-bold ${colorClasses.text} mb-8`}>San</h1>

          <nav className="space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                  <button
                    className={`w-full flex items-center justify-start px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? colorClasses.active
                        : theme === "dark"
                          ? `text-gray-300 ${colorClasses.hover}`
                          : `text-gray-600 ${colorClasses.hover}`
                    }`}
                    style={active ? getInlineColorStyle("active") : {}}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* Controles de audio y tema */}
          <div className="mt-8 space-y-3">
            {/* Control de tema */}
            <div className={`p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-800"} transition-colors w-full`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Modo día" : "Modo noche"}
              </button>
              {theme === "dark" && <p className="text-xs text-gray-400 mt-1">Música más suave activada</p>}
            </div>

            <div className={`p-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`flex items-center gap-2 text-sm ${theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-800"} transition-colors w-full`}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {audioEnabled ? "Efectos activados" : "Efectos desactivados"}
              </button>
            </div>

            <div className={`p-4 ${colorClasses.bg} rounded-lg`} style={getInlineColorStyle("bg")}>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`flex items-center justify-between gap-2 text-sm ${colorClasses.text} transition-colors w-full`}
                style={getInlineColorStyle("text")}
              >
                <div className="flex items-center gap-2">
                  {musicEnabled ? <Music className="h-4 w-4" /> : <MusicOff className="h-4 w-4" />}
                  {musicEnabled ? "Música activada" : "Música desactivada"}
                </div>
                {musicEnabled && (
                  <button onClick={() => setShowMusicOptions(!showMusicOptions)}>
                    {showMusicOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
              </button>

              {musicEnabled && showMusicOptions && (
                <div className="mt-3 space-y-2">
                  {musicOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setMusicType(option.id as any)}
                      className={`flex items-center gap-2 w-full p-2 rounded-md text-left text-sm transition-colors ${
                        musicType === option.id
                          ? option.color
                          : theme === "dark"
                            ? "hover:bg-gray-600"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs opacity-80">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <ParentAccessButton />
      </div>
    </>
  )
}
