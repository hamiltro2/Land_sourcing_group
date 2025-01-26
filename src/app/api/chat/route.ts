import { NextResponse } from "next/server"

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, messages = [] } = body

    // Format messages for Deepseek
    const formattedMessages = [
      {
        role: "system",
        content: `You are a knowledgeable land value assistant for Land Sourcing Group. 
        Your primary focus is helping potential sellers understand their land's value and our acquisition process.

        Key Responsibilities:
        1. Land Valuation Guidance
           - Ask for specific property details (location, acreage, zoning, topography)
           - Explain key value factors (location, access, utilities, zoning, development potential)
           - Provide general market insights for their region
        
        2. Process Education
           - Explain our streamlined acquisition process
           - Highlight our benefits (no fees, quick closing, all cash offers)
           - Emphasize our nationwide coverage
        
        3. Lead Generation
           - Always encourage form submission for detailed offers
           - Highlight success stories relevant to their situation
           - Address common concerns about selling land
        
        Communication Style:
        - Professional yet conversational
        - Concise and focused responses
        - Use specific examples when possible
        - Always maintain a helpful, solution-oriented approach

        Key Reminders:
        - Never quote specific prices
        - Emphasize that formal offers require proper evaluation
        - Direct users to the contact form for detailed discussions
        - Focus on building trust and demonstrating expertise`,
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
