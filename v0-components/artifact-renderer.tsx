"use client"

import { Download, Code2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Type definitions
export type ChartArtifact = {
  type: "chart"
  chartType: "bar" | "line" | "pie" | "area"
  title: string
  data: any[]
  dataKeys: string[]
}

export type SpreadsheetArtifact = {
  type: "spreadsheet"
  title: string
  headers: string[]
  rows: string[][]
}

export type CodeArtifact = {
  type: "code"
  language: string
  description: string
  code: string
  result?: string
}

export type Artifact = ChartArtifact | SpreadsheetArtifact | CodeArtifact

interface ArtifactRendererProps {
  artifact: Artifact
}

const CHART_COLORS = ["#a855f7", "#22c55e", "#f97316", "#ef4444", "#3b82f6", "#ec4899"]

export default function ArtifactRenderer({ artifact }: ArtifactRendererProps) {
  // Chart Artifact Renderer
  if (artifact.type === "chart") {
    return (
      <div className="p-6 rounded-lg border border-border bg-card">
        <h3 className="text-lg font-semibold mb-4">{artifact.title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          {artifact.chartType === "bar" && (
            <BarChart data={artifact.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={artifact.dataKeys[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {artifact.dataKeys.slice(1).map((key, index) => (
                <Bar key={key} dataKey={key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </BarChart>
          )}
          {artifact.chartType === "line" && (
            <LineChart data={artifact.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={artifact.dataKeys[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {artifact.dataKeys.slice(1).map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          )}
          {artifact.chartType === "pie" && (
            <PieChart>
              <Pie
                data={artifact.data}
                dataKey={artifact.dataKeys[1]}
                nameKey={artifact.dataKeys[0]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {artifact.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
          {artifact.chartType === "area" && (
            <AreaChart data={artifact.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={artifact.dataKeys[0]} />
              <YAxis />
              <Tooltip />
              <Legend />
              {artifact.dataKeys.slice(1).map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    )
  }

  // Spreadsheet Artifact Renderer
  if (artifact.type === "spreadsheet") {
    const downloadCSV = () => {
      const csvContent = [artifact.headers.join(","), ...artifact.rows.map((row) => row.join(","))].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${artifact.title.replace(/\s+/g, "_")}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">{artifact.title}</h3>
          <button
            onClick={downloadCSV}
            className="px-3 py-1.5 text-sm bg-accent-yellow text-background rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {artifact.headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-sm font-semibold text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifact.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Code Artifact Renderer
  if (artifact.type === "code") {
    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            <span className="text-lg">{artifact.description}</span>
          </div>
          <span className="px-3 py-1 text-xs rounded-full bg-muted text-foreground">{artifact.language}</span>
        </div>
        <div className="p-4">
          <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
            <code className="text-sm font-mono">{artifact.code}</code>
          </pre>
        </div>
        {artifact.result && (
          <div className="p-4">
            <div className="p-4 rounded-lg border border-border bg-muted">
              <div className="text-sm font-semibold mb-2">Result:</div>
              <pre className="text-sm font-mono whitespace-pre-wrap">{artifact.result}</pre>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}
