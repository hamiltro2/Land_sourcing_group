import { NextResponse } from "next/server"

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json()

    // Format messages for Deepseek
    const formattedMessages = [
      {
        role: "system",
        content: `You are a knowledgeable land value assistant for Land Sourcing Group. 
        Your expertise includes:
        - Understanding land valuation factors
        - Explaining the land selling process
        - Providing general market insights
        - Answering questions about Land Sourcing Group's services
        
        Be friendly, professional, and concise. When discussing property values:
        1. Ask for specific details like location, acreage, and zoning
        2. Explain key factors that affect land value
        3. Mention that while you can provide general insights, a formal offer requires proper evaluation
        4. Always encourage them to fill out the form above for a detailed offer`,
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Make direct API call to Deepseek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || "I'm having trouble responding right now."

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    )
  }
}
