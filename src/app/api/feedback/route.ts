import { NextResponse } from "next/server"

// In a real application, you would store this in a database
const feedbackStore: {
  [messageId: string]: {
    isPositive: boolean
    comment?: string
    agentType: string
    timestamp: number
  }
} = {}

export async function POST(req: Request) {
  try {
    const { messageId, isPositive, comment, agentType } = await req.json()

    // Store feedback
    feedbackStore[messageId] = {
      isPositive,
      comment,
      agentType,
      timestamp: Date.now()
    }

    // In a real application, you would:
    // 1. Store feedback in a database
    // 2. Use it to improve the model
    // 3. Track user satisfaction metrics
    // 4. Adjust agent behavior based on feedback

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Failed to store feedback" },
      { status: 500 }
    )
  }
} 