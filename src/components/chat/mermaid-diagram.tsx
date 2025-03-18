'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

// Configure mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  darkMode: true,
  fontFamily: 'Inter, sans-serif',
  logLevel: 'error', // Changed from 'fatal' to catch more errors
  flowchart: {
    curve: 'basis',
    padding: 20,
    htmlLabels: true,
    useMaxWidth: false
  },
  themeVariables: {
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif',
    lineWidth: '2px',
    primaryColor: '#3b82f6',
    primaryTextColor: '#e5e7eb',
    primaryBorderColor: '#4b5563',
    lineColor: '#6b7280',
    secondaryColor: '#60a5fa',
    tertiaryColor: '#818cf8',
  }
})

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const renderDiagram = async () => {
      if (!containerRef.current || !mounted) return

      try {
        // Clear previous content and errors
        containerRef.current.innerHTML = ''
        setError(null)
        
        // Validate and clean the chart input
        if (!chart || typeof chart !== 'string') {
          throw new Error('Invalid diagram content')
        }

        // Basic sanitization - ensure valid graph declaration
        let cleanChart = chart.trim()
        
        // Detect diagram type
        const diagramTypes = [
          'graph', 'flowchart', 'sequenceDiagram', 'classDiagram',
          'stateDiagram', 'gantt', 'pie', 'er', 'journey'
        ]
        
        const hasValidType = diagramTypes.some(type => 
          cleanChart.startsWith(type) || cleanChart.includes(`\n${type}`)
        )
        
        // If no valid type is detected, default to flowchart
        if (!hasValidType) {
          cleanChart = `flowchart TD\n${cleanChart}`
        }
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        
        // Create diagram container
        const element = document.createElement('div')
        element.id = id
        element.style.width = '100%'
        element.style.minHeight = '200px'
        containerRef.current.appendChild(element)

        // Try to render with updated mermaid
        const { svg } = await mermaid.render(id, cleanChart)

        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Adjust SVG properties after rendering
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.width = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.minHeight = '300px'
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
          }
        }
      } catch (error) {
        console.error('Failed to render diagram:', error)
        if (mounted) {
          setError('Could not render diagram')
          
          // Create a discreet error message instead of a large visible error
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300">
                <p class="font-medium text-blue-400">Diagram visualization unavailable</p>
                <p class="mt-2">The content could not be rendered as a diagram.</p>
              </div>
            `
          }
        }
      }
    }

    renderDiagram()

    return () => {
      mounted = false
    }
  }, [chart])

  return (
    <div className="my-6 p-4 bg-gray-800/50 rounded-lg shadow-lg">
      <div 
        ref={containerRef}
        className="flex justify-center items-center overflow-x-auto"
        style={{
          minHeight: '200px',
          width: '100%'
        }}
      />
      {error && (
        <div className="hidden">
          {/* This is hidden from the user but helps with debugging */}
          <span className="text-xs text-red-400">{error}</span>
        </div>
      )}
    </div>
  )
}