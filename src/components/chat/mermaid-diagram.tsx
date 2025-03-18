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
  logLevel: 'fatal', // Suppress console errors completely
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
  const [renderAttempted, setRenderAttempted] = useState(false)

  useEffect(() => {
    let mounted = true

    const sanitizeMermaidCode = (code: string): string => {
      // Remove triple backticks and mermaid keyword if present
      let cleanCode = code.replace(/```mermaid\n/g, '').replace(/```/g, '').trim()
      
      // Ensure the diagram has a valid type declaration
      const diagramTypes = [
        'graph', 'flowchart', 'sequenceDiagram', 'classDiagram',
        'stateDiagram', 'gantt', 'pie', 'er', 'journey'
      ]
      
      const hasValidType = diagramTypes.some(type => 
        cleanCode.startsWith(type) || cleanCode.includes(`\n${type}`)
      )
      
      if (!hasValidType) {
        cleanCode = `flowchart TD\n${cleanCode}`
      }
      
      // Fix common syntax issues
      return cleanCode
        // Ensure each line of the flowchart is properly separated
        .split('\n')
        .map(line => {
          // Fix long node texts that might cause issues
          if (line.includes('[') && line.includes(']')) {
            // Match node texts and limit their length
            return line.replace(/\[(.*?)\]/g, (match, p1) => {
              const cleanText = p1.replace(/[^\w\s-]/g, ' ').trim()
              const shortenedText = cleanText.length > 30 ? 
                `${cleanText.substring(0, 27)}...` : cleanText
              return `[${shortenedText}]`
            })
          }
          return line
        })
        .join('\n')
    }

    const renderDiagram = async () => {
      if (!containerRef.current || !mounted) return
      
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      try {
        // Don't attempt to render if no chart or empty chart
        if (!chart || typeof chart !== 'string' || chart.trim() === '') {
          throw new Error('No diagram content')
        }

        // Sanitize and fix the chart
        const cleanChart = sanitizeMermaidCode(chart)
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        
        // Create diagram container
        const element = document.createElement('div')
        element.id = id
        element.style.width = '100%'
        element.style.minHeight = '200px'
        containerRef.current.appendChild(element)
        
        // Prevent uncaught errors from crashing the app
        const originalConsoleError = console.error
        console.error = (...args) => {
          // Suppress mermaid errors from console
          if (args[0] && typeof args[0] === 'string' && args[0].includes('mermaid')) {
            return
          }
          originalConsoleError(...args)
        }

        try {
          // Try to render with mermaid
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
        } catch (renderError) {
          throw new Error('Failed to render diagram')
        } finally {
          // Restore console.error
          console.error = originalConsoleError
        }
      } catch (error) {
        // Handle errors silently
        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="bg-gray-800 border-l-4 border-blue-500 p-4 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-300">
                    The diagram couldn't be displayed. A text description has been provided instead.
                  </p>
                </div>
              </div>
            </div>
          `
        }
      } finally {
        setRenderAttempted(true)
      }
    }

    renderDiagram()

    return () => {
      mounted = false
    }
  }, [chart])

  // Only show loading state before first render attempt
  if (!renderAttempted && chart) {
    return (
      <div className="my-6 p-4 bg-gray-800/50 rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse text-gray-400">Loading diagram...</div>
        </div>
      </div>
    )
  }

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
    </div>
  )
}