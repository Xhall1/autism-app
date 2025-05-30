"use client"

import { useApp } from "@/lib/app-context"
import { useEffect } from "react"

// Mapeo de colores a clases de Tailwind
const colorClasses = {
  purple: {
    primary: "purple",
    bg: {
      light: "bg-purple-50",
      dark: "bg-purple-900/20",
    },
    text: {
      light: "text-purple-600",
      dark: "text-purple-400",
    },
    border: {
      light: "border-purple-300",
      dark: "border-purple-700",
    },
    hover: {
      light: "hover:bg-purple-100 hover:text-purple-700",
      dark: "hover:bg-purple-800/30 hover:text-purple-300",
    },
    active: {
      light: "bg-purple-200 text-purple-800",
      dark: "bg-purple-900/50 text-purple-300",
    },
  },
  blue: {
    primary: "blue",
    bg: {
      light: "bg-blue-50",
      dark: "bg-blue-900/20",
    },
    text: {
      light: "text-blue-600",
      dark: "text-blue-400",
    },
    border: {
      light: "border-blue-300",
      dark: "border-blue-700",
    },
    hover: {
      light: "hover:bg-blue-100 hover:text-blue-700",
      dark: "hover:bg-blue-800/30 hover:text-blue-300",
    },
    active: {
      light: "bg-blue-200 text-blue-800",
      dark: "bg-blue-900/50 text-blue-300",
    },
  },
  teal: {
    primary: "teal",
    bg: {
      light: "bg-teal-50",
      dark: "bg-teal-900/20",
    },
    text: {
      light: "text-teal-600",
      dark: "text-teal-400",
    },
    border: {
      light: "border-teal-300",
      dark: "border-teal-700",
    },
    hover: {
      light: "hover:bg-teal-100 hover:text-teal-700",
      dark: "hover:bg-teal-800/30 hover:text-teal-300",
    },
    active: {
      light: "bg-teal-200 text-teal-800",
      dark: "bg-teal-900/50 text-teal-300",
    },
  },
  green: {
    primary: "green",
    bg: {
      light: "bg-green-50",
      dark: "bg-green-900/20",
    },
    text: {
      light: "text-green-600",
      dark: "text-green-400",
    },
    border: {
      light: "border-green-300",
      dark: "border-green-700",
    },
    hover: {
      light: "hover:bg-green-100 hover:text-green-700",
      dark: "hover:bg-green-800/30 hover:text-green-300",
    },
    active: {
      light: "bg-green-200 text-green-800",
      dark: "bg-green-900/50 text-green-300",
    },
  },
  pink: {
    primary: "pink",
    bg: {
      light: "bg-pink-50",
      dark: "bg-pink-900/20",
    },
    text: {
      light: "text-pink-600",
      dark: "text-pink-400",
    },
    border: {
      light: "border-pink-300",
      dark: "border-pink-700",
    },
    hover: {
      light: "hover:bg-pink-100 hover:text-pink-700",
      dark: "hover:bg-pink-800/30 hover:text-pink-300",
    },
    active: {
      light: "bg-pink-200 text-pink-800",
      dark: "bg-pink-900/50 text-pink-300",
    },
  },
  yellow: {
    primary: "yellow",
    bg: {
      light: "bg-yellow-50",
      dark: "bg-yellow-900/20",
    },
    text: {
      light: "text-yellow-600",
      dark: "text-yellow-400",
    },
    border: {
      light: "border-yellow-300",
      dark: "border-yellow-700",
    },
    hover: {
      light: "hover:bg-yellow-100 hover:text-yellow-700",
      dark: "hover:bg-yellow-800/30 hover:text-yellow-300",
    },
    active: {
      light: "bg-yellow-200 text-yellow-800",
      dark: "bg-yellow-900/50 text-yellow-300",
    },
  },
  orange: {
    primary: "orange",
    bg: {
      light: "bg-orange-50",
      dark: "bg-orange-900/20",
    },
    text: {
      light: "text-orange-600",
      dark: "text-orange-400",
    },
    border: {
      light: "border-orange-300",
      dark: "border-orange-700",
    },
    hover: {
      light: "hover:bg-orange-100 hover:text-orange-700",
      dark: "hover:bg-orange-800/30 hover:text-orange-300",
    },
    active: {
      light: "bg-orange-200 text-orange-800",
      dark: "bg-orange-900/50 text-orange-300",
    },
  },
  red: {
    primary: "red",
    bg: {
      light: "bg-red-50",
      dark: "bg-red-900/20",
    },
    text: {
      light: "text-red-600",
      dark: "text-red-400",
    },
    border: {
      light: "border-red-300",
      dark: "border-red-700",
    },
    hover: {
      light: "hover:bg-red-100 hover:text-red-700",
      dark: "hover:bg-red-800/30 hover:text-red-300",
    },
    active: {
      light: "bg-red-200 text-red-800",
      dark: "bg-red-900/50 text-red-300",
    },
  },
  black: {
    primary: "black",
    bg: {
      light: "bg-gray-100",
      dark: "bg-gray-900",
    },
    text: {
      light: "text-gray-800",
      dark: "text-gray-300",
    },
    border: {
      light: "border-gray-400",
      dark: "border-gray-600",
    },
    hover: {
      light: "hover:bg-gray-200 hover:text-gray-900",
      dark: "hover:bg-gray-800 hover:text-gray-200",
    },
    active: {
      light: "bg-gray-300 text-gray-900",
      dark: "bg-gray-800 text-gray-200",
    },
  },
  white: {
    primary: "white",
    bg: {
      light: "bg-gray-50",
      dark: "bg-gray-800",
    },
    text: {
      light: "text-gray-600",
      dark: "text-gray-300",
    },
    border: {
      light: "border-gray-300",
      dark: "border-gray-700",
    },
    hover: {
      light: "hover:bg-gray-100 hover:text-gray-700",
      dark: "hover:bg-gray-700 hover:text-gray-200",
    },
    active: {
      light: "bg-gray-200 text-gray-800",
      dark: "bg-gray-700 text-gray-200",
    },
  },
}

