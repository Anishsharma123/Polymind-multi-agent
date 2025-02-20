import { NextResponse } from "next/server"
import { runAgent } from "@/lib/agents/agent"
import { Message } from "@/store/chat"

export async function POST(req: Request) {
  try {
    const { messages, agentType } = await req.json()
    
    // Format chat history
    const chatHistory = messages
      .slice(0, -1) // Exclude the latest message
      .map((msg: Message) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')

    // Get the latest user message
    const userInput = messages[messages.length - 1].content

    const result = await runAgent({
      agentType,
      userInput,
      chatHistory
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