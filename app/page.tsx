"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { ParentAccessButton } from "@/components/parent-access-button"

export default function HomePage() {
  const { theme, getFavoriteAnimalData, userName } = useApp()

  const favoriteAnimal = getFavoriteAnimalData()

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-blue-50"}`}
    >
      <AppSidebar />

      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header with user profile */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <span className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
              {userName || "Juan"}
            </span>
            <div
              className={`h-12 w-12 border-4 border-teal-400 rounded-full ${favoriteAnimal.color} flex items-center justify-center text-white text-xl`}
            >
              {favoriteAnimal.emoji}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Bear mascot */}
          <div className="mb-12">
            <div className="w-48 h-48 mx-auto relative">
              <div
                className={`w-full h-full ${favoriteAnimal.color} rounded-full flex items-center justify-center text-8xl shadow-lg transition-transform duration-300 hover:scale-105`}
              >
                {favoriteAnimal.emoji}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                👋
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <div className="mb-16">
            <h1 className={`text-6xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-6`}>
              ¡Hola, {userName || "Juan"}!
            </h1>
            <p className={`text-2xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-8`}>
              ¿Qué quieres hacer hoy?
            </p>
            <div className="flex justify-center gap-4 text-4xl">
              <span className="animate-bounce">🌟</span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                ✨
              </span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                🎉
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div
              className={`p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-2`}>
                Mis Rutinas
              </h3>
              <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Sigue tus rutinas diarias paso a paso
              </p>
            </div>

            <div
              className={`p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
              } shadow-lg hover:shadow-xl`}
            >
              <div className="text-6xl mb-4">😊</div>
              <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} mb-2`}>
                Mis Emociones
              </h3>
              <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Explora y comprende cómo te sientes
              </p>
            </div>
          </div>

          {/* Parent access button */}
          <div className="flex justify-center">
            <ParentAccessButton />
          </div>
        </div>
      </div>
    </div>
  )
}