export function ThemeColorProvider() {
  const { favoriteColor, theme } = useApp()

  useEffect(() => {
    // Obtener las clases de color según la preferencia del usuario
    const colorConfig = colorClasses[favoriteColor] || colorClasses.purple
    const mode = theme === "dark" ? "dark" : "light"

    // Crear una hoja de estilo personalizada
    const styleEl = document.createElement("style")
    styleEl.id = "theme-color-styles"

    // Definir variables CSS personalizadas
    styleEl.textContent = `
      :root {
        --app-primary-color: ${colorConfig.primary};
        --app-bg-color: ${colorConfig.bg[mode].replace("bg-", "")};
        --app-text-color: ${colorConfig.text[mode].replace("text-", "")};
        --app-border-color: ${colorConfig.border[mode].replace("border-", "")};
        --app-hover-bg: ${colorConfig.hover[mode].replace("hover:bg-", "").replace("hover:text-", "")};
        --app-active-bg: ${colorConfig.active[mode].replace("bg-", "").replace("text-", "")};
      }
      
      /* Aplicar estilos a elementos específicos */
      h1, h2, h3 {
        color: var(--app-text-color) !important;
      }
      
      .app-title {
        color: var(--app-text-color) !important;
      }
      
      .app-button {
        background-color: var(--app-bg-color);
        color: var(--app-text-color);
        border-color: var(--app-border-color);
      }
      
      .app-button:hover {
        background-color: var(--app-hover-bg);
      }
      
      .app-nav-active {
        background-color: var(--app-active-bg) !important;
      }
      
      /* Ajustes especiales para color blanco en modo oscuro */
      ${
        favoriteColor === "white" && theme === "dark"
          ? `
        body {
          background-color: #1a1a1a !important;
        }
        .app-text {
          color: #e0e0e0 !important;
        }
      `
          : ""
      }
      
      /* Ajustes especiales para color negro en modo claro */
      ${
        favoriteColor === "black" && theme === "light"
          ? `
        body {
          background-color: #f8f8f8 !important;
        }
        .app-text {
          color: #333333 !important;
        }
      `
          : ""
      }
    `

    // Eliminar estilos anteriores si existen
    const oldStyle = document.getElementById("theme-color-styles")
    if (oldStyle) {
      oldStyle.remove()
    }

    // Añadir la nueva hoja de estilos
    document.head.appendChild(styleEl)

    // Aplicar clases directamente a elementos específicos
    document.querySelectorAll(".app-themed-bg").forEach((el) => {
      // Eliminar clases anteriores
      el.classList.forEach((cls) => {
        if (cls.startsWith("bg-")) {
          el.classList.remove(cls)
        }
      })
      // Añadir nueva clase de fondo
      el.classList.add(colorConfig.bg[mode])
    })

    document.querySelectorAll(".app-themed-text").forEach((el) => {
      // Eliminar clases anteriores
      el.classList.forEach((cls) => {
        if (cls.startsWith("text-")) {
          el.classList.remove(cls)
        }
      })
      // Añadir nueva clase de texto
      el.classList.add(colorConfig.text[mode])
    })

    // Aplicar color al fondo principal si es necesario
    if (favoriteColor === "white" || favoriteColor === "black") {
      document.body.style.backgroundColor =
        favoriteColor === "white"
          ? theme === "dark"
            ? "#1a1a1a"
            : "#ffffff"
          : theme === "dark"
            ? "#121212"
            : "#f8f8f8"
    } else {
      document.body.style.backgroundColor = ""
    }

    return () => {
      if (styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
      }
    }
  }, [favoriteColor, theme])

  return null
}
