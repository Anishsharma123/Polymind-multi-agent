import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { model, agentPrompts } from "./config"

export type AgentType = keyof typeof agentPrompts

interface AgentInput {
  agentType: AgentType
  userInput: string
  chatHistory: string
}

const createPrompt = (agentType: AgentType) => {
  return ChatPromptTemplate.fromTemplate(`
    ${agentPrompts[agentType]}

    Chat History:
    {chatHistory}

    User: {userInput}
    Assistant: Let me help you with that.
  `)
}

export async function runAgent({ agentType, userInput, chatHistory }: AgentInput) {
  const prompt = createPrompt(agentType)
  
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser()
  ])

  try {
    const response = await chain.invoke({
      userInput,
      chatHistory
    })

    return {
      success: true,
      response
    }
  } catch (error) {
    console.error("Agent error:", error)
    return {
      success: false,
      error: "Failed to process your request. Please try again."
    }
  }
} 