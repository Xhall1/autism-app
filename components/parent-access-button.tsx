"use client"

import { Shield, Lock } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useParent } from "@/lib/parent-context"
import Link from "next/link"

export function ParentAccessButton() {
  const { theme } = useApp()
  const { isParentMode, setIsParentMode } = useParent()

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <Link href="/padres">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
            isParentMode
              ? "bg-orange-500 text-white"
              : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {isParentMode ? <Shield className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          <span className="text-sm font-medium">{isParentMode ? "Modo Padres" : "Acceso Padres"}</span>
        </button>
      </Link>
    </div>
  )
}
