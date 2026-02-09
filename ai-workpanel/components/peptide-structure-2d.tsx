"use client"

import * as React from "react"
import { useTheme } from "next-themes"

type PeptideStructure2DProps = {
  sequence: string
}

export function PeptideStructure2D({ sequence }: PeptideStructure2DProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate peptide backbone structure
  const atoms = React.useMemo(() => {
    const result: Array<{ x: number; y: number; type: string; label: string }> = []
    const spacing = 80
    const startX = 50
    const startY = 150

    for (let i = 0; i < sequence.length; i++) {
      const baseX = startX + i * spacing

      // N-terminus (first residue)
      if (i === 0) {
        result.push({ x: baseX - 30, y: startY, type: "N", label: "H₂N" })
      }

      // Alpha carbon (Cα)
      result.push({ x: baseX, y: startY, type: "C", label: "Cα" })

      // Carbonyl carbon (C=O)
      result.push({ x: baseX + 20, y: startY - 25, type: "C", label: "C" })
      result.push({ x: baseX + 20, y: startY - 45, type: "O", label: "O" })

      // Nitrogen for next residue
      if (i < sequence.length - 1) {
        result.push({ x: baseX + 40, y: startY, type: "N", label: "N" })
      }

      // C-terminus (last residue)
      if (i === sequence.length - 1) {
        result.push({ x: baseX + 40, y: startY, type: "O", label: "OH" })
      }

      // Side chain indicator
      result.push({ x: baseX, y: startY + 30, type: "R", label: sequence[i] })
    }

    return result
  }, [sequence])

  const bonds = React.useMemo(() => {
    const result: Array<{ x1: number; y1: number; x2: number; y2: number; type: "single" | "double" }> = []
    const spacing = 80
    const startX = 50
    const startY = 150

    for (let i = 0; i < sequence.length; i++) {
      const baseX = startX + i * spacing

      // N-terminus to Cα (first residue)
      if (i === 0) {
        result.push({ x1: baseX - 30, y1: startY, x2: baseX, y2: startY, type: "single" })
      }

      // Cα to C
      result.push({ x1: baseX, y1: startY, x2: baseX + 20, y2: startY - 25, type: "single" })

      // C=O double bond
      result.push({ x1: baseX + 20, y1: startY - 25, x2: baseX + 20, y2: startY - 45, type: "double" })

      // C to N (peptide bond)
      if (i < sequence.length - 1) {
        result.push({ x1: baseX + 20, y1: startY - 25, x2: baseX + 40, y2: startY, type: "single" })
        // N to next Cα
        result.push({ x1: baseX + 40, y1: startY, x2: baseX + spacing, y2: startY, type: "single" })
      } else {
        // C-terminus
        result.push({ x1: baseX + 20, y1: startY - 25, x2: baseX + 40, y2: startY, type: "single" })
      }

      // Cα to side chain
      result.push({ x1: baseX, y1: startY, x2: baseX, y2: startY + 30, type: "single" })
    }

    return result
  }, [sequence])

  const viewBoxWidth = Math.max(600, sequence.length * 80 + 100)
  const strokeColor = isDark ? "#e5e5e5" : "#262626"
  const textColor = isDark ? "#fafafa" : "#0a0a0a"

  return (
    <div className="size-full overflow-auto bg-background p-4">
      <svg viewBox={`0 0 ${viewBoxWidth} 250`} className="w-full" style={{ minWidth: "600px" }}>
        {/* Draw bonds first (behind atoms) */}
        {bonds.map((bond, i) => (
          <g key={`bond-${i}`}>
            {bond.type === "double" ? (
              <>
                <line
                  x1={bond.x1 - 3}
                  y1={bond.y1}
                  x2={bond.x2 - 3}
                  y2={bond.y2}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
                <line
                  x1={bond.x1 + 3}
                  y1={bond.y1}
                  x2={bond.x2 + 3}
                  y2={bond.y2}
                  stroke={strokeColor}
                  strokeWidth="2"
                />
              </>
            ) : (
              <line x1={bond.x1} y1={bond.y1} x2={bond.x2} y2={bond.y2} stroke={strokeColor} strokeWidth="2" />
            )}
          </g>
        ))}

        {/* Draw atoms */}
        {atoms.map((atom, i) => {
          let atomColor = strokeColor
          if (atom.type === "N") atomColor = "#3b82f6" // blue
          if (atom.type === "O") atomColor = "#ef4444" // red
          if (atom.type === "R") atomColor = "#8b5cf6" // purple for side chains

          return (
            <g key={`atom-${i}`}>
              {atom.type !== "R" && <circle cx={atom.x} cy={atom.y} r="4" fill={atomColor} />}
              <text
                x={atom.x}
                y={atom.y + (atom.type === "R" ? 5 : -10)}
                textAnchor="middle"
                fill={atom.type === "R" ? atomColor : textColor}
                fontSize={atom.type === "R" ? "14" : "11"}
                fontWeight={atom.type === "R" ? "bold" : "normal"}
                fontFamily="monospace"
              >
                {atom.label}
              </text>
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(20, 220)">
          <text x="0" y="0" fill={textColor} fontSize="10" fontWeight="bold">
            Peptide Backbone Structure
          </text>
          <text x="0" y="15" fill={textColor} fontSize="9">
            Blue: Nitrogen | Red: Oxygen | Purple: Side Chains (R)
          </text>
        </g>
      </svg>
    </div>
  )
}
