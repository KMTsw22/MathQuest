import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o'

export interface ClaudeCallOptions {
  systemPrompt: string
  userMessage: string
  maxTokens?: number
}

export async function callClaude(options: ClaudeCallOptions): Promise<string> {
  const { systemPrompt, userMessage, maxTokens = 8192 } = options

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Empty response from OpenAI')
  return content
}
