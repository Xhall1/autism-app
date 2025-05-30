"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useApp } from "@/lib/app-context"
import { useState, useEffect, useRef } from "react"
import * as faceapi from "face-api.js"

export default function EmocionesPage() {
  const { theme, audioEnabled, getFavoriteAnimalData, userName } = useApp()

  const favoriteAnimal = getFavoriteAnimalData()
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [faceDetected, setFaceDetected] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const emotions = [
    { id: "happy", name: "Feliz", emoji: "😊", color: "bg-yellow-300", sound: 523.25 },
    { id: "sad", name: "Triste", emoji: "😢", color: "bg-blue-300", sound: 293.66 },
    { id: "angry", name: "Enojado", emoji: "😠", color: "bg-red-300", sound: 220.0 },
    { id: "surprised", name: "Sorprendido", emoji: "😲", color: "bg-purple-300", sound: 659.25 },
    { id: "neutral", name: "Tranquilo", emoji: "😐", color: "bg-gray-300", sound: 440.0 },
    { id: "fearful", name: "Asustado", emoji: "😨", color: "bg-indigo-300", sound: 174.61 },
  ]

  // Cargar modelos de Face-api.js desde CDN
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Cargando modelos de Face-api.js desde CDN...")

        // Usar CDN para los modelos
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
        setDetectionError("Error cargando modelos de reconocimiento facial. Verifica tu conexión a internet.")

        // Fallback: permitir modo simulación
        setTimeout(() => {
          setDetectionError("Los modelos no se pudieron cargar. Puedes usar el modo simulación mientras tanto.")
        }, 3000)
      }
    }

    loadModels()
  }, [])

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

  // Función para reproducir sonido de emoción
  const playEmotionSound = (frequency: number) => {
    if (!audioEnabled || !audioContextRef.current) return

    try {
      const audioContext = audioContextRef.current
      const currentTime = audioContext.currentTime

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, currentTime)
      oscillator.type = "sine"

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

  // Función para simular detección de emociones (fallback)
  const simulateEmotionDetection = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    setCurrentEmotion(randomEmotion.id)
    playEmotionSound(randomEmotion.sound)
    setDetectionConfidence(0.8 + Math.random() * 0.2) // Simular confianza alta
    setFaceDetected(true)
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
            playEmotionSound(emotionData.sound)
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

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      stopCamera()
    }
  }, [])

  const currentEmotionData = emotions.find((e) => e.id === currentEmotion) || emotions[4]

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
            <span className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
        <div className="max-w-6xl mx-auto">
          {/* Bear mascot and title */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="w-32 h-32 mx-auto relative">
                <div
                  className={`w-full h-full ${favoriteAnimal.color} rounded-full flex items-center justify-center text-6xl shadow-lg`}
                >
                  {favoriteAnimal.emoji}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  {currentEmotionData.emoji}
                </div>
              </div>
            </div>
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-4`}>
              ¡Vamos a reconocer tus emociones, {userName || "Juan"}!
            </h2>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Mira a la cámara y haz diferentes expresiones
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Camera and detection area */}
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-6 shadow-lg`}>
              <h3
                className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6 text-center`}
              >
                Cámara de Emociones
              </h3>

              {/* Video container */}
              <div className="relative mb-6">
                <div className="relative w-full max-w-md mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto rounded-2xl shadow-lg"
                    style={{ transform: "scaleX(-1)" }} // Mirror effect
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full rounded-2xl"
                    style={{ transform: "scaleX(-1)" }}
                  />

                  {/* Status indicators */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {faceDetected && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        👤 Cara detectada
                      </div>
                    )}
                    {detectionConfidence > 0 && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {Math.round(detectionConfidence * 100)}% confianza
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="text-center space-y-4">
                <button
                  onClick={toggleDetection}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg ${
                    isDetecting
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isDetecting ? "🛑 Detener Detección" : modelsLoaded ? "📹 Iniciar Cámara" : "🎭 Modo Simulación"}
                </button>

                {!modelsLoaded && !isDetecting && (
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">💡 Información</p>
                    <p className="text-sm">
                      Los modelos se están cargando desde internet. Si no cargan, puedes usar el modo simulación.
                    </p>
                  </div>
                )}

                {isDetecting && !modelsLoaded && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">🎭 Modo Simulación Activo</p>
                    <p className="text-sm">Las emociones cambiarán automáticamente cada 3 segundos.</p>
                  </div>
                )}

                {detectionError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {detectionError}
                  </div>
                )}

                {cameraPermission === false && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">¡Necesitamos acceso a tu cámara!</p>
                    <p className="text-sm">Por favor, permite el acceso para poder detectar tus emociones.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current emotion display */}
            <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-6 shadow-lg`}>
              <h3
                className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6 text-center`}
              >
                Tu Emoción Actual
              </h3>

              <div className="text-center mb-8">
                <div
                  className={`inline-block w-40 h-40 ${currentEmotionData.color} rounded-full flex items-center justify-center text-8xl shadow-lg transition-all duration-500 hover:scale-110`}
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
              </div>

              {/* Emotion tips */}
              <div className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-2xl p-6`}>
                <h4 className={`text-lg font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-3`}>
                  Consejos para {currentEmotionData.name}
                </h4>
                <div className="text-center">
                  {currentEmotion === "happy" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      ¡Qué bueno que estés feliz! Comparte tu alegría con otros y disfruta este momento.
                    </p>
                  )}
                  {currentEmotion === "sad" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Está bien sentirse triste a veces. Habla con alguien de confianza o haz algo que te guste.
                    </p>
                  )}
                  {currentEmotion === "angry" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Cuando te sientes enojado, respira profundo y cuenta hasta 10. Luego piensa en una solución.
                    </p>
                  )}
                  {currentEmotion === "surprised" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      ¡Las sorpresas pueden ser divertidas! Tómate un momento para procesar lo que pasó.
                    </p>
                  )}
                  {currentEmotion === "neutral" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Estar tranquilo es perfecto. Es un buen momento para reflexionar o planear algo divertido.
                    </p>
                  )}
                  {currentEmotion === "fearful" && (
                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Si te sientes asustado, busca a alguien de confianza. Recuerda que eres valiente y fuerte.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Emotions grid */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-lg mt-8`}>
            <h3
              className={`text-2xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-800"} mb-6 text-center`}
            >
              Practica Estas Emociones
            </h3>
            <p className={`text-center mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Haz estas expresiones frente a la cámara para que pueda reconocerlas
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {emotions.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => {
                    setCurrentEmotion(emotion.id)
                    playEmotionSound(emotion.sound)
                  }}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    currentEmotion === emotion.id
                      ? `${emotion.color} shadow-lg transform scale-105`
                      : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-4xl mb-2">{emotion.emoji}</div>
                  <p
                    className={`font-medium ${
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
