export const runtime = 'edge'

import { NextResponse } from "next/server"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message, messages }: { message: string, messages: Message[] } = await req.json()

    // Validate the API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return new Response("OpenAI API key not configured", { status: 500 })
    }

    // Format messages with system prompt
    const systemPrompt: Message = {
      role: "system",
      content: `You are a professional land acquisition specialist at Land Sourcing Group. Follow these guidelines:

1. Response Style:
   - Keep responses concise and focused (2-3 sentences max)
   - Be direct and professional
   - Never repeat phrases or information
   - Use natural, conversational language

2. Contact Information Format:
   Always end responses with this exact format when contact info is relevant:

   Contact us:
   • Phone: (407) 284-8192
   • Hours: Mon-Fri 9AM-6PM EST

3. Key Points:
   - We buy all types of land in the United States
   - We offer quick, fair cash offers
   - No fees or complications
   - Simple, straightforward process

Remember: Each response should be unique and focused on the client's specific needs.`
    }

    const formattedMessages: Message[] = [
      systemPrompt,
      ...messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    console.log('Making request to OpenAI API...')

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-0125-preview",
        messages: formattedMessages,
        temperature: 0.3,
        max_tokens: 250,
        top_p: 0.95,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        response_format: { type: "text" },
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorMessage
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorJson.message || response.statusText
      } catch (e) {
        errorMessage = errorText || response.statusText
      }

      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${response.status} - ${errorMessage}` }),
        { status: 500 }
      )
    }

    // Get the response data
    const data = await response.json()
    
    // Return the response
    return new Response(
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ 
        error: `Chat API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }),
      { status: 500 }
    )
  }
}
