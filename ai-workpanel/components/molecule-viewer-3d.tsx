"use client"

import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useTheme } from "./theme-provider"
import { FullscreenViewer } from "./fullscreen-viewer"

type Atom = {
  element: string
  position: [number, number, number]
  color: string
  radius: number
}

type Bond = {
  start: [number, number, number]
  end: [number, number, number]
}

type MoleculeViewerProps = {
  peptideSequence?: string
}

// Atom colors based on CPK coloring convention
const ATOM_COLORS: Record<string, string> = {
  C: "#909090", // Carbon - gray
  N: "#3050F8", // Nitrogen - blue
  O: "#FF0D0D", // Oxygen - red
  H: "#FFFFFF", // Hydrogen - white
  S: "#FFFF30", // Sulfur - yellow
  P: "#FF8000", // Phosphorus - orange
}

const ATOM_RADII: Record<string, number> = {
  C: 0.3,
  N: 0.3,
  O: 0.28,
  H: 0.2,
  S: 0.35,
  P: 0.35,
}

function Atom3D({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

function Bond3D({
  start,
  end,
  isDark,
}: { start: [number, number, number]; end: [number, number, number]; isDark: boolean }) {
  const bondData = React.useMemo(() => {
    // Calculate direction vector
    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const dz = end[2] - start[2]

    // Calculate length
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Calculate midpoint
    const midpoint: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ]

    // Calculate rotation to align cylinder with bond direction
    // We need to rotate from default Y-axis orientation to the bond direction
    const dirLength = Math.sqrt(dx * dx + dz * dz)
    const rotationX = Math.atan2(dirLength, dy)
    const rotationY = Math.atan2(dx, dz)

    return { midpoint, length, rotationX, rotationY }
  }, [start, end])

  const bondColor = isDark ? "#888888" : "#666666"

  return (
    <mesh position={bondData.midpoint} rotation={[bondData.rotationX, bondData.rotationY, 0]}>
      <cylinderGeometry args={[0.08, 0.08, bondData.length, 8]} />
      <meshStandardMaterial color={bondColor} metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function generatePeptideStructure(sequence: string): { atoms: Atom[]; bonds: Bond[] } {
  const atoms: Atom[] = []
  const bonds: Bond[] = []

  // Generate a simplified 3D structure for the peptide
  // In reality, this would use proper molecular modeling
  const aminoAcidSpacing = 3.8 // Approximate distance between alpha carbons

  for (let i = 0; i < sequence.length; i++) {
    const x = i * aminoAcidSpacing
    const y = Math.sin(i * 0.5) * 2 // Add some helical structure
    const z = Math.cos(i * 0.5) * 2

    // Backbone atoms (simplified)
    // Alpha carbon
    atoms.push({
      element: "C",
      position: [x, y, z],
      color: ATOM_COLORS.C,
      radius: ATOM_RADII.C,
    })

    // Carbonyl carbon
    atoms.push({
      element: "C",
      position: [x + 0.8, y - 0.5, z],
      color: ATOM_COLORS.C,
      radius: ATOM_RADII.C,
    })

    // Carbonyl oxygen
    atoms.push({
      element: "O",
      position: [x + 1.2, y - 1.2, z],
      color: ATOM_COLORS.O,
      radius: ATOM_RADII.O,
    })

    // Nitrogen (next residue)
    if (i < sequence.length - 1) {
      atoms.push({
        element: "N",
        position: [x + 2, y, z],
        color: ATOM_COLORS.N,
        radius: ATOM_RADII.N,
      })

      // Bonds
      bonds.push({
        start: [x, y, z],
        end: [x + 0.8, y - 0.5, z],
      })
      bonds.push({
        start: [x + 0.8, y - 0.5, z],
        end: [x + 1.2, y - 1.2, z],
      })
      bonds.push({
        start: [x + 0.8, y - 0.5, z],
        end: [x + 2, y, z],
      })
      bonds.push({
        start: [x + 2, y, z],
        end: [x + aminoAcidSpacing, y + Math.sin((i + 1) * 0.5) * 2, z + Math.cos((i + 1) * 0.5) * 2],
      })
    }
  }

  return { atoms, bonds }
}

function MoleculeScene({
  peptideSequence = "ACDEFGHIKLMNPQRSTVWY",
  isDark,
}: MoleculeViewerProps & { isDark: boolean }) {
  const { atoms, bonds } = React.useMemo(() => generatePeptideStructure(peptideSequence), [peptideSequence])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {atoms.map((atom, index) => (
        <Atom3D key={`atom-${index}`} position={atom.position} color={atom.color} radius={atom.radius} />
      ))}

      {bonds.map((bond, index) => (
        <Bond3D key={`bond-${index}`} start={bond.start} end={bond.end} isDark={isDark} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        autoRotate={false}
      />
      <Environment preset="studio" />
    </>
  )
}

export function MoleculeViewer3D({ peptideSequence }: MoleculeViewerProps) {
  const { theme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("dark")

  React.useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme as "light" | "dark")
    }
  }, [theme])

  const isDark = resolvedTheme === "dark"
  const backgroundColor = isDark ? "#0a0a0a" : "#f5f5f5"

  const handleExport = () => {
    console.log("[v0] Export 3D structure")
    // TODO: Implement export functionality
  }

  const handleSendToChat = () => {
    console.log("[v0] Send to chat")
    // TODO: Implement send to chat
  }

  const handleAnalyze = () => {
    console.log("[v0] Analyze structure")
    // TODO: Implement analyze
  }

  return (
    <FullscreenViewer
      title="3D Molecule Viewer"
      onExport={handleExport}
      onSendToChat={handleSendToChat}
      onAnalyze={handleAnalyze}
    >
      <div className="size-full bg-background">
        <Canvas camera={{ position: [20, 10, 20], fov: 50 }} style={{ background: backgroundColor }}>
          <MoleculeScene peptideSequence={peptideSequence} isDark={isDark} />
        </Canvas>
      </div>
    </FullscreenViewer>
  )
}
