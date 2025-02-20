'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface FeedbackProps {
  messageId: string
  onFeedback: (messageId: string, isPositive: boolean, comment?: string) => void
}

export function Feedback({ messageId, onFeedback }: FeedbackProps) {
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = (isPositive: boolean) => {
    if (submitted) return
    
    if (!isPositive) {
      setShowComment(true)
    } else {
      onFeedback(messageId, true)
      setSubmitted(true)
    }
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      onFeedback(messageId, false, comment)
      setSubmitted(true)
      setShowComment(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-sm text-gray-400 mt-2">
        Thank you for your feedback!
      </div>
    )
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFeedback(true)}
          className="p-1 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200"
          title="Helpful"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="p-1 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-200"
          title="Not helpful"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>

      {showComment && (
        <div className="mt-2 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could be improved?"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowComment(false)}
              className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={!comment.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 