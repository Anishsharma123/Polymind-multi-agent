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
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let mermaidInstance: any = null

    const loadMermaid = async () => {
      try {
        // Dynamically import mermaid for better performance
        const mermaid = (await import('mermaid')).default
        
        // Initialize mermaid with better defaults for performance
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'dark',
          logLevel: 3, // Error level only
          fontFamily: 'monospace',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
        })
        
        mermaidInstance = mermaid
        if (mounted) {
          setIsLoading(false)
          renderDiagram(mermaid)
        }
      } catch (err) {
        console.error("Failed to load Mermaid:", err)
        if (mounted) {
          setError("Failed to load diagram renderer")
          setIsLoading(false)
        }
      }
    }

    const renderDiagram = async (mermaid: any) => {
      if (!containerRef.current || !mounted) return
      
      // Clear previous content
      containerRef.current.innerHTML = ''
      
      try {
        // Don't attempt to render if no chart or empty chart
        if (!chart || typeof chart !== 'string' || chart.trim() === '') {
          throw new Error('No diagram content')
        }

        // Sanitize and fix the chart
        const cleanChart = chart.trim()
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        
        // Create diagram container
        const element = document.createElement('div')
        element.id = id
        element.style.width = '100%'
        element.style.minHeight = '200px'
        containerRef.current.appendChild(element)
        
        try {
          // Render the diagram with timeout to prevent hanging
          const { svg } = await Promise.race([
            mermaid.render(id, cleanChart),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Diagram rendering timed out')), 5000)
            )
          ])
          
          if (mounted && containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        } catch (renderError) {
          console.error("Mermaid rendering error:", renderError)
          if (mounted) {
            setError("Failed to render diagram. Check syntax.")
            
            // Display the raw diagram code for debugging
            if (containerRef.current) {
              const errorEl = document.createElement('div')
              errorEl.className = 'p-4 bg-red-900/20 border border-red-500 rounded-md mt-2'
              errorEl.innerHTML = `<p class="text-red-400 mb-2">⚠️ Diagram rendering error</p>
                <pre class="text-xs overflow-auto p-2 bg-gray-900">${cleanChart}</pre>`
              containerRef.current.appendChild(errorEl)
            }
          }
        }
      } catch (err) {
        console.error("Diagram processing error:", err)
        if (mounted && containerRef.current) {
          setError("Invalid diagram content")
        }
      }
    }

    loadMermaid()

    return () => {
      mounted = false
    }
  }, [chart])

  return (
    <div className="w-full overflow-x-auto">
      {isLoading && (
        <div className="flex items-center justify-center h-40 bg-gray-900/30 rounded-md">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      {error && !isLoading && (
        <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      <div ref={containerRef} className="mermaid-diagram"></div>
    </div>
  )
}