"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { useParent } from "@/lib/parent-context"
import {
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Heart,
  Settings,
  FileText,
  Users,
  LogOut,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function ParentDashboard() {
  const { theme } = useApp()
  const { isAuthenticated, setIsAuthenticated, setIsParentMode, progressData, parentSettings } = useParent()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/padres")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsParentMode(false)
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  const statsCards = [
    {
      title: "Rutinas Completadas",
      value: progressData.rutinasCompletadas,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      change: "+3 esta semana",
    },
    {
      title: "Días Consecutivos",
      value: progressData.diasConsecutivos,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      change: "Racha actual",
    },
    {
      title: "Emociones Registradas",
      value: progressData.emocionesRegistradas,
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      change: "+2 hoy",
    },
    {
      title: "Medallas Desbloqueadas",
      value: progressData.medallasDesbloqueadas,
      icon: Award,
      color: "from-yellow-500 to-yellow-600",
      change: "de 6 totales",
    },
  ]

  const menuItems = [
    {
      title: "Estadísticas Detalladas",
      description: "Ver gráficos y análisis completos",
      icon: BarChart3,
      href: "/padres/estadisticas",
      color: "bg-blue-500",
    },
    {
      title: "Configurar Rutinas",
      description: "Crear y editar rutinas personalizadas",
      icon: Calendar,
      href: "/padres/rutinas",
      color: "bg-green-500",
    },
    {
      title: "Metas y Objetivos",
      description: "Establecer metas diarias y semanales",
      icon: Target,
      href: "/padres/metas",
      color: "bg-purple-500",
    },
    {
      title: "Reportes",
      description: "Generar informes de progreso",
      icon: FileText,
      href: "/padres/reportes",
      color: "bg-orange-500",
    },
    {
      title: "Configuraciones",
      description: "Ajustar límites y preferencias",
      icon: Settings,
      href: "/padres/configuraciones",
      color: "bg-gray-500",
    },
    {
      title: "Perfil del Niño",
      description: "Gestionar información personal",
      icon: Users,
      href: "/padres/perfil",
      color: "bg-teal-500",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-orange-50 to-red-50"
      }`}
    >
      {/* Header */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${
                  theme === "dark" ? "bg-orange-900/50" : "bg-orange-100"
                } rounded-lg flex items-center justify-center`}
              >
                <Shield className={`h-6 w-6 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Panel de Control Parental
                </h1>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Progreso de Juan - Última actividad: {progressData.ultimaActividad}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Ver App del Niño
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-1`}>
                  {stat.value}
                </h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{stat.title}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Weekly Usage Chart */}
          <div className={`lg:col-span-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              Uso Semanal (minutos por día)
            </h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {progressData.tiempoUsoSemanal.map((minutes, index) => {
                const days = ["L", "M", "X", "J", "V", "S", "D"]
                const height = (minutes / Math.max(...progressData.tiempoUsoSemanal)) * 100
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md mb-2 transition-all duration-300 hover:from-orange-600 hover:to-orange-500"
                      style={{ height: `${height}%`, minHeight: "8px" }}
                    ></div>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {days[index]}
                    </span>
                    <span className={`text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {minutes}m
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's Goals */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6`}>
              Metas de Hoy
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Rutinas</span>
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    2/{parentSettings.metasDiarias.rutinas}
                  </span>
                </div>
                <div className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(2 / parentSettings.metasDiarias.rutinas) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Emociones</span>
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    2/{parentSettings.metasDiarias.emociones}
                  </span>
                </div>
                <div className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                  <div
                    className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full"
                    style={{ width: `${(2 / parentSettings.metasDiarias.emociones) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Tiempo (min)
                  </span>
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    30/{parentSettings.metasDiarias.tiempo}
                  </span>
                </div>
                <div className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2`}>
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${(30 / parentSettings.metasDiarias.tiempo) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} href={item.href}>
                <div
                  className={`${
                    theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
                  } rounded-xl p-6 shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
