"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export function Celebration() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Create confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ["#FFFFFF", "#CCCCCC", "#888888", "#444444"], // Only white and gray colors
    }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative text-center">
        <div className="glitch-wrapper">
          <h2 className="text-4xl font-bold text-white font-mono tracking-widest glitch" data-text="STAGE COMPLETE">
            STAGE COMPLETE
          </h2>
        </div>
        <p className="text-xl text-white mt-2 font-mono tracking-wider">SYSTEM UPGRADE ACHIEVED</p>
        <div className="mt-4 px-4 py-1 border border-white border-opacity-30 inline-block">
          <span className="text-sm font-mono tracking-wider">DIFFICULTY INCREASED</span>
        </div>
      </div>
    </div>
  )
}
