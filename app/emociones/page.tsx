"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import * as faceapi from "face-api.js"
import {
  Camera,
  CameraOff,
  BarChart3,
  Heart,
  Brain,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Target,
  Wind,
  Clock,
  Star,
  BookOpen,
  Gamepad2,
  TrendingUp,
  Check,
} from "lucide-react"

interface EmotionHistory {
  emotion: string
  confidence: number
  timestamp: Date
}

interface EmotionStats {
  [key: string]: number
}

export default function EmocionesPage() {
  const {
    theme,
    audioEnabled,
    getFavoriteAnimalData,
    userName,
    desbloquearMedalla,
    medallasDesbloqueadas,
    accessibilitySettings,
    getEmotionColor,
    getAdaptedColor,
    getAdaptedGradient,
  } = useApp()

  const favoriteAnimal = getFavoriteAnimalData()
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)
  const [activeTab, setActiveTab] = useState("camera")

  // Nuevos estados para funcionalidades mejoradas
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistory[]>([])
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({})
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [totalDetections, setTotalDetections] = useState(0)
  const [gameMode, setGameMode] = useState<"practice" | "challenge" | null>(null)
  const [targetEmotion, setTargetEmotion] = useState<string | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameTimeLeft, setGameTimeLeft] = useState(0)
  const [breathingMode, setBreathingMode] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(10)
  const [dailyProgress, setDailyProgress] = useState(0)

  // Estados para la práctica individual
  const [practicingEmotion, setPracticingEmotion] = useState<string | null>(null)
  const [practiceSuccess, setPracticeSuccess] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const emotions = [
    {
      id: "happy",
      name: "Feliz",
      emoji: "😊",
      color: "bg-yellow-300",
      sound: 523.25,
      description: "Cuando algo te hace sentir bien y quieres sonreír",
      tips: ["Comparte tu alegría con otros", "Haz algo que te guste", "Sonríe más seguido"],
    },
    {
      id: "sad",
      name: "Triste",
      emoji: "😢",
      color: "bg-blue-300",
      sound: 293.66,
      description: "Cuando algo te pone melancólico o decaído",
      tips: ["Habla con alguien de confianza", "Haz algo relajante", "Recuerda momentos felices"],
    },
    {
      id: "angry",
      name: "Enojado",
      emoji: "😠",
      color: "bg-red-300",
      sound: 220.0,
      description: "Cuando algo te molesta o frustra mucho",
      tips: ["Respira profundo", "Cuenta hasta 10", "Piensa en una solución"],
    },
    {
      id: "surprised",
      name: "Sorprendido",
      emoji: "😲",
      color: "bg-purple-300",
      sound: 659.25,
      description: "Cuando algo inesperado sucede",
      tips: ["Tómate un momento", "Procesa lo que pasó", "Pregunta si tienes dudas"],
    },
    {
      id: "neutral",
      name: "Tranquilo",
      emoji: "😐",
      color: "bg-gray-300",
      sound: 440.0,
      description: "Cuando te sientes calmado y en paz",
      tips: ["Disfruta la calma", "Reflexiona", "Planea algo divertido"],
    },
    {
      id: "fearful",
      name: "Asustado",
      emoji: "😨",
      color: "bg-indigo-300",
      sound: 174.61,
      description: "Cuando algo te da miedo o te preocupa",
      tips: ["Busca a alguien de confianza", "Respira lentamente", "Recuerda que eres valiente"],
    },
  ]

  const getColorForEmotion = (emotionId: string) => {
    const color = getEmotionColor(emotionId)
    return `bg-[${color}]`
  }

  const getBackgroundColor = () => {
    if (accessibilitySettings.blackWhiteMode) {
      return theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    }
    return theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-blue-50"
  }

  // Cargar modelos de Face-api.js desde carpeta local
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Cargando modelos de Face-api.js desde /models...")

        const MODEL_URL = "/models"

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ])

        console.log("Modelos cargados exitosamente")
        setModelsLoaded(true)
        setDetectionError(null)
      } catch (error) {
        console.error("Error cargando modelos:", error)
        setDetectionError(
          "Error cargando modelos de reconocimiento facial. Verifica que los archivos estén en /public/models/",
        )

        // Fallback: permitir modo simulación
        setTimeout(() => {
          setDetectionError("Los modelos no se pudieron cargar. Puedes usar el modo simulación mientras tanto.")
        }, 3000)
      }
    }

    loadModels()
  }, [])

  // Cargar datos guardados
  useEffect(() => {
    const savedHistory = localStorage.getItem("emotion-history")
    const savedStats = localStorage.getItem("emotion-stats")
    const savedDailyProgress = localStorage.getItem("daily-emotion-progress")
    const savedDate = localStorage.getItem("daily-emotion-date")

    if (savedHistory) {
      const history = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
      setEmotionHistory(history)
    }

    if (savedStats) {
      setEmotionStats(JSON.parse(savedStats))
    }

    // Resetear progreso diario si es un nuevo día
    const today = new Date().toDateString()
    if (savedDate !== today) {
      setDailyProgress(0)
      localStorage.setItem("daily-emotion-date", today)
      localStorage.setItem("daily-emotion-progress", "0")
    } else if (savedDailyProgress) {
      setDailyProgress(Number.parseInt(savedDailyProgress))
    }
  }, [])

  // Guardar datos cuando cambien
  useEffect(() => {
    if (emotionHistory.length > 0) {
      localStorage.setItem("emotion-history", JSON.stringify(emotionHistory))
    }
  }, [emotionHistory])

  useEffect(() => {
    if (Object.keys(emotionStats).length > 0) {
      localStorage.setItem("emotion-stats", JSON.stringify(emotionStats))
    }
  }, [emotionStats])

  useEffect(() => {
    localStorage.setItem("daily-emotion-progress", dailyProgress.toString())
  }, [dailyProgress])

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

  // Timer para el juego
  useEffect(() => {
    if (gameMode && gameTimeLeft > 0) {
      gameTimerRef.current = setTimeout(() => {
        setGameTimeLeft(gameTimeLeft - 1)
      }, 1000)
    } else if (gameMode && gameTimeLeft === 0) {
      endGame()
    }

    return () => {
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current)
      }
    }
  }, [gameTimeLeft, gameMode])

  // Timer para respiración
  useEffect(() => {
    if (breathingMode) {
      const phases = {
        inhale: { duration: 4000, next: "hold" },
        hold: { duration: 2000, next: "exhale" },
        exhale: { duration: 6000, next: "inhale" },
      }

      const currentPhase = phases[breathingPhase]
      breathingTimerRef.current = setTimeout(() => {
        setBreathingPhase(currentPhase.next as any)
        if (breathingPhase === "exhale") {
          setBreathingCount((prev) => prev + 1)
        }
      }, currentPhase.duration)
    }

    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current)
      }
    }
  }, [breathingMode, breathingPhase])

  // Función para reproducir sonido de emoción mejorado
  const playEmotionSound = (frequency: number, emotion: string) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime

      // Crear diferentes tipos de sonidos según la emoción
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, currentTime)

      // Configurar tipo de onda según emoción
      switch (emotion) {
        case "happy":
          oscillator.type = "triangle"
          filter.type = "highpass"
          filter.frequency.value = 200
          break
        case "sad":
          oscillator.type = "sine"
          filter.type = "lowpass"
          filter.frequency.value = 400
          break
        case "angry":
          oscillator.type = "square"
          filter.type = "bandpass"
          filter.frequency.value = 300
          break
        default:
          oscillator.type = "sine"
          filter.type = "allpass"
      }

      const baseVolume = theme === "dark" ? 0.1 : 0.15
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(baseVolume, currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.8)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + 0.8)
    } catch (error) {
      console.log("Error al reproducir sonido de emoción:", error)
    }
  }

  // Función para agregar emoción al historial
  const addEmotionToHistory = (emotion: string, confidence: number) => {
    const newEntry: EmotionHistory = {
      emotion,
      confidence,
      timestamp: new Date(),
    }

    setEmotionHistory((prev) => [...prev.slice(-49), newEntry]) // Mantener últimas 50
    setEmotionStats((prev) => ({
      ...prev,
      [emotion]: (prev[emotion] || 0) + 1,
    }))
    setTotalDetections((prev) => prev + 1)
    setDailyProgress((prev) => {
      const newProgress = prev + 1

      // Desbloquear medallas por progreso diario
      if (newProgress === 5 && !medallasDesbloqueadas.includes(7)) {
        desbloquearMedalla(7) // Medalla por 5 detecciones
      }
      if (newProgress === 10 && !medallasDesbloqueadas.includes(8)) {
        desbloquearMedalla(8) // Medalla por 10 detecciones
      }

      return newProgress
    })
  }

  // Función para simular detección de emociones (fallback)
  const simulateEmotionDetection = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = 0.8 + Math.random() * 0.2

    setCurrentEmotion(randomEmotion.id)
    playEmotionSound(randomEmotion.sound, randomEmotion.id)
    setDetectionConfidence(confidence)
    setFaceDetected(true)

    addEmotionToHistory(randomEmotion.id, confidence)

    // Verificar si es la emoción objetivo en modo juego
    if (gameMode && targetEmotion === randomEmotion.id) {
      setGameScore((prev) => prev + 10)
      setTargetEmotion(emotions[Math.floor(Math.random() * emotions.length)].id)
    }
  }

  // Inicializar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraPermission(true)
        setDetectionError(null)
        setSessionStartTime(new Date())
      }
    } catch (error) {
      console.error("Error accediendo a la cámara:", error)
      setCameraPermission(false)
      setDetectionError("No se pudo acceder a la cámara. Por favor, permite el acceso.")
    }
  }

  // Detener cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraPermission(null)
    setSessionStartTime(null)
  }

  // Detectar emociones en tiempo real
  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Configurar canvas
    const displaySize = { width: video.videoWidth, height: video.videoHeight }
    faceapi.matchDimensions(canvas, displaySize)

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      if (detections.length > 0) {
        setFaceDetected(true)

        // Limpiar canvas
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        // Redimensionar detecciones
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // Dibujar detecciones
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

        // Obtener la emoción más probable
        const expressions = detections[0].expressions
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a as keyof typeof expressions] > expressions[b as keyof typeof expressions] ? a : b,
        )

        const confidence = expressions[maxExpression as keyof typeof expressions]
        setDetectionConfidence(confidence)

        // Mapear emociones de Face-api.js a nuestras emociones
        let detectedEmotion = maxExpression
        if (maxExpression === "disgusted") detectedEmotion = "angry"
        if (maxExpression === "fear") detectedEmotion = "fearful"

        // Solo cambiar emoción si la confianza es alta
        if (confidence > 0.6 && detectedEmotion !== currentEmotion) {
          setCurrentEmotion(detectedEmotion)
          const emotionData = emotions.find((e) => e.id === detectedEmotion)
          if (emotionData) {
            playEmotionSound(emotionData.sound, emotionData.id)
            addEmotionToHistory(detectedEmotion, confidence)

            // Verificar si es la emoción objetivo en modo juego
            if (gameMode && targetEmotion === detectedEmotion) {
              setGameScore((prev) => prev + 10)
              setTargetEmotion(emotions[Math.floor(Math.random() * emotions.length)].id)
            }
          }
        }
      } else {
        setFaceDetected(false)
        // Limpiar canvas si no hay cara detectada
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    } catch (error) {
      console.error("Error en detección:", error)
    }
  }

  // Iniciar/detener detección
  const toggleDetection = async () => {
    if (isDetecting) {
      // Detener detección
      setIsDetecting(false)
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      stopCamera()
      setFaceDetected(false)
      setDetectionConfidence(0)
    } else {
      // Iniciar detección
      if (!modelsLoaded) {
        // Modo simulación si los modelos no están cargados
        setIsDetecting(true)
        setDetectionError("Usando modo simulación - las emociones cambiarán automáticamente")

        detectionIntervalRef.current = setInterval(() => {
          simulateEmotionDetection()
        }, 3000)
        return
      }

      await startCamera()
      setIsDetecting(true)

      // Esperar a que el video esté listo
      setTimeout(() => {
        detectionIntervalRef.current = setInterval(detectEmotions, 100)
      }, 1000)
    }
  }

  // Iniciar juego de emociones
  const startGame = (mode: "practice" | "challenge") => {
    setGameMode(mode)
    setGameScore(0)
    setGameTimeLeft(mode === "challenge" ? 60 : 30)
    setTargetEmotion(emotions[Math.floor(Math.random() * emotions.length)].id)
  }

  // Terminar juego
  const endGame = () => {
    setGameMode(null)
    setTargetEmotion(null)
    setGameTimeLeft(0)

    // Desbloquear medallas por puntuación
    if (gameScore >= 50 && !medallasDesbloqueadas.includes(9)) {
      desbloquearMedalla(9)
    }
  }

  // Iniciar ejercicio de respiración
  const startBreathing = () => {
    setBreathingMode(true)
    setBreathingPhase("inhale")
    setBreathingCount(0)
  }

  // Detener ejercicio de respiración
  const stopBreathing = () => {
    setBreathingMode(false)
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current)
    }
  }

  // Detener práctica individual
  const stopPracticing = () => {
    setPracticingEmotion(null)
    setPracticeSuccess(false)
  }

  // Función para practicar una emoción individualmente
  const startPracticeEmotion = (emotionId: string) => {
    setPracticingEmotion(emotionId)
    setPracticeSuccess(false)
  }

  // Función para detectar la emoción en la práctica individual
  const detectEmotionInPractice = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || !practicingEmotion) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Configurar canvas
    const displaySize = { width: video.videoWidth, height: video.videoHeight }
    faceapi.matchDimensions(canvas, displaySize)

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      if (detections.length > 0) {
        setFaceDetected(true)

        // Limpiar canvas
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        // Redimensionar detecciones
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // Dibujar detecciones
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

        // Obtener la emoción más probable
        const expressions = detections[0].expressions
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a as keyof typeof expressions] > expressions[b as keyof typeof expressions] ? a : b,
        )

        // Mapear emociones de Face-api.js a nuestras emociones
        let detectedEmotion = maxExpression
        if (maxExpression === "disgusted") detectedEmotion = "angry"
        if (maxExpression === "fear") detectedEmotion = "fearful"

        // Verificar si la emoción detectada coincide con la emoción que se está practicando
        if (detectedEmotion === practicingEmotion) {
          const confidence = expressions[maxExpression as keyof typeof expressions]

          // Si la confianza es mayor al 85%, marcar como exitoso
          if (confidence > 0.85) {
            setPracticeSuccess(true)
            stopDetection()
            const emotionData = emotions.find((e) => e.id === practicingEmotion)
            playEmotionSound(emotionData.sound, emotionData.id)

            // Desbloquear medalla correspondiente
            let medalId = 0
            switch (practicingEmotion) {
              case "happy":
                medalId = 10
                break
              case "sad":
                medalId = 11
                break
              case "angry":
                medalId = 12
                break
              case "surprised":
                medalId = 13
                break
              case "fearful":
                medalId = 14
                break
              case "neutral":
                medalId = 15
                break
            }

            if (medalId > 0 && !medallasDesbloqueadas.includes(medalId)) {
              desbloquearMedalla(medalId)
            }
          }

          setDetectionConfidence(confidence)
        } else {
          setPracticeSuccess(false)
          setDetectionConfidence(0)
        }
      } else {
        setFaceDetected(false)
        setPracticeSuccess(false)
        setDetectionConfidence(0)

        // Limpiar canvas si no hay cara detectada
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    } catch (error) {
      console.error("Error en detección:", error)
    }
  }

  // Iniciar detección para la práctica individual
  const startDetectionForPractice = async () => {
    if (!modelsLoaded) {
      setDetectionError("Los modelos no se han cargado. Intenta de nuevo.")
      return
    }

    await startCamera()
    setIsDetecting(true)

    // Esperar a que el video esté listo
    setTimeout(() => {
      detectionIntervalRef.current = setInterval(detectEmotionInPractice, 100)
    }, 1000)
  }

  // Detener detección
  const stopDetection = () => {
    setIsDetecting(false)
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }
    stopCamera()
    setFaceDetected(false)
    setDetectionConfidence(0)
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current)
      }
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current)
      }
      stopCamera()
    }
  }, [])

  const currentEmotionData = emotions.find((e) => e.id === currentEmotion) || emotions[4]
  const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60) : 0

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getBackgroundColor()}`}>
      <AppSidebar />

      {/* Main content */}
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header with user profile */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-2`}>
              Centro de Emociones
            </h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Explora y aprende sobre tus emociones, {userName || "Juan"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Progreso diario: {dailyProgress}/{dailyGoal}
              </div>
              <Progress value={(dailyProgress / dailyGoal) * 100} className="w-32" />
            </div>
            <div
              className={`h-12 w-12 border-4 border-teal-400 rounded-full ${favoriteAnimal.color} flex items-center justify-center text-white text-xl`}
            >
              {favoriteAnimal.emoji}
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "camera", label: "Cámara", icon: Camera },
            { id: "stats", label: "Estadísticas", icon: BarChart3 },
            { id: "games", label: "Juegos", icon: Gamepad2 },
            { id: "breathing", label: "Respiración", icon: Wind },
            { id: "tips", label: "Consejos", icon: BookOpen },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <tab.icon size={16} />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "camera" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera and detection area */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="text-blue-500" />
                  Cámara de Emociones
                  {isDetecting && (
                    <Badge variant="secondary" className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                      En vivo
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Video container */}
                <div className="relative mb-6">
                  <div className="relative w-full max-w-md mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-auto rounded-2xl shadow-lg border-4 border-gray-200 dark:border-gray-600"
                      style={{ transform: "scaleX(-1)" }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full rounded-2xl"
                      style={{ transform: "scaleX(-1)" }}
                    />

                    {/* Status indicators */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {faceDetected && <Badge className="bg-green-500 text-white">👤 Cara detectada</Badge>}
                      {detectionConfidence > 0 && (
                        <Badge className="bg-blue-500 text-white">
                          {Math.round(detectionConfidence * 100)}% confianza
                        </Badge>
                      )}
                      {sessionStartTime && (
                        <Badge className="bg-purple-500 text-white">
                          <Clock size={12} className="mr-1" />
                          {sessionDuration}min
                        </Badge>
                      )}
                    </div>

                    {/* Game mode overlay */}
                    {gameMode && targetEmotion && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400">
                          <CardContent className="p-3 text-center">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">Haz esta emoción:</p>
                                <p className="text-lg">
                                  {emotions.find((e) => e.id === targetEmotion)?.emoji}{" "}
                                  {emotions.find((e) => e.id === targetEmotion)?.name}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Puntos: {gameScore}</p>
                                <p className="text-sm">Tiempo: {gameTimeLeft}s</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="text-center space-y-4">
                  <Button
                    onClick={toggleDetection}
                    size="lg"
                    className={`px-8 py-4 text-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg ${
                      isDetecting
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isDetecting ? (
                      <>
                        <CameraOff className="mr-2" />
                        Detener Cámara
                      </>
                    ) : modelsLoaded ? (
                      <>
                        <Camera className="mr-2" />
                        Iniciar Cámara
                      </>
                    ) : (
                      <>
                        <Play className="mr-2" />
                        Modo Simulación
                      </>
                    )}
                  </Button>

                  {/* Status messages */}
                  {!modelsLoaded && !isDetecting && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-400 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg">
                      <p className="font-medium">💡 Información</p>
                      <p className="text-sm">
                        Los modelos se están cargando. Si no cargan, puedes usar el modo simulación.
                      </p>
                    </div>
                  )}

                  {isDetecting && !modelsLoaded && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
                      <p className="font-medium">🎭 Modo Simulación Activo</p>
                      <p className="text-sm">Las emociones cambiarán automáticamente cada 3 segundos.</p>
                    </div>
                  )}

                  {detectionError && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                      {detectionError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current emotion display */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  Tu Emoción Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div
                    className={`inline-block w-40 h-40 ${getColorForEmotion(currentEmotionData.id)} rounded-full flex items-center justify-center text-8xl shadow-lg transition-all duration-500 hover:scale-110 animate-pulse`}
                  >
                    {currentEmotionData.emoji}
                  </div>
                  <p className={`text-3xl font-bold mt-6 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    {currentEmotionData.name}
                  </p>
                  {faceDetected && detectionConfidence > 0.6 && (
                    <p className={`text-lg mt-2 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                      ¡Detectado con {Math.round(detectionConfidence * 100)}% de confianza!
                    </p>
                  )}
                  <p
                    className={`text-sm mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-sm mx-auto`}
                  >
                    {currentEmotionData.description}
                  </p>
                </div>

                {/* Emotion tips */}
                <Card className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <CardContent className="p-4">
                    <h4 className={`text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-3`}>
                      Consejos para {currentEmotionData.name}
                    </h4>
                    <ul className="space-y-2">
                      {currentEmotionData.tips.map((tip, index) => (
                        <li
                          key={index}
                          className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-start gap-2`}
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <Button size="sm" variant="outline" onClick={() => startPracticeEmotion(currentEmotionData.id)}>
                      Practicar {currentEmotionData.name}
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estadísticas generales */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  Estadísticas Generales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Total detecciones:</span>
                    <Badge variant="secondary">{totalDetections}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Hoy:</span>
                    <Badge variant="secondary">{dailyProgress}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>Sesión actual:</span>
                    <Badge variant="secondary">{sessionDuration} min</Badge>
                  </div>
                  <Progress value={(dailyProgress / dailyGoal) * 100} className="w-full" />
                  <p className="text-sm text-center text-gray-500">Progreso hacia tu meta diaria ({dailyGoal})</p>
                </div>
              </CardContent>
            </Card>

            {/* Distribución de emociones */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg md:col-span-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-blue-500" />
                  Distribución de Emociones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emotions.map((emotion) => {
                    const count = emotionStats[emotion.id] || 0
                    const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0

                    return (
                      <div key={emotion.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{emotion.emoji}</span>
                            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{emotion.name}</span>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{count}</Badge>
                            <span className="text-sm text-gray-500 ml-2">{percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Historial reciente */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg md:col-span-3`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-purple-500" />
                  Historial Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {emotionHistory
                    .slice(-8)
                    .reverse()
                    .map((entry, index) => {
                      const emotionData = emotions.find((e) => e.id === entry.emotion)
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{emotionData?.emoji}</div>
                            <p className="font-medium text-sm">{emotionData?.name}</p>
                            <p className="text-xs text-gray-500">{entry.timestamp.toLocaleTimeString()}</p>
                            <Badge variant="outline" className="mt-1">
                              {Math.round(entry.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                </div>
                {emotionHistory.length === 0 && (
                  <div className="text-center py-8">
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                      Aún no hay historial. ¡Empieza a usar la cámara de emociones!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "games" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Juegos disponibles */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="text-green-500" />
                  Juegos de Emociones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                >
                  <h3 className="font-bold text-lg mb-2">🎯 Modo Práctica</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Practica diferentes expresiones sin presión de tiempo.
                  </p>
                  <Button onClick={() => startGame("practice")} disabled={gameMode !== null} className="w-full">
                    <Target className="mr-2" size={16} />
                    Iniciar Práctica
                  </Button>
                </div>

                <div
                  className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                >
                  <h3 className="font-bold text-lg mb-2">⚡ Desafío Rápido</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Haz tantas expresiones como puedas en 60 segundos.
                  </p>
                  <Button
                    onClick={() => startGame("challenge")}
                    disabled={gameMode !== null}
                    className="w-full"
                    variant="secondary"
                  >
                    <Sparkles className="mr-2" size={16} />
                    Iniciar Desafío
                  </Button>
                </div>

                {gameMode && (
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-400">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">Juego en Progreso</h3>
                      <Button size="sm" variant="outline" onClick={endGame}>
                        <RotateCcw size={14} className="mr-1" />
                        Terminar
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          Puntuación: <strong>{gameScore}</strong>
                        </p>
                        <p>
                          Tiempo: <strong>{gameTimeLeft}s</strong>
                        </p>
                      </div>
                      <div>
                        <p>Objetivo:</p>
                        <p className="text-lg">
                          {emotions.find((e) => e.id === targetEmotion)?.emoji}{" "}
                          {emotions.find((e) => e.id === targetEmotion)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recompensas y logros */}
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" />
                  Logros y Recompensas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                >
                  <h3 className="font-bold mb-3">🏆 Logros Disponibles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Primera detección</span>
                      <Badge variant={totalDetections >= 1 ? "default" : "outline"}>
                        {totalDetections >= 1 ? "✓" : "○"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">5 detecciones en un día</span>
                      <Badge variant={medallasDesbloqueadas.includes(7) ? "default" : "outline"}>
                        {medallasDesbloqueadas.includes(7) ? "✓" : "○"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">10 detecciones en un día</span>
                      <Badge variant={medallasDesbloqueadas.includes(8) ? "default" : "outline"}>
                        {medallasDesbloqueadas.includes(8) ? "✓" : "○"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">50 puntos en juego</span>
                      <Badge variant={medallasDesbloqueadas.includes(9) ? "default" : "outline"}>
                        {medallasDesbloqueadas.includes(9) ? "✓" : "○"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                >
                  <h3 className="font-bold mb-3">🎁 Próximas Recompensas</h3>
                  <div className="space-y-2 text-sm">
                    <p>• 25 detecciones: Nuevo tema de colores</p>
                    <p>• 50 detecciones: Sonidos especiales</p>
                    <p>• 100 detecciones: Modo experto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "breathing" && (
          <div className="max-w-2xl mx-auto">
            <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="text-blue-500" />
                  Ejercicios de Respiración
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {!breathingMode ? (
                  <div className="space-y-6">
                    <div className="text-6xl animate-pulse">🫁</div>
                    <h3 className="text-2xl font-bold">Respiración Calmante</h3>
                    <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Los ejercicios de respiración te ayudan a relajarte y controlar tus emociones.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"}`}>
                        <div className="text-2xl mb-2">🌬️</div>
                        <p className="font-medium">Inhalar</p>
                        <p className="text-xs text-gray-500">4 segundos</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}`}>
                        <div className="text-2xl mb-2">⏸️</div>
                        <p className="font-medium">Mantener</p>
                        <p className="text-xs text-gray-500">2 segundos</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900/30" : "bg-green-50"}`}>
                        <div className="text-2xl mb-2">💨</div>
                        <p className="font-medium">Exhalar</p>
                        <p className="text-xs text-gray-500">6 segundos</p>
                      </div>
                    </div>
                    <Button onClick={startBreathing} size="lg" className="px-8">
                      <Play className="mr-2" />
                      Comenzar Ejercicio
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="relative">
                      <div
                        className={`w-40 h-40 mx-auto rounded-full border-4 transition-all duration-1000 flex items-center justify-center text-4xl ${
                          breathingPhase === "inhale"
                            ? "border-blue-400 bg-blue-100 dark:bg-blue-900/30 scale-110"
                            : breathingPhase === "hold"
                              ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 scale-110"
                              : "border-green-400 bg-green-100 dark:bg-green-900/30 scale-90"
                        }`}
                      >
                        {breathingPhase === "inhale" ? "🌬️" : breathingPhase === "hold" ? "⏸️" : "💨"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold capitalize">
                        {breathingPhase === "inhale"
                          ? "Inhala lentamente"
                          : breathingPhase === "hold"
                            ? "Mantén el aire"
                            : "Exhala despacio"}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">Ciclo {breathingCount + 1}</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button onClick={stopBreathing} variant="outline">
                        <Pause className="mr-2" />
                        Pausar
                      </Button>
                      {breathingCount >= 5 && (
                        <Button onClick={stopBreathing} variant="default">
                          <Check className="mr-2" />
                          Completar
                        </Button>
                      )}
                    </div>

                    {breathingCount >= 5 && (
                      <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-400">
                        <p className="text-green-800 dark:text-green-300 font-medium">
                          ¡Excelente! Has completado 5 ciclos de respiración. ¿Te sientes más relajado?
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emotions.map((emotion) => (
              <Card
                key={emotion.id}
                className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg hover:shadow-xl transition-shadow`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 ${getColorForEmotion(emotion.id)} rounded-full flex items-center justify-center text-2xl`}
                    >
                      {emotion.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{emotion.name}</h3>
                      <p className="text-sm text-gray-500 font-normal">{emotion.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Qué puedes hacer:</h4>
                    <ul className="space-y-2">
                      {emotion.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-1 text-xs">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setCurrentEmotion(emotion.id)
                        playEmotionSound(emotion.sound, emotion.id)
                      }}
                    >
                      <Heart size={14} className="mr-2" />
                      Practicar {emotion.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Emotions practice grid - Always visible */}
        <Card className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg mt-8`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-purple-500" />
              Practica Estas Emociones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-center mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Haz estas expresiones frente a la cámara para que pueda reconocerlas
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => {
                    setCurrentEmotion(emotion.id)
                    playEmotionSound(emotion.sound, emotion.id)
                  }}
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 relative ${
                    currentEmotion === emotion.id
                      ? `${getColorForEmotion(emotion.id)} shadow-lg transform scale-105 ring-4 ring-blue-400`
                      : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-4xl mb-2">{emotion.emoji}</div>
                  <p
                    className={`font-medium text-sm ${
                      currentEmotion === emotion.id
                        ? "text-gray-800"
                        : theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                    }`}
                  >
                    {emotion.name}
                  </p>
                  {audioEnabled && (
                    <div className="mt-2">
                      <span className="text-xs opacity-70">🎵</span>
                    </div>
                  )}
                  {currentEmotion === emotion.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practicing Emotion Section */}
        {practicingEmotion && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <Card className="max-w-3xl w-full mx-4 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={stopPracticing}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="text-red-500" />
                  Practicando: {emotions.find((e) => e.id === practicingEmotion)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-[8rem]">{emotions.find((e) => e.id === practicingEmotion)?.emoji}</div>
                  <p className="text-xl">Imita esta expresión frente a la cámara</p>
                </div>

                <div className="relative w-full max-w-md mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto rounded-2xl shadow-lg border-4 border-gray-200 dark:border-gray-600"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full rounded-2xl"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>

                {isDetecting ? (
                  <>
                    <Progress
                      value={detectionConfidence * 100}
                      className="h-6"
                      style={{
                        "--foreground":
                          detectionConfidence > 0.85 ? "green" : detectionConfidence > 0.6 ? "yellow" : "red",
                      }}
                    />
                    <div className="relative">
                      <div className="absolute top-0 left-0 h-full w-1 bg-red-500" style={{ left: "85%" }} />
                      <p className="text-sm text-gray-500 text-center">
                        Confianza: {Math.round(detectionConfidence * 100)}% (Objetivo: 85%)
                      </p>
                    </div>
                  </>
                ) : (
                  <Button onClick={startDetectionForPractice} className="w-full">
                    Iniciar Detección
                  </Button>
                )}

                {practiceSuccess && (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-500">¡Lo lograste! 🎉</h2>
                    <p className="text-lg">
                      ¡Felicidades! Has dominado la emoción de {emotions.find((e) => e.id === practicingEmotion)?.name}
                    </p>
                    <Button onClick={stopPracticing}>Continuar</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
