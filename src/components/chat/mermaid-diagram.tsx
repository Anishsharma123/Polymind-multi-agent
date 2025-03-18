'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react'
import { Button } from '../ui/button'

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
  const [mermaid, setMermaid] = useState<any>(null)
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [expanded, setExpanded] = useState(false)

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
        // Make sure the diagram text is properly formatted
        // Remove any title that might be on the first line
        let diagramText = chart;
        
        // If the first line doesn't contain a diagram type declaration,
        // assume it's a title and remove it
        const firstLine = diagramText.split('\n')[0].trim();
        if (!firstLine.includes('graph') && 
            !firstLine.includes('flowchart') && 
            !firstLine.includes('sequenceDiagram') && 
            !firstLine.includes('classDiagram') && 
            !firstLine.includes('stateDiagram') && 
            !firstLine.includes('gantt') && 
            !firstLine.includes('pie') && 
            !firstLine.includes('erDiagram')) {
          diagramText = diagramText.split('\n').slice(1).join('\n');
        }

        // Clean the diagram text
        diagramText = diagramText.trim();
        
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
            mermaid.render(id, diagramText),
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
                <pre class="text-xs overflow-auto p-2 bg-gray-900">${diagramText}</pre>`
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

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  return (
    <div className="relative w-full my-4">
      <div 
        className={`overflow-auto border rounded-md p-4 bg-white dark:bg-gray-950 transition-all duration-300 ${
          expanded ? 'max-h-[80vh]' : 'max-h-[50vh]'
        }`}
      >
        <div 
          ref={containerRef}
          className="flex justify-center transition-transform duration-200"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
        />
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" 
          onClick={zoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" 
          onClick={zoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" 
          onClick={toggleExpand}
          title={expanded ? "Minimize" : "Maximize"}
        >
          {expanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}