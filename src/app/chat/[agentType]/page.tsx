'use client'

import { useState } from 'react'
import { useParams } from "next/navigation"
import { Message } from '@/components/chat/message'
import { useChat } from "@/lib/hooks/use-chat"
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

export default function ChatPage() {
  const { agentType } = useParams()
  const { messages, addMessage, isLoading, setLoading, clearMessages } = useChat(agentType as string)
  const [input, setInput] = useState('')
  
  const agentNames = {
    cultural: "Cultural Agent",
    build: "Build It Agent",
    missing: "What's Missing Agent"
  }

  const agentName = agentNames[agentType as keyof typeof agentNames] || "Unknown Agent"

  const handleFeedback = async (messageId: string, isPositive: boolean, comment?: string) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          isPositive,
          comment,
          agentType: agentType,
        }),
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    addMessage({ role: 'user', content: input })
    setInput('')
    
    // Set loading state
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
          agentType: agentType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      addMessage({
        role: 'assistant',
        content: data.response,
      })
    } catch (error) {
      console.error('Error:', error)
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div key={String(agentType)} className="flex flex-col h-screen bg-black text-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-semibold text-white">{agentName}</h1>
          {agentType === 'cultural' && (
            <p className="text-sm text-gray-400 mt-1">
              Specialized in cultural analysis with diverse source integration and visualization capabilities
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearMessages}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <Message
            role="assistant"
            content={`Hello! I'm your ${agentName}. ${
              agentType === 'cultural' 
                ? "I can help you understand cultural phenomena, traditions, and societal changes. I can also create visualizations and provide context from diverse sources."
                : "How can I assist you today?"
            }`}
          />
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              onFeedback={handleFeedback}
            />
          ))
        )}
        {isLoading && (
          <Message
            role="assistant"
            content=""
            isLoading={true}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4">
        <div className="container max-w-4xl flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              agentType === 'cultural'
                ? "Ask about cultural trends, traditions, or request a visualization..."
                : "Type your message..."
            }
            className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}