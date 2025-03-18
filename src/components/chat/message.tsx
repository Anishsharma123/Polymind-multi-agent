import { cn } from "@/lib/utils"
import { Feedback } from "./feedback"
import { useMemo } from 'react'
import { Artifacts, extractContentArtifacts } from './artifacts'

interface MessageProps {
  id?: string
  content: string
  role: "user" | "assistant"
  isLoading?: boolean
  onFeedback?: (messageId: string, isPositive: boolean, comment?: string) => void
}

export function Message({ id, content, role, isLoading, onFeedback }: MessageProps) {
  // Extract all content artifacts and remaining text
  const { artifacts, remainingText } = useMemo(() => 
    extractContentArtifacts(content), [content]);
  
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
                {remainingText && (
                  <p className="text-gray-200 whitespace-pre-wrap">{remainingText}</p>
                )}
                <Artifacts artifacts={artifacts} />
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