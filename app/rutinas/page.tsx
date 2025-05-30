"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const rutinas = [
  {
    id: 1,
    nombre: "Rutina de las mañanas",
    icono: "🌅",
    descripcion: "Comienza tu día con energía",
    pasos: [
      {
        id: 1,
        titulo: "¡Buenos días! Despierta y estírate como San.",
        imagen: "/images/rutina-despertar.png",
        completado: false,
        sonido: "despertar",
      },
      {
        id: 2,
        titulo: "¡Manos limpias y carita fresca!",
        imagen: "/images/rutina-lavarse.png",
        completado: false,
        sonido: "agua",
      },
      {
        id: 3,
        titulo: "Cepilla tus dientes con alegría.",
        imagen: "/images/rutina-cepillar.png",
        completado: false,
        sonido: "cepillar",
      },
      {
        id: 4,
        titulo: "Ponte tu ropa favorita.",
        imagen: "/images/rutina-vestirse.png",
        completado: false,
        sonido: "vestir",
      },
      {
        id: 5,
        titulo: "¡Hora del delicioso desayuno!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "comer",
      },
      {
        id: 6,
        titulo: "¡Listo para un día increíble!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "exito",
      },
    ],
    tiempo: "30 minutos",
    progreso: 0,
    color: "from-orange-400 to-yellow-500",
    bgColor: "from-orange-50 to-yellow-50",
    darkBgColor: "from-orange-900/20 to-yellow-900/20",
  },
  {
    id: 2,
    nombre: "Rutina de la noche",
    icono: "🌙",
    descripcion: "Termina tu día con tranquilidad",
    pasos: [
      {
        id: 1,
        titulo: "Guarda tus juguetes en su lugar.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "organizar",
      },
      {
        id: 2,
        titulo: "¡Hora del baño relajante!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "agua",
      },
      {
        id: 3,
        titulo: "Ponte tu pijama favorita.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "vestir",
      },
      {
        id: 4,
        titulo: "Cepilla tus dientes antes de dormir.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "cepillar",
      },
      {
        id: 5,
        titulo: "Lee un cuento mágico.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "leer",
      },
      {
        id: 6,
        titulo: "¡Dulces sueños, San!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "dormir",
      },
    ],
    tiempo: "45 minutos",
    progreso: 0,
    color: "from-purple-400 to-blue-500",
    bgColor: "from-purple-50 to-blue-50",
    darkBgColor: "from-purple-900/20 to-blue-900/20",
  },
  {
    id: 3,
    nombre: "Rutina de estudio",
    icono: "📚",
    descripcion: "Aprende y crece cada día",
    pasos: [
      {
        id: 1,
        titulo: "Prepara tu escritorio ordenado.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "organizar",
      },
      {
        id: 2,
        titulo: "Saca todos tus materiales.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "preparar",
      },
      {
        id: 3,
        titulo: "¡Hora de hacer la tarea!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "estudiar",
      },
      {
        id: 4,
        titulo: "Revisa todo lo que aprendiste.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "revisar",
      },
      {
        id: 5,
        titulo: "Guarda todo en su lugar.",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "organizar",
      },
      {
        id: 6,
        titulo: "¡Excelente trabajo estudiando!",
        imagen: "/placeholder.svg?height=400&width=400",
        completado: false,
        sonido: "exito",
      },
    ],
    tiempo: "60 minutos",
    progreso: 0,
    color: "from-green-400 to-teal-500",
    bgColor: "from-green-50 to-teal-50",
    darkBgColor: "from-green-900/20 to-teal-900/20",
  },
]

export default function RutinasPage() {
  const {
    theme,
    audioEnabled,
    desbloquearMedalla,
    userName,
    getFavoriteAnimalData,
    getAdaptedGradient,
    getAdaptedBorder,
  } = useApp()
  const favoriteAnimal = getFavoriteAnimalData()

  const [nuevaMedalla, setNuevaMedalla] = useState<{
    id: number
    nombre: string
    imagen: string
    sonido: string
  } | null>(null)
  const [vistaActual, setVistaActual] = useState<"lista" | "rutina">("lista")
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | null>(null)
  const [pasoActual, setPasoActual] = useState(0)
  const [rutinasState, setRutinasState] = useState(rutinas)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [mostrarCelebracion, setMostrarCelebracion] = useState(false)

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

  // Función para reproducir sonidos de rutina (mantengo la función original simplificada)
  const reproducirSonidoRutina = (tipoSonido: string) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime
      const baseVolume = theme === "dark" ? 0.08 : 0.15

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 440
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + 0.5)
    } catch (error) {
      console.log("Error al reproducir sonido de rutina:", error)
    }
  }

  const iniciarRutina = (rutinaId: number) => {
    setRutinaSeleccionada(rutinaId)
    setPasoActual(0)
    setVistaActual("rutina")
  }

  const volverALista = () => {
    setVistaActual("lista")
    setRutinaSeleccionada(null)
    setPasoActual(0)
  }

  const siguientePaso = () => {
    const rutina = rutinasState.find((r) => r.id === rutinaSeleccionada)
    if (rutina && pasoActual < rutina.pasos.length - 1) {
      setPasoActual(pasoActual + 1)
      const siguientePasoData = rutina.pasos[pasoActual + 1]
      if (siguientePasoData) {
        reproducirSonidoRutina(siguientePasoData.sonido)
      }
    }
  }

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1)
      const rutina = rutinasState.find((r) => r.id === rutinaSeleccionada)
      if (rutina) {
        const pasoAnteriorData = rutina.pasos[pasoActual - 1]
        if (pasoAnteriorData) {
          reproducirSonidoRutina(pasoAnteriorData.sonido)
        }
      }
    }
  }

  const marcarPasoCompletado = () => {
    if (rutinaSeleccionada) {
      setRutinasState((prev) =>
        prev.map((rutina) => {
          if (rutina.id === rutinaSeleccionada) {
            const nuevosPasos = rutina.pasos.map((paso, index) =>
              index === pasoActual ? { ...paso, completado: !paso.completado } : paso,
            )
            const completados = nuevosPasos.filter((p) => p.completado).length
            const progreso = Math.round((completados / nuevosPasos.length) * 100)

            if (progreso === 100 && rutina.progreso < 100) {
              setTimeout(() => {
                setMostrarCelebracion(true)
                const medalla = {
                  id: 4,
                  nombre: "Maestro de rutinas",
                  imagen: "/images/completasteunarutina.svg",
                  sonido: "success",
                }
                setNuevaMedalla(medalla)
                desbloquearMedalla(medalla.id)
              }, 500)
            }

            return { ...rutina, pasos: nuevosPasos, progreso }
          }
          return rutina
        }),
      )

      if (!rutinasState.find((r) => r.id === rutinaSeleccionada)?.pasos[pasoActual].completado) {
        reproducirSonidoRutina("exito")
      }
    }
  }

  const reiniciarRutina = () => {
    if (rutinaSeleccionada) {
      setRutinasState((prev) =>
        prev.map((rutina) => {
          if (rutina.id === rutinaSeleccionada) {
            const nuevosPasos = rutina.pasos.map((paso) => ({ ...paso, completado: false }))
            return { ...rutina, pasos: nuevosPasos, progreso: 0 }
          }
          return rutina
        }),
      )
      setPasoActual(0)
    }
  }

  const rutina = rutinaSeleccionada ? rutinasState.find((r) => r.id === rutinaSeleccionada) : null
  const pasoActualData = rutina ? rutina.pasos[pasoActual] : null

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      <AppSidebar />

      <div className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-4 p-3 rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20">
            <span className={`text-lg font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
              {userName || "Juan"}
            </span>
            <div
              className={`h-14 w-14 border-4 ${getAdaptedBorder("border-teal-400")} rounded-full ${favoriteAnimal.color} flex items-center justify-center text-white text-2xl shadow-lg`}
            >
              {favoriteAnimal.emoji}
            </div>
          </div>
        </div>

        {vistaActual === "lista" && (
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-48 h-48 mx-auto">
                  <div
                    className={`w-full h-full ${favoriteAnimal.color} rounded-full flex items-center justify-center text-8xl shadow-2xl border-8 border-white/30 backdrop-blur-sm`}
                  >
                    {favoriteAnimal.emoji}
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-3xl animate-bounce shadow-xl">
                    📋
                  </div>
                </div>
              </div>

              <h1
                className={`text-5xl md:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
              >
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Mis Rutinas
                </span>
              </h1>
              <p className={`text-xl md:text-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Sigue tus rutinas diarias paso a paso y conviértete en un maestro de la organización
              </p>
            </div>

            {/* Rutinas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rutinasState.map((rutina, index) => (
                <div key={rutina.id} className="group perspective-1000" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative transform transition-all duration-700 hover:scale-105 animate-fadeInUp">
                    <div
                      className={`relative h-96 rounded-3xl p-8 transition-all duration-500 overflow-hidden cursor-pointer ${
                        theme === "dark"
                          ? `${
                              rutina.id === 1
                                ? "bg-orange-900/40"
                                : rutina.id === 2
                                  ? "bg-purple-900/40"
                                  : "bg-green-900/40"
                            } border border-gray-700/50`
                          : `${
                              rutina.id === 1 ? "bg-orange-50" : rutina.id === 2 ? "bg-purple-50" : "bg-green-50"
                            } border border-white/50`
                      } shadow-2xl hover:shadow-3xl backdrop-blur-sm`}
                      onClick={() => iniciarRutina(rutina.id)}
                    >
                      {/* Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

                      {/* Glow effect */}
                      <div
                        className={`absolute -inset-1 bg-gradient-to-br ${getAdaptedGradient(rutina.color)} opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity duration-500`}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Icon and Title */}
                        <div className="text-center mb-6">
                          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500">
                            {rutina.icono}
                          </div>
                          <h3
                            className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-2`}
                          >
                            {rutina.nombre}
                          </h3>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                            {rutina.descripcion}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-4 text-sm mb-6">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">⏱️</span>
                            <span
                              className={theme === "dark" ? "text-gray-100 font-medium" : "text-gray-800 font-medium"}
                            >
                              {rutina.tiempo}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg">📝</span>
                            <span
                              className={theme === "dark" ? "text-gray-100 font-medium" : "text-gray-800 font-medium"}
                            >
                              {rutina.pasos.length} pasos
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex-1 flex flex-col justify-end">
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span
                                className={`text-sm font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}
                              >
                                Progreso
                              </span>
                              <span
                                className={`text-sm font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                              >
                                {rutina.progreso}%
                              </span>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getAdaptedGradient(rutina.color)} rounded-full transition-all duration-1000 ease-out relative`}
                                style={{ width: `${rutina.progreso}%` }}
                              >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Start Button */}
                          <button
                            className={`w-full bg-gradient-to-r ${getAdaptedGradient(rutina.color)} text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                          >
                            {rutina.progreso > 0 ? "Continuar" : "Empezar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActual === "rutina" && rutina && pasoActualData && (
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={volverALista}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200"
                } backdrop-blur-sm shadow-lg`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a mis rutinas
              </button>
            </div>

            {/* Routine Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{rutina.icono}</div>
              <h2 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-2`}>
                {rutina.nombre}
              </h2>
              <p className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6`}>
                Paso {pasoActual + 1} de {rutina.pasos.length}
              </p>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${getAdaptedGradient(rutina.color)} rounded-full transition-all duration-500 ease-out relative`}
                    style={{ width: `${((pasoActual + 1) / rutina.pasos.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Card */}
            <div
              className={`${
                theme === "dark"
                  ? `${
                      rutina.id === 1 ? "bg-orange-900/40" : rutina.id === 2 ? "bg-purple-900/40" : "bg-green-900/40"
                    } border-gray-700/50`
                  : `${
                      rutina.id === 1 ? "bg-orange-50" : rutina.id === 2 ? "bg-purple-50" : "bg-green-50"
                    } border-white/50`
              } rounded-3xl p-8 shadow-2xl backdrop-blur-sm border relative overflow-hidden`}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

              {/* Step Image */}
              <div className="mb-8">
                <div className="relative w-80 h-80 mx-auto rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={pasoActualData.imagen || "/placeholder.svg"}
                    alt={pasoActualData.titulo}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                  {pasoActualData.completado && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Title */}
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-4`}>
                  {pasoActualData.titulo}
                </h3>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={pasoAnterior}
                  disabled={pasoActual === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                    pasoActual === 0
                      ? "opacity-50 cursor-not-allowed bg-gray-300"
                      : `bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 shadow-lg hover:shadow-xl`
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <button
                  onClick={marcarPasoCompletado}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                    pasoActualData.completado
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  }`}
                >
                  {pasoActualData.completado ? "✓ Completado" : "Marcar como completado"}
                </button>

                <button
                  onClick={siguientePaso}
                  disabled={pasoActual === rutina.pasos.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                    pasoActual === rutina.pasos.length - 1
                      ? "opacity-50 cursor-not-allowed bg-gray-300"
                      : `bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 shadow-lg hover:shadow-xl`
                  }`}
                >
                  Siguiente
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Reset Button */}
              <div className="text-center">
                <button
                  onClick={reiniciarRutina}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600"
                      : "bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 border border-gray-300"
                  } backdrop-blur-sm`}
                >
                  🔄 Reiniciar Rutina
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Celebration Modal (simplified) */}
        {mostrarCelebracion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-3xl p-12 shadow-2xl max-w-2xl mx-4 text-center`}
            >
              <div className="text-8xl mb-6">🎉</div>
              <h2 className={`text-4xl font-bold ${theme === "dark" ? "text-yellow-300" : "text-yellow-600"} mb-4`}>
                ¡Felicidades!
              </h2>
              <p className={`text-2xl ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-8`}>
                Has completado toda la rutina
              </p>
              <button
                onClick={() => {
                  setMostrarCelebracion(false)
                  volverALista()
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                ¡Genial!
              </button>
            </div>
          </div>
        )}

        {/* New Medal Modal (simplified) */}
        {nuevaMedalla && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-3xl p-8 shadow-2xl max-w-lg mx-4 text-center`}
            >
              <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-yellow-300" : "text-yellow-600"} mb-6`}>
                ¡Nueva Medalla!
              </h2>
              <div className="w-32 h-32 mx-auto mb-6">
                <Image
                  src={nuevaMedalla.imagen || "/placeholder.svg"}
                  alt={nuevaMedalla.nombre}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
                {nuevaMedalla.nombre}
              </h3>
              <button
                onClick={() => setNuevaMedalla(null)}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                ¡Genial!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}
