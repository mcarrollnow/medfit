"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface PeptideStructure2DEnhancedProps {
  sequence: string
  width?: number
  height?: number
}

export function PeptideStructure2DEnhanced({ sequence, width = 800, height = 300 }: PeptideStructure2DEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !sequence) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set colors based on theme
    const isDark = theme === "dark"
    const bgColor = isDark ? "#0a0a0a" : "#f5f5f5"
    const textColor = isDark ? "#ffffff" : "#000000"
    const bondColor = isDark ? "#888888" : "#333333"
    const carbonColor = isDark ? "#cccccc" : "#333333"
    const nitrogenColor = "#4169E1" // Blue
    const oxygenColor = "#DC143C" // Red
    const hydrogenColor = isDark ? "#aaaaaa" : "#666666"

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Calculate spacing
    const aminoAcids = sequence.split("")
    const spacing = Math.min(80, (width - 100) / Math.max(aminoAcids.length, 1))
    const startX = 50
    const centerY = height / 2

    // Draw peptide backbone
    ctx.strokeStyle = bondColor
    ctx.lineWidth = 2

    aminoAcids.forEach((aa, index) => {
      const x = startX + index * spacing
      const y = centerY

      // Draw backbone bonds
      if (index > 0) {
        // C-N bond
        ctx.beginPath()
        ctx.moveTo(x - spacing + 20, y)
        ctx.lineTo(x - 20, y)
        ctx.stroke()
      }

      // Draw N-terminus for first amino acid
      if (index === 0) {
        ctx.fillStyle = nitrogenColor
        ctx.font = "bold 14px Arial"
        ctx.fillText("H₂N", x - 30, y + 5)
      }

      // Draw backbone atoms
      // Alpha carbon
      ctx.fillStyle = carbonColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Carbonyl group (C=O)
      const carbonylX = x + 20
      const carbonylY = y

      // C atom
      ctx.fillStyle = carbonColor
      ctx.beginPath()
      ctx.arc(carbonylX, carbonylY, 4, 0, Math.PI * 2)
      ctx.fill()

      // Double bond to O
      ctx.strokeStyle = bondColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(carbonylX, carbonylY - 2)
      ctx.lineTo(carbonylX, carbonylY - 20)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(carbonylX + 3, carbonylY - 2)
      ctx.lineTo(carbonylX + 3, carbonylY - 20)
      ctx.stroke()

      // O atom
      ctx.fillStyle = oxygenColor
      ctx.beginPath()
      ctx.arc(carbonylX, carbonylY - 25, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = oxygenColor
      ctx.font = "bold 12px Arial"
      ctx.fillText("O", carbonylX - 5, carbonylY - 30)

      // Draw side chain indicator
      ctx.strokeStyle = bondColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + 25)
      ctx.stroke()

      // Draw amino acid label
      ctx.fillStyle = textColor
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(aa, x, y + 40)

      // Draw N atom for peptide bond (except last)
      if (index < aminoAcids.length - 1) {
        const nextX = x + spacing
        ctx.fillStyle = nitrogenColor
        ctx.beginPath()
        ctx.arc(nextX - 20, y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.font = "bold 12px Arial"
        ctx.fillText("N", nextX - 20, y - 10)
        ctx.fillStyle = hydrogenColor
        ctx.font = "10px Arial"
        ctx.fillText("H", nextX - 20, y + 15)
      }

      // Draw C-terminus for last amino acid
      if (index === aminoAcids.length - 1) {
        ctx.fillStyle = oxygenColor
        ctx.font = "bold 14px Arial"
        ctx.fillText("OH", carbonylX + 20, y + 5)

        // Bond to OH
        ctx.strokeStyle = bondColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(carbonylX + 4, y)
        ctx.lineTo(carbonylX + 15, y)
        ctx.stroke()
      }
    })

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Peptide Structure", width / 2, 25)
  }, [sequence, width, height, theme])

  if (!sequence) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Build a sequence to see the 2D structure
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <canvas ref={canvasRef} width={width} height={height} className="max-w-full h-auto" />
    </div>
  )
}
