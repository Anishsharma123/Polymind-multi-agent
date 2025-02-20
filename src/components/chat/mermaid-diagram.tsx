'use client'

import { useEffect, useRef } from 'react'
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
  flowchart: {
    curve: 'basis',
    padding: 20,
    htmlLabels: true,
    useMaxWidth: false,
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

  useEffect(() => {
    let mounted = true

    const renderDiagram = async () => {
      if (!containerRef.current || !mounted) return

      try {
        // Clear previous content
        containerRef.current.innerHTML = ''

        // Generate unique ID
        const id = `mermaid-${Date.now()}`

        // Create diagram container
        const element = document.createElement('div')
        element.id = id
        element.style.width = '100%'
        element.style.minHeight = '200px'
        containerRef.current.appendChild(element)

        // Generate SVG
        const { svg } = await mermaid.render(id, chart)

        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Adjust SVG properties after rendering
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.width = '100%'
            svgElement.style.height = 'auto'
            svgElement.style.minHeight = '300px'
            // Make the diagram fill the container while maintaining aspect ratio
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
          }
        }
      } catch (error) {
        console.error('Failed to render diagram:', error)
        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="text-red-500 p-4 border border-red-500 rounded-lg">
              <p class="font-semibold">Failed to render diagram</p>
              <p class="text-sm mt-2">Error: ${error?.toString() || 'Unknown error'}</p>
              <pre class="text-xs mt-2 bg-gray-900 p-2 rounded overflow-x-auto">${chart}</pre>
            </div>
          `
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
          minHeight: '300px',
          width: '100%'
        }}
      />
    </div>
  )
} 