"use client"

import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label: string
  presets?: { name: string; color: string }[]
}

const DEFAULT_PRESETS = [
  { name: "Yellow", color: "#fff95e" },
  { name: "Purple", color: "#631fe1" },
  { name: "Red", color: "#ef4444" },
  { name: "Pink", color: "#ec4899" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#47ff7b" },
  { name: "Orange", color: "#f97316" },
  { name: "Gray", color: "#6b7280" },
]

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  const r = Number.parseInt(result[1], 16) / 255
  const g = Number.parseInt(result[2], 16) / 255
  const b = Number.parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function ColorPicker({ value, onChange, label, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value)
  const [hsl, setHsl] = useState(hexToHSL(value))
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHexInput(value)
    setHsl(hexToHSL(value))
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleHSLChange = (type: "h" | "s" | "l", value: number) => {
    const newHsl = { ...hsl, [type]: value }
    setHsl(newHsl)
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
    setHexInput(newHex)
    onChange(newHex)
  }

  const handleHexChange = (hex: string) => {
    setHexInput(hex)
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setHsl(hexToHSL(hex))
      onChange(hex)
    }
  }

  const handlePresetClick = (color: string) => {
    setHexInput(color)
    setHsl(hexToHSL(color))
    onChange(color)
  }

  return (
    <div className="relative">
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border-2 rounded-lg flex items-center gap-3 hover:border-accent-yellow transition-colors bg-background"
      >
        <div className="w-10 h-10 rounded border-2 flex-shrink-0" style={{ backgroundColor: value }} />
        <div className="flex-1 text-left">
          <div className="font-mono text-sm">{value.toUpperCase()}</div>
          <div className="text-xs text-muted-foreground">Click to edit</div>
        </div>
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          className="absolute top-full left-0 mt-2 w-80 p-4 rounded-xl border-2 shadow-2xl z-50 bg-background"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Choose Color</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-muted rounded p-1 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color Preview */}
          <div className="w-full h-20 rounded-lg border-2 mb-4" style={{ backgroundColor: value }} />

          {/* Preset Swatches */}
          <div className="mb-4">
            <div className="text-xs font-semibold mb-2">Presets</div>
            <div className="grid grid-cols-8 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(preset.color)}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-3 mb-4">
            {/* Hue */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Hue</span>
                <span>{hsl.h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={(e) => handleHSLChange("h", Number.parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                }}
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Saturation</span>
                <span>{hsl.s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={(e) => handleHSLChange("s", Number.parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
                }}
              />
            </div>

            {/* Lightness */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Lightness</span>
                <span>{hsl.l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={(e) => handleHSLChange("l", Number.parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
                }}
              />
            </div>
          </div>

          {/* Hex Input */}
          <div>
            <Label className="text-xs mb-1 block">Hex Code</Label>
            <Input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
              maxLength={7}
              className="w-full px-3 py-2 rounded-lg border font-mono text-sm uppercase"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  )
}
