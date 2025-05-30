"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { useParent } from "@/lib/parent-context"
import { ArrowLeft, Clock, Bell, Shield, Save, Eye, EyeOff, Smartphone, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ParentConfiguraciones() {
  const { theme } = useApp()
  const { isAuthenticated, parentSettings, updateParentSettings } = useParent()
  const router = useRouter()

  const [settings, setSettings] = useState(parentSettings)
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPins, setShowPins] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/padres")
    }
  }, [isAuthenticated, router])

  const handleSave = () => {
    updateParentSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePinChange = () => {
    if (newPin === confirmPin && newPin.length === 4) {
      // En una app real, aquí se cambiaría el PIN de forma segura
      alert("PIN cambiado exitosamente")
      setCurrentPin("")
      setNewPin("")
      setConfirmPin("")
    } else {
      alert("Los PINs no coinciden o no tienen 4 dígitos")
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-orange-50 to-red-50"
      }`}
    >
      {/* Header */}
      <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/padres/dashboard">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors mr-4 ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>
            </Link>
            <div>
              <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Configuraciones Parentales
              </h1>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Ajusta los límites y preferencias de la aplicación
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Límites de Tiempo */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <Clock className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Límites de Tiempo
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Tiempo máximo diario (minutos)
                </label>
                <input
                  type="number"
                  value={settings.tiempoLimite}
                  onChange={(e) => setSettings({ ...settings, tiempoLimite: Number.parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  min="15"
                  max="180"
                />
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1`}>
                  Recomendado: 45-90 minutos para niños con autismo
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Descansos automáticos
                </label>
                <select
                  value={settings.descansoAutomatico || 30}
                  onChange={(e) =>
                    setSettings({ ...settings, descansoAutomatico: Number.parseInt(e.target.value) || 30 })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value={15}>Cada 15 minutos</option>
                  <option value={30}>Cada 30 minutos</option>
                  <option value={45}>Cada 45 minutos</option>
                  <option value={60}>Cada 60 minutos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className={`h-6 w-6 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Notificaciones
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    Recordatorios de rutinas
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Notificar cuando es hora de hacer una rutina
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notificacionesActivas: !settings.notificacionesActivas })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notificacionesActivas ? "bg-green-600" : theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notificacionesActivas ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    Reportes semanales
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Recibir resumen de progreso cada semana
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, reportesSemanal: !settings.reportesSemanal })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.reportesSemanal ? "bg-green-600" : theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.reportesSemanal ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Metas Diarias */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Metas Diarias
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Rutinas por día
                </label>
                <input
                  type="number"
                  value={settings.metasDiarias.rutinas}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metasDiarias: { ...settings.metasDiarias, rutinas: Number.parseInt(e.target.value) || 1 },
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  min="1"
                  max="5"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Emociones por día
                </label>
                <input
                  type="number"
                  value={settings.metasDiarias.emociones}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metasDiarias: { ...settings.metasDiarias, emociones: Number.parseInt(e.target.value) || 1 },
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
                >
                  Tiempo mínimo (min)
                </label>
                <input
                  type="number"
                  value={settings.metasDiarias.tiempo}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metasDiarias: { ...settings.metasDiarias, tiempo: Number.parseInt(e.target.value) || 15 },
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  min="15"
                  max="120"
                />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className={`h-6 w-6 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
              <h3 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>Seguridad</h3>
            </div>

            <div className="space-y-6">
              <div
                className={`p-4 ${
                  theme === "dark" ? "bg-yellow-900/20 border-yellow-600" : "bg-yellow-50 border-yellow-200"
                } border rounded-lg`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
                  <h4 className={`font-medium ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
                    Cambiar PIN de Acceso
                  </h4>
                </div>
                <p className={`text-sm ${theme === "dark" ? "text-yellow-200" : "text-yellow-700"} mb-4`}>
                  Cambia tu PIN regularmente para mantener la seguridad
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                      } mb-1`}
                    >
                      PIN actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPins ? "text" : "password"}
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                        className={`w-full px-3 py-2 rounded border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 text-gray-800"
                        } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        maxLength={4}
                        placeholder="••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                      } mb-1`}
                    >
                      Nuevo PIN
                    </label>
                    <input
                      type={showPins ? "text" : "password"}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className={`w-full px-3 py-2 rounded border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      maxLength={4}
                      placeholder="••••"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                      } mb-1`}
                    >
                      Confirmar PIN
                    </label>
                    <input
                      type={showPins ? "text" : "password"}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className={`w-full px-3 py-2 rounded border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-800"
                      } focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      maxLength={4}
                      placeholder="••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setShowPins(!showPins)}
                    className={`flex items-center gap-2 text-sm ${
                      theme === "dark"
                        ? "text-yellow-300 hover:text-yellow-200"
                        : "text-yellow-700 hover:text-yellow-800"
                    }`}
                  >
                    {showPins ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPins ? "Ocultar" : "Mostrar"} PINs
                  </button>

                  <button
                    onClick={handlePinChange}
                    disabled={!currentPin || !newPin || !confirmPin || newPin !== confirmPin}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPin && newPin && confirmPin && newPin === confirmPin
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : theme === "dark"
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Cambiar PIN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg"
              }`}
            >
              <Save className="h-5 w-5" />
              {saved ? "¡Configuraciones Guardadas!" : "Guardar Configuraciones"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
