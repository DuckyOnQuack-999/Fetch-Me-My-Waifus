"use client"

import type React from "react"
import { FluentProvider, createDarkTheme, createLightTheme, type BrandVariants } from "@fluentui/react-components"
import { useEffect, useState, createContext, useContext } from "react"

// Custom waifu-themed brand colors (red/pink palette)
const waifuBrand: BrandVariants = {
  10: "#2D0A0A",
  20: "#4A1212",
  30: "#671A1A",
  40: "#842222",
  50: "#A12A2A",
  60: "#BE3232",
  70: "#DB3A3A",
  80: "#E85555",
  90: "#F07070",
  100: "#F58B8B",
  110: "#FAA6A6",
  120: "#FCC1C1",
  130: "#FDDCDC",
  140: "#FEF0F0",
  150: "#FFF8F8",
  160: "#FFFFFF",
}

const waifuLightTheme = {
  ...createLightTheme(waifuBrand),
}

const waifuDarkTheme = {
  ...createDarkTheme(waifuBrand),
  colorNeutralBackground1: "#0a0a0a",
  colorNeutralBackground2: "#141414",
  colorNeutralBackground3: "#1a1a1a",
  colorNeutralBackground4: "#1f1f1f",
  colorNeutralBackground5: "#252525",
  colorNeutralBackground6: "#2a2a2a",
  colorBrandBackground: "#DC2626",
  colorBrandBackgroundHover: "#EF4444",
  colorBrandBackgroundPressed: "#B91C1C",
}

// Theme context for toggling
interface ThemeContextType {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
})

export const useFluentTheme = () => useContext(ThemeContext)

export function FluentThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for system preference or stored preference
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "light" || stored === "dark") {
        setTheme(stored)
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light")
      }
    } catch (e) {
      // localStorage not available
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark")
      try {
        localStorage.setItem("theme", theme)
      } catch (e) {
        // localStorage not available
      }
    }
  }, [theme, mounted])

  const currentTheme = theme === "dark" ? waifuDarkTheme : waifuLightTheme

  return (
    <FluentProvider theme={currentTheme} className="min-h-screen">
      <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
    </FluentProvider>
  )
}
