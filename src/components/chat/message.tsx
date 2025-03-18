import { cn } from "@/lib/utils"
import { Feedback } from "./feedback"
import { useMemo } from 'react'
import { Artifacts, extractContentArtifacts } from './artifacts'
import { motion } from 'framer-motion'
import { AnimatedText } from './animated-text'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "px-4 py-8 w-full flex border-b",
        role === "user" ? "bg-gray-900" : "bg-black"
      )}
    >
      <div className="container max-w-5xl flex gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            role === "user" ? "bg-blue-900 text-blue-200" : "bg-purple-900 text-purple-200"
          )}
        >
          {role === "user" ? "U" : "A"}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none">
            {isLoading ? (
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-500 rounded-full"
                />
              </div>
            ) : (
              <>
                {remainingText && (
                  <AnimatedText
                    text={remainingText}
                    className="text-gray-200 whitespace-pre-wrap"
                  />
                )}
                {artifacts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Artifacts artifacts={artifacts} />
                  </motion.div>
                )}
              </>
            )}
          </div>
          {!isLoading && role === "assistant" && id && onFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Feedback messageId={id} onFeedback={onFeedback} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 