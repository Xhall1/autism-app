"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { useEffect, useRef } from "react"
import Image from "next/image"

export default function RecompensasPage() {
  const {
    theme,
    audioEnabled,
    getFavoriteAnimalData,
    userName,
    medallasDesbloqueadas,
    getAdaptedColor,
    getAdaptedGradient,
    getAdaptedBorder,
  } = useApp()
  const favoriteAnimal = getFavoriteAnimalData()
  const audioContextRef = useRef<AudioContext | null>(null)

  // Definición completa de las 6 medallas (3 desbloqueadas y 3 bloqueadas)
  const medals = [
    {
      id: 1,
      name: "Medalla de Esfuerzo",
      description: "Por intentar siempre dar lo mejor",
      image: "/images/medalladeesfuerzo.svg",
      unlocked: medallasDesbloqueadas.includes(1),
      color: "from-yellow-400 via-yellow-500 to-amber-600",
      glowColor: "shadow-yellow-400/50",
      ringColor: "ring-yellow-300",
      bgGradient: "from-yellow-50 to-amber-50",
      darkBgGradient: "from-yellow-900/20 to-amber-900/20",
    },
    {
      id: 2,
      name: "Medalla de Puntualidad",
      description: "Por llegar siempre a tiempo",
      image: "/images/medalladepuntualidad.svg",
      unlocked: medallasDesbloqueadas.includes(2),
      color: "from-orange-400 via-orange-500 to-red-500",
      glowColor: "shadow-orange-400/50",
      ringColor: "ring-orange-300",
      bgGradient: "from-orange-50 to-red-50",
      darkBgGradient: "from-orange-900/20 to-red-900/20",
    },
    {
      id: 3,
      name: "Completaste una Rutina",
      description: "Por completar tu primera rutina",
      image: "/images/completasteunarutina.svg",
      unlocked: medallasDesbloqueadas.includes(3),
      color: "from-purple-400 via-purple-500 to-indigo-600",
      glowColor: "shadow-purple-400/50",
      ringColor: "ring-purple-300",
      bgGradient: "from-purple-50 to-indigo-50",
      darkBgGradient: "from-purple-900/20 to-indigo-900/20",
    },
    {
      id: 4,
      name: "Medalla de Constancia",
      description: "Por completar 5 rutinas",
      image: "/images/medalladeesfuerzo.svg",
      unlocked: medallasDesbloqueadas.includes(4),
      color: "from-blue-400 via-blue-500 to-indigo-600",
      glowColor: "shadow-blue-400/50",
      ringColor: "ring-blue-300",
      bgGradient: "from-blue-50 to-indigo-50",
      darkBgGradient: "from-blue-900/20 to-indigo-900/20",
    },
    {
      id: 5,
      name: "Medalla de Superación",
      description: "Por superar un desafío difícil",
      image: "/images/medalladepuntualidad.svg",
      unlocked: medallasDesbloqueadas.includes(5),
      color: "from-green-400 via-green-500 to-teal-600",
      glowColor: "shadow-green-400/50",
      ringColor: "ring-green-300",
      bgGradient: "from-green-50 to-teal-50",
      darkBgGradient: "from-green-900/20 to-teal-900/20",
    },
    {
      id: 6,
      name: "Medalla de Excelencia",
      description: "Por completar todas las actividades",
      image: "/images/completasteunarutina.svg",
      unlocked: medallasDesbloqueadas.includes(6),
      color: "from-pink-400 via-pink-500 to-rose-600",
      glowColor: "shadow-pink-400/50",
      ringColor: "ring-pink-300",
      bgGradient: "from-pink-50 to-rose-50",
      darkBgGradient: "from-pink-900/20 to-rose-900/20",
    },
  ]

  const unlockedCount = medals.filter((m) => m.unlocked).length

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

  // Función para reproducir sonido épico de medalla (mantengo la función original)
  const playMedalSound = (medalId: number) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime
      const baseVolume = theme === "dark" ? 0.08 : 0.12

      if (medalId === 1) {
        const frequencies = [523.25, 659.25, 783.99, 1046.5]
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, currentTime + index * 0.15)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, currentTime + index * 0.15)
          gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + index * 0.15 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + index * 0.15 + 0.4)

          oscillator.start(currentTime + index * 0.15)
          oscillator.stop(currentTime + index * 0.15 + 0.4)
        })
      } else {
        const frequencies = [523.25, 659.25, 783.99, 1046.5]
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, currentTime + index * 0.15)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, currentTime + index * 0.15)
          gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + index * 0.15 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + index * 0.15 + 0.4)

          oscillator.start(currentTime + index * 0.15)
          oscillator.stop(currentTime + index * 0.15 + 0.4)
        })
      }
    } catch (error) {
      console.log("Error al reproducir sonido de medalla:", error)
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
      }`}
    >
      <AppSidebar />

      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header with user profile */}
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

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-56 h-56 mx-auto">
              <div
                className={`w-full h-full ${favoriteAnimal.color} rounded-full flex items-center justify-center text-9xl shadow-2xl border-8 border-white/30 backdrop-blur-sm`}
              >
                {favoriteAnimal.emoji}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-3xl animate-bounce shadow-xl">
                🏅
              </div>
              {/* Floating sparkles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-8 -right-8 w-3 h-3 bg-orange-400 rounded-full animate-ping delay-300"></div>
              <div className="absolute -bottom-8 left-8 w-2 h-2 bg-amber-400 rounded-full animate-ping delay-700"></div>
            </div>
          </div>

          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              ¡Increíbles Medallas!
            </span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Has desbloqueado <span className="font-bold text-yellow-500 text-2xl">{unlockedCount}</span> de{" "}
            <span className="font-bold">{medals.length}</span> medallas
          </p>

          {/* Progress bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(unlockedCount / medals.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Progreso: {Math.round((unlockedCount / medals.length) * 100)}%
            </p>
          </div>

          <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            🎵 Haz clic en las medallas desbloqueadas para escuchar sus sonidos mágicos
          </p>
        </div>

        {/* Medals Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medals.map((medal, index) => (
              <div key={medal.id} className="group perspective-1000" style={{ animationDelay: `${index * 0.15}s` }}>
                <div
                  className={`relative transform transition-all duration-700 hover:scale-105 ${
                    medal.unlocked ? "animate-fadeInUp cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={() => medal.unlocked && playMedalSound(medal.id)}
                >
                  {/* Card */}
                  <div
                    className={`relative h-96 rounded-3xl p-8 transition-all duration-500 overflow-hidden ${
                      medal.unlocked
                        ? `${
                            medal.id === 1
                              ? "bg-yellow-100"
                              : medal.id === 2
                                ? "bg-orange-100"
                                : medal.id === 3
                                  ? "bg-purple-100"
                                  : medal.id === 4
                                    ? "bg-blue-100"
                                    : medal.id === 5
                                      ? "bg-green-100"
                                      : "bg-pink-100"
                          } ${
                            theme === "dark"
                              ? medal.id === 1
                                ? "dark:bg-yellow-900/30"
                                : medal.id === 2
                                  ? "dark:bg-orange-900/30"
                                  : medal.id === 3
                                    ? "dark:bg-purple-900/30"
                                    : medal.id === 4
                                      ? "dark:bg-blue-900/30"
                                      : medal.id === 5
                                        ? "dark:bg-green-900/30"
                                        : "dark:bg-pink-900/30"
                              : ""
                          } shadow-2xl ${getAdaptedColor(medal.glowColor)} ring-2 ${getAdaptedBorder(
                            medal.ringColor,
                          )} hover:shadow-3xl border border-white/20`
                        : theme === "dark"
                          ? "bg-gray-800/50 shadow-lg border border-gray-700"
                          : "bg-gray-100/80 shadow-lg border border-gray-200"
                    }`}
                  >
                    {/* Background Effects for Unlocked Medals */}
                    {medal.unlocked && (
                      <>
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

                        {/* Floating particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full animate-float"></div>
                          <div className="absolute top-8 right-6 w-1 h-1 bg-white/80 rounded-full animate-float-delayed"></div>
                          <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-white/70 rounded-full animate-float-slow"></div>
                          <div className="absolute bottom-6 right-4 w-1 h-1 bg-white/60 rounded-full animate-float"></div>
                        </div>

                        {/* Glow effect */}
                        <div
                          className={`absolute -inset-1 bg-gradient-to-br ${getAdaptedGradient(
                            medal.color,
                          )} opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity duration-500`}
                        ></div>
                      </>
                    )}

                    {/* Lock icon for locked medals */}
                    {!medal.unlocked && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Medal Content */}
                    <div className="relative z-10 flex flex-col items-center h-full">
                      {/* Medal Image Container */}
                      <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500">
                        <div
                          className={`w-32 h-32 rounded-full flex items-center justify-center ${
                            medal.unlocked
                              ? `bg-gradient-to-br ${getAdaptedGradient(medal.color)} shadow-2xl ring-4 ring-white/40`
                              : theme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-300"
                          } relative overflow-hidden`}
                        >
                          {medal.unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin-slow"></div>
                          )}
                          <div className="relative w-24 h-24">
                            <Image
                              src={medal.image || "/placeholder.svg"}
                              alt={medal.name}
                              width={96}
                              height={96}
                              className={`w-full h-full object-contain transition-all duration-300 ${
                                medal.unlocked ? "filter-none drop-shadow-lg" : "grayscale opacity-50"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Pulse effect for unlocked medals */}
                        {medal.unlocked && (
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getAdaptedGradient(
                              medal.color,
                            )} opacity-30 animate-ping`}
                          ></div>
                        )}
                      </div>

                      {/* Medal Info */}
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <h3
                          className={`text-xl font-bold mb-3 ${
                            medal.unlocked
                              ? theme === "dark"
                                ? "text-white"
                                : "text-gray-800"
                              : theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                          }`}
                        >
                          {medal.name}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            medal.unlocked
                              ? theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-600"
                              : theme === "dark"
                                ? "text-gray-600"
                                : "text-gray-500"
                          }`}
                        >
                          {medal.description}
                        </p>

                        {/* Status indicator */}
                        <div className="mt-4">
                          {medal.unlocked ? (
                            <div className="flex items-center justify-center gap-2 text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm font-medium">Desbloqueada</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm font-medium">Bloqueada</span>
                            </div>
                          )}
                        </div>

                        {/* Click hint for unlocked medals */}
                        {medal.unlocked && (
                          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-xs text-yellow-500 font-medium animate-pulse">¡Haz clic! 🔊</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="max-w-4xl mx-auto mt-16">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-white/50"
            } rounded-3xl p-8 shadow-2xl backdrop-blur-sm border text-center`}
          >
            <div className="text-6xl mb-6">🎉</div>
            <h3 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-4`}>
              ¡Increíble trabajo, {userName || "Juan"}!
            </h3>
            <p className={`text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-8`}>
              Sigue completando rutinas y actividades para desbloquear más medallas
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div
                className={`px-6 py-4 rounded-2xl ${
                  theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"
                } backdrop-blur-sm border border-white/20`}
              >
                <div className="text-2xl mb-1">🏅</div>
                <span className={`text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                  {unlockedCount} Medallas
                </span>
              </div>

              {audioEnabled && (
                <div
                  className={`px-6 py-4 rounded-2xl ${
                    theme === "dark" ? "bg-purple-700/50" : "bg-purple-100/80"
                  } backdrop-blur-sm border border-white/20`}
                >
                  <div className="text-2xl mb-1">🎵</div>
                  <span className={`text-lg font-bold ${theme === "dark" ? "text-purple-200" : "text-purple-700"}`}>
                    Sonidos Épicos
                  </span>
                </div>
              )}

              <div
                className={`px-6 py-4 rounded-2xl ${
                  theme === "dark" ? "bg-green-700/50" : "bg-green-100/80"
                } backdrop-blur-sm border border-white/20`}
              >
                <div className="text-2xl mb-1">⭐</div>
                <span className={`text-lg font-bold ${theme === "dark" ? "text-green-200" : "text-green-700"}`}>
                  {Math.round((unlockedCount / medals.length) * 100)}% Completado
                </span>
              </div>
            </div>
          </div>
        </div>
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite 1s;
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
