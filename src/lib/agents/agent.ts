import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { model, agentPrompts } from "./config"

export type AgentType = keyof typeof agentPrompts

interface AgentInput {
  agentType: AgentType
  userInput: string
  chatHistory: string
  enableArtifacts?: boolean
}

const createPrompt = (agentType: AgentType, enableArtifacts?: boolean) => {
  return ChatPromptTemplate.fromTemplate(`
    ${agentPrompts[agentType]}

    Chat History:
    {chatHistory}

    User: {userInput}
    Assistant: Let me help you with that.
  `)
}

export async function runAgent({ agentType, userInput, chatHistory, enableArtifacts = false }: AgentInput) {
  // Always enable artifacts for cultural agent
  const shouldEnableArtifacts = agentType === 'cultural' ? true : enableArtifacts
  
  const prompt = createPrompt(agentType, shouldEnableArtifacts)
  
  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser()
  ])

  try {
    const response = await chain.invoke({
      userInput,
      chatHistory,
      enableArtifacts: shouldEnableArtifacts
    })

    // Format the response as Markdown if it's not already
    const formattedResponse = `\`\`\`markdown\n${response}\n\`\`\``;

    return {
      success: true,
      response: formattedResponse // Return the formatted response
    }
  } catch (error) {
    console.error("Agent error:", error)
    return {
      success: false,
      error: "Failed to process your request. Please try again."
    }
  }
} 