import { NextResponse } from "next/server"
import { runAgent } from "@/lib/agents/agent"
import { Message } from "@/store/chat"

export const maxDuration = 120; // Extend timeout for Vercel

export async function POST(req: Request) {
  try {
    const { messages, agentType } = await req.json()
    
    // Format chat history - only use the last 10 messages for performance
    const recentMessages = messages.slice(-10);
    const chatHistory = recentMessages
      .slice(0, -1) // Exclude the latest message
      .map((msg: Message) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    // Get the latest user message
    const userInput = recentMessages[recentMessages.length - 1].content

    const result = await runAgent({
      agentType,
      userInput,
      chatHistory,
      enableArtifacts: true, // Explicitly request artifact generation
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ response: result.response })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
} 