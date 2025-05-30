"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { useParent } from "@/lib/parent-context"
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  BarChart3,
  Award,
  Heart,
  Clock,
  Target,
  Filter,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { toPng } from "html-to-image"

// Extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export default function ParentReportes() {
  const { theme } = useApp()
  const { isAuthenticated, progressData, parentSettings } = useParent()
  const router = useRouter()
  const chartRef = useRef<HTMLDivElement>(null)
  const emotionsChartRef = useRef<HTMLDivElement>(null)

  const [reportType, setReportType] = useState<"semanal" | "mensual" | "personalizado">("semanal")
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 días atrás
    end: new Date().toISOString().split("T")[0], // hoy
  })
  const [selectedMetrics, setSelectedMetrics] = useState({
    rutinas: true,
    emociones: true,
    tiempo: true,
    medallas: true,
    metas: true,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Datos simulados para el informe
  const reportData = {
    rutinas: {
      completadas: [
        { nombre: "Rutina de la mañana", completada: 5, total: 7, porcentaje: 71 },
        { nombre: "Rutina de la noche", completada: 4, total: 7, porcentaje: 57 },
        { nombre: "Rutina de estudio", completada: 3, total: 5, porcentaje: 60 },
      ],
      pasosMasCompletados: ["Levantarse de la cama", "Lavarse los dientes", "Guardar los juguetes"],
      pasosMenosCompletados: ["Revisar lo aprendido", "Leer un cuento", "Vestirse"],
    },
    emociones: {
      registradas: [
        { nombre: "Feliz", veces: 8, porcentaje: 50 },
        { nombre: "Calmado", veces: 4, porcentaje: 25 },
        { nombre: "Triste", veces: 2, porcentaje: 12.5 },
        { nombre: "Enojado", veces: 1, porcentaje: 6.25 },
        { nombre: "Asustado", veces: 1, porcentaje: 6.25 },
      ],
      tendencias: "Predominantemente positivas, con momentos ocasionales de tristeza",
      recomendaciones: "Trabajar en técnicas para manejar el enojo y el miedo",
    },
    tiempo: {
      totalMinutos: progressData.tiempoUsoSemanal.reduce((a, b) => a + b, 0),
      promedioDiario: Math.round(progressData.tiempoUsoSemanal.reduce((a, b) => a + b, 0) / 7),
      diasMasActivos: ["Jueves", "Martes", "Sábado"],
      diasMenosActivos: ["Domingo", "Miércoles"],
    },
    medallas: {
      desbloqueadas: progressData.medallasDesbloqueadas,
      porcentaje: Math.round((progressData.medallasDesbloqueadas / 6) * 100),
      proximas: ["Medalla de perseverancia", "Medalla de creatividad", "Medalla de amistad"],
    },
    metas: {
      alcanzadas: progressData.metasAlcanzadas,
      rutinasCompletadas: `${2}/${parentSettings.metasDiarias.rutinas} diarias`,
      emocionesRegistradas: `${2}/${parentSettings.metasDiarias.emociones} diarias`,
      tiempoUso: `${30}/${parentSettings.metasDiarias.tiempo} minutos diarios`,
    },
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/padres")
    }
  }, [isAuthenticated, router])

  const handleReportTypeChange = (type: "semanal" | "mensual" | "personalizado") => {
    setReportType(type)
    const today = new Date()
    let startDate

    switch (type) {
      case "semanal":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "mensual":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        break
      case "personalizado":
        // Mantener las fechas actuales
        return
    }

    setDateRange({
      start: startDate.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    })
  }

  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Crear un nuevo documento PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Añadir título y fecha
      doc.setFontSize(22)
      doc.setTextColor(85, 33, 181) // Púrpura
      doc.text("Informe de Progreso - San", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100) // Gris
      doc.text(`Niño: Juan`, 20, 30)
      doc.text(`Período: ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`, 20, 37)
      doc.text(`Generado el: ${formatDate(new Date().toISOString())}`, 20, 44)

      // Línea separadora
      doc.setDrawColor(200, 200, 200)
      doc.line(20, 48, 190, 48)

      let yPosition = 55

      // Resumen general
      doc.setFontSize(16)
      doc.setTextColor(85, 33, 181)
      doc.text("Resumen General", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setTextColor(80, 80, 80)
      doc.text(`• Días consecutivos de uso: ${progressData.diasConsecutivos}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Rutinas completadas: ${progressData.rutinasCompletadas}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Emociones registradas: ${progressData.emocionesRegistradas}`, 25, yPosition)
      yPosition += 7
      doc.text(`• Medallas desbloqueadas: ${progressData.medallasDesbloqueadas} de 6`, 25, yPosition)
      yPosition += 7
      doc.text(`• Metas alcanzadas: ${progressData.metasAlcanzadas}`, 25, yPosition)
      yPosition += 15

      // Secciones específicas según las métricas seleccionadas
      if (selectedMetrics.rutinas) {
        doc.setFontSize(16)
        doc.setTextColor(85, 33, 181)
        doc.text("Rutinas", 20, yPosition)
        yPosition += 10

        // Tabla de rutinas
        doc.autoTable({
          startY: yPosition,
          head: [["Rutina", "Completada", "Total", "Porcentaje"]],
          body: reportData.rutinas.completadas.map((rutina) => [
            rutina.nombre,
            rutina.completada,
            rutina.total,
            `${rutina.porcentaje}%`,
          ]),
          theme: "grid",
          headStyles: {
            fillColor: [85, 33, 181],
            textColor: [255, 255, 255],
          },
          styles: {
            fontSize: 10,
          },
          margin: { left: 20, right: 20 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10

        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text("Pasos más completados:", 20, yPosition)
        yPosition += 7
        reportData.rutinas.pasosMasCompletados.forEach((paso) => {
          doc.text(`• ${paso}`, 25, yPosition)
          yPosition += 6
        })

        yPosition += 5
        doc.text("Pasos menos completados:", 20, yPosition)
        yPosition += 7
        reportData.rutinas.pasosMenosCompletados.forEach((paso) => {
          doc.text(`• ${paso}`, 25, yPosition)
          yPosition += 6
        })

        yPosition += 10
      }

      // Si la posición Y es mayor que 250, añadir una nueva página
      if (yPosition > 250 && selectedMetrics.emociones) {
        doc.addPage()
        yPosition = 20
      }

      if (selectedMetrics.emociones) {
        doc.setFontSize(16)
        doc.setTextColor(85, 33, 181)
        doc.text("Emociones", 20, yPosition)
        yPosition += 10

        // Tabla de emociones
        doc.autoTable({
          startY: yPosition,
          head: [["Emoción", "Veces registrada", "Porcentaje"]],
          body: reportData.emociones.registradas.map((emocion) => [
            emocion.nombre,
            emocion.veces,
            `${emocion.porcentaje}%`,
          ]),
          theme: "grid",
          headStyles: {
            fillColor: [85, 33, 181],
            textColor: [255, 255, 255],
          },
          styles: {
            fontSize: 10,
          },
          margin: { left: 20, right: 20 },
        })

        yPosition = (doc as any).lastAutoTable.finalY + 10

        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text("Tendencias emocionales:", 20, yPosition)
        yPosition += 7
        doc.text(reportData.emociones.tendencias, 25, yPosition, { maxWidth: 165 })
        yPosition += 12

        doc.text("Recomendaciones:", 20, yPosition)
        yPosition += 7
        doc.text(reportData.emociones.recomendaciones, 25, yPosition, { maxWidth: 165 })
        yPosition += 15
      }

      // Si la posición Y es mayor que 250, añadir una nueva página
      if (yPosition > 250 && (selectedMetrics.tiempo || selectedMetrics.medallas || selectedMetrics.metas)) {
        doc.addPage()
        yPosition = 20
      }

      // Sección de tiempo de uso
      if (selectedMetrics.tiempo) {
        doc.setFontSize(16)
        doc.setTextColor(85, 33, 181)
        doc.text("Tiempo de Uso", 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text(`• Tiempo total: ${reportData.tiempo.totalMinutos} minutos`, 25, yPosition)
        yPosition += 7
        doc.text(`• Promedio diario: ${reportData.tiempo.promedioDiario} minutos`, 25, yPosition)
        yPosition += 7
        doc.text(`• Días más activos: ${reportData.tiempo.diasMasActivos.join(", ")}`, 25, yPosition)
        yPosition += 7
        doc.text(`• Días menos activos: ${reportData.tiempo.diasMenosActivos.join(", ")}`, 25, yPosition)
        yPosition += 15

        // Capturar el gráfico de tiempo y añadirlo al PDF
        if (chartRef.current) {
          const chart = await toPng(chartRef.current, { quality: 0.95 })
          doc.addImage(chart, "PNG", 20, yPosition, 170, 70)
          yPosition += 80
        }
      }

      // Si la posición Y es mayor que 250, añadir una nueva página
      if (yPosition > 250 && (selectedMetrics.medallas || selectedMetrics.metas)) {
        doc.addPage()
        yPosition = 20
      }

      // Sección de medallas
      if (selectedMetrics.medallas) {
        doc.setFontSize(16)
        doc.setTextColor(85, 33, 181)
        doc.text("Medallas y Logros", 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text(`• Medallas desbloqueadas: ${reportData.medallas.desbloqueadas} de 6`, 25, yPosition)
        yPosition += 7
        doc.text(`• Porcentaje completado: ${reportData.medallas.porcentaje}%`, 25, yPosition)
        yPosition += 7
        doc.text("• Próximas medallas:", 25, yPosition)
        yPosition += 7
        reportData.medallas.proximas.forEach((medalla) => {
          doc.text(`  - ${medalla}`, 30, yPosition)
          yPosition += 6
        })
        yPosition += 10
      }

      // Si la posición Y es mayor que 250, añadir una nueva página
      if (yPosition > 250 && selectedMetrics.metas) {
        doc.addPage()
        yPosition = 20
      }

      // Sección de metas
      if (selectedMetrics.metas) {
        doc.setFontSize(16)
        doc.setTextColor(85, 33, 181)
        doc.text("Metas y Objetivos", 20, yPosition)
        yPosition += 10

        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text(`• Metas alcanzadas: ${reportData.metas.alcanzadas}`, 25, yPosition)
        yPosition += 7
        doc.text(`• Rutinas completadas: ${reportData.metas.rutinasCompletadas}`, 25, yPosition)
        yPosition += 7
        doc.text(`• Emociones registradas: ${reportData.metas.emocionesRegistradas}`, 25, yPosition)
        yPosition += 7
        doc.text(`• Tiempo de uso: ${reportData.metas.tiempoUso}`, 25, yPosition)
        yPosition += 15
      }

      // Pie de página
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text(
          `San - Aplicación para niños con autismo | Página ${i} de ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" },
        )
      }

      // Guardar el PDF
      doc.save(`Informe_San_${formatDate(dateRange.start)}_${formatDate(dateRange.end)}.pdf`)
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.")
    } finally {
      setIsGenerating(false)
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Reportes de Progreso
              </h1>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Genera informes detallados sobre el progreso de Juan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles de reporte */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-2`}>
                Configurar Informe
              </h2>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Selecciona el período y las métricas que deseas incluir
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => generatePDF()}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isGenerating
                    ? theme === "dark"
                      ? "bg-gray-700 text-gray-500"
                      : "bg-gray-200 text-gray-400"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-md"
                }`}
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Generando..." : "Descargar PDF"}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Tipo de informe
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleReportTypeChange("semanal")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    reportType === "semanal"
                      ? "bg-purple-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Semanal
                </button>
                <button
                  onClick={() => handleReportTypeChange("mensual")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    reportType === "mensual"
                      ? "bg-purple-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => handleReportTypeChange("personalizado")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    reportType === "personalizado"
                      ? "bg-purple-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Personalizado
                </button>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Período de tiempo
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-1`}>
                    Desde
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    disabled={reportType !== "personalizado"}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      reportType !== "personalizado" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-1`}>
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    disabled={reportType !== "personalizado"}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      reportType !== "personalizado" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm ${
                theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtrar métricas
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                <button
                  onClick={() => toggleMetric("rutinas")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetrics.rutinas
                      ? "bg-blue-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedMetrics.rutinas ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Rutinas
                </button>
                <button
                  onClick={() => toggleMetric("emociones")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetrics.emociones
                      ? "bg-pink-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedMetrics.emociones ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Emociones
                </button>
                <button
                  onClick={() => toggleMetric("tiempo")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetrics.tiempo
                      ? "bg-green-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedMetrics.tiempo ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Tiempo
                </button>
                <button
                  onClick={() => toggleMetric("medallas")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetrics.medallas
                      ? "bg-yellow-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedMetrics.medallas ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Medallas
                </button>
                <button
                  onClick={() => toggleMetric("metas")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedMetrics.metas
                      ? "bg-purple-500 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedMetrics.metas ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Metas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vista previa del informe */}
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Vista Previa del Informe
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                theme === "dark" ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"
              }`}
            >
              {reportType === "semanal"
                ? "Informe Semanal"
                : reportType === "mensual"
                  ? "Informe Mensual"
                  : "Informe Personalizado"}
            </div>
          </div>

          <div className="border-b border-dashed mb-6 pb-6">
            <h3
              className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
            >
              <FileText className="h-5 w-5" />
              Informe de Progreso - Juan
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Período: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </p>
          </div>

          <div className="space-y-8">
            {/* Resumen General */}
            <div>
              <h3
                className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
              >
                <BarChart3 className="h-5 w-5" />
                Resumen General
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } flex flex-col items-center justify-center text-center`}
                >
                  <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"} mb-2`} />
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {progressData.rutinasCompletadas}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Rutinas Completadas
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } flex flex-col items-center justify-center text-center`}
                >
                  <Heart className={`h-6 w-6 ${theme === "dark" ? "text-pink-400" : "text-pink-600"} mb-2`} />
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {progressData.emocionesRegistradas}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Emociones Registradas
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } flex flex-col items-center justify-center text-center`}
                >
                  <Clock className={`h-6 w-6 ${theme === "dark" ? "text-green-400" : "text-green-600"} mb-2`} />
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {reportData.tiempo.totalMinutos}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Minutos Totales
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } flex flex-col items-center justify-center text-center`}
                >
                  <Award className={`h-6 w-6 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"} mb-2`} />
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {progressData.medallasDesbloqueadas}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Medallas Desbloqueadas
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  } flex flex-col items-center justify-center text-center`}
                >
                  <Target className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-purple-600"} mb-2`} />
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {progressData.metasAlcanzadas}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Metas Alcanzadas
                  </div>
                </div>
              </div>
            </div>

            {/* Tiempo de Uso */}
            {selectedMetrics.tiempo && (
              <div>
                <h3
                  className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
                >
                  <Clock className="h-5 w-5" />
                  Tiempo de Uso
                </h3>

                <div ref={chartRef} className="bg-white p-4 rounded-lg">
                  <div className="flex items-end justify-between h-40 gap-2">
                    {progressData.tiempoUsoSemanal.map((minutes, index) => {
                      const days = ["L", "M", "X", "J", "V", "S", "D"]
                      const height = (minutes / Math.max(...progressData.tiempoUsoSemanal)) * 100
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md mb-2"
                            style={{ height: `${height}%`, minHeight: "8px" }}
                          ></div>
                          <span className="text-xs text-gray-600">{days[index]}</span>
                          <span className="text-xs font-medium text-gray-700">{minutes}m</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-4 text-sm text-gray-500">Minutos de uso por día de la semana</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                      Análisis de Tiempo
                    </h4>
                    <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <li>• Tiempo total: {reportData.tiempo.totalMinutos} minutos</li>
                      <li>• Promedio diario: {reportData.tiempo.promedioDiario} minutos</li>
                      <li>• Días más activos: {reportData.tiempo.diasMasActivos.join(", ")}</li>
                      <li>• Días menos activos: {reportData.tiempo.diasMenosActivos.join(", ")}</li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                      Recomendaciones
                    </h4>
                    <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <li>• Mantener un horario consistente de uso</li>
                      <li>• Aumentar el uso en {reportData.tiempo.diasMenosActivos.join(" y ")}</li>
                      <li>• Ideal: 30-45 minutos por sesión, 2 veces al día</li>
                      <li>• Descansos cada 20 minutos para evitar fatiga</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Emociones */}
            {selectedMetrics.emociones && (
              <div>
                <h3
                  className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
                >
                  <Heart className="h-5 w-5" />
                  Emociones
                </h3>

                <div ref={emotionsChartRef} className="bg-white p-4 rounded-lg mb-4">
                  <div className="flex items-end justify-between h-40 gap-2">
                    {reportData.emociones.registradas.map((emocion, index) => {
                      const height =
                        (emocion.veces / Math.max(...reportData.emociones.registradas.map((e) => e.veces))) * 100
                      const colors = [
                        "from-yellow-500 to-yellow-400", // Feliz
                        "from-blue-500 to-blue-400", // Calmado
                        "from-blue-600 to-blue-500", // Triste
                        "from-red-500 to-red-400", // Enojado
                        "from-purple-500 to-purple-400", // Asustado
                      ]
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-full bg-gradient-to-t ${colors[index]} rounded-t-md mb-2`}
                            style={{ height: `${height}%`, minHeight: "8px" }}
                          ></div>
                          <span className="text-xs text-gray-600">{emocion.nombre}</span>
                          <span className="text-xs font-medium text-gray-700">{emocion.veces}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center mt-4 text-sm text-gray-500">Frecuencia de emociones registradas</div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Análisis Emocional
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
                    {reportData.emociones.tendencias}
                  </p>
                  <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Recomendaciones
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {reportData.emociones.recomendaciones}
                  </p>
                </div>
              </div>
            )}

            {/* Rutinas */}
            {selectedMetrics.rutinas && (
              <div>
                <h3
                  className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
                >
                  <Calendar className="h-5 w-5" />
                  Rutinas
                </h3>

                <div className="overflow-x-auto">
                  <table className={`w-full ${theme === "dark" ? "text-gray-300" : "text-gray-700"} border-collapse`}>
                    <thead>
                      <tr className={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}>
                        <th className="text-left p-3 rounded-tl-lg">Rutina</th>
                        <th className="text-center p-3">Completada</th>
                        <th className="text-center p-3">Total</th>
                        <th className="text-center p-3 rounded-tr-lg">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.rutinas.completadas.map((rutina, index) => (
                        <tr
                          key={index}
                          className={`${
                            theme === "dark"
                              ? index % 2 === 0
                                ? "bg-gray-800"
                                : "bg-gray-750"
                              : index % 2 === 0
                                ? "bg-white"
                                : "bg-gray-50"
                          } border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <td className="p-3">{rutina.nombre}</td>
                          <td className="text-center p-3">{rutina.completada}</td>
                          <td className="text-center p-3">{rutina.total}</td>
                          <td className="text-center p-3">
                            <div className="flex items-center justify-center">
                              <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${rutina.porcentaje}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{rutina.porcentaje}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                      Pasos más completados
                    </h4>
                    <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {reportData.rutinas.pasosMasCompletados.map((paso, index) => (
                        <li key={index}>• {paso}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}>
                      Pasos menos completados
                    </h4>
                    <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {reportData.rutinas.pasosMenosCompletados.map((paso, index) => (
                        <li key={index}>• {paso}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Medallas y Metas */}
            {(selectedMetrics.medallas || selectedMetrics.metas) && (
              <div className="grid md:grid-cols-2 gap-6">
                {selectedMetrics.medallas && (
                  <div>
                    <h3
                      className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
                    >
                      <Award className="h-5 w-5" />
                      Medallas y Logros
                    </h3>

                    <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Progreso de medallas
                        </span>
                        <span
                          className={`text-sm font-medium ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}
                        >
                          {reportData.medallas.desbloqueadas}/6
                        </span>
                      </div>
                      <div className={`w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"} rounded-full h-2.5`}>
                        <div
                          className="bg-yellow-500 h-2.5 rounded-full"
                          style={{ width: `${reportData.medallas.porcentaje}%` }}
                        ></div>
                      </div>

                      <h4 className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mt-4 mb-2`}>
                        Próximas medallas
                      </h4>
                      <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {reportData.medallas.proximas.map((medalla, index) => (
                          <li key={index}>• {medalla}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedMetrics.metas && (
                  <div>
                    <h3
                      className={`text-lg font-bold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4 flex items-center gap-2`}
                    >
                      <Target className="h-5 w-5" />
                      Metas y Objetivos
                    </h3>

                    <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            Rutinas diarias
                          </span>
                          <span
                            className={`text-sm font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                          >
                            {reportData.metas.rutinasCompletadas}
                          </span>
                        </div>
                        <div className={`w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"} rounded-full h-2`}>
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(2 / parentSettings.metasDiarias.rutinas) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            Emociones diarias
                          </span>
                          <span
                            className={`text-sm font-medium ${theme === "dark" ? "text-pink-400" : "text-pink-600"}`}
                          >
                            {reportData.metas.emocionesRegistradas}
                          </span>
                        </div>
                        <div className={`w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"} rounded-full h-2`}>
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{ width: `${(2 / parentSettings.metasDiarias.emociones) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                            Tiempo diario
                          </span>
                          <span
                            className={`text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                          >
                            {reportData.metas.tiempoUso}
                          </span>
                        </div>
                        <div className={`w-full ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"} rounded-full h-2`}>
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(30 / parentSettings.metasDiarias.tiempo) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
