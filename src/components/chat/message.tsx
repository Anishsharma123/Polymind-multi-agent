import { cn } from "@/lib/utils"
import { Feedback } from "./feedback"
import { MermaidDiagram } from "./mermaid-diagram"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageProps {
  id?: string
  content: string
  role: "user" | "assistant"
  isLoading?: boolean
  onFeedback?: (messageId: string, isPositive: boolean, comment?: string) => void
}

// Function to extract Mermaid diagrams from text
function extractMermaidDiagrams(text: string): { diagrams: string[], remainingText: string } {
  const mermaidPattern = /```mermaid\n([\s\S]*?)```/g
  const diagrams: string[] = []
  const remainingText = text.replace(mermaidPattern, (match, diagram) => {
    diagrams.push(diagram.trim())
    return ''
  }).trim()
  
  return { diagrams, remainingText }
}

// Function to process code blocks
function processCodeBlocks(text: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const segments: Array<{ type: 'text' | 'code', content: string, language?: string }> = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      })
    }

    // Add code block
    segments.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex)
    })
  }

  return segments
}

export function Message({ id, content, role, isLoading, onFeedback }: MessageProps) {
  const { diagrams, remainingText } = extractMermaidDiagrams(content)
  const segments = processCodeBlocks(remainingText)

  return (
    <div className={cn(
      "px-4 py-8 w-full flex border-b",
      role === "user" ? "bg-gray-900" : "bg-black"
    )}>
      <div className="container max-w-5xl flex gap-4">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          role === "user" ? "bg-blue-900 text-blue-200" : "bg-purple-900 text-purple-200"
        )}>
          {role === "user" ? "U" : "A"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none">
            {isLoading ? (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              <>
                {segments.map((segment, index) => (
                  segment.type === 'code' ? (
                    <div key={index} className="my-4 rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language={segment.language}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          background: '#1a1a1a'
                        }}
                      >
                        {segment.content}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <p key={index} className="text-gray-200 whitespace-pre-wrap">{segment.content}</p>
                  )
                ))}
                {diagrams.length > 0 && (
                  <div className="my-6 space-y-6">
                    {diagrams.map((diagram, index) => (
                      <MermaidDiagram key={index} chart={diagram} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {!isLoading && role === "assistant" && id && onFeedback && (
            <Feedback messageId={id} onFeedback={onFeedback} />
          )}
        </div>
      </div>
    </div>
  )
} 