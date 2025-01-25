"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { MessageCircle, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Land Value Assistant from Land Sourcing Group. I can help you estimate your property's value and answer any questions about selling your land. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, messages }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className={`w-full bg-gradient-to-br from-[#1a472a] to-[#2a573a] backdrop-blur-sm border-none shadow-lg transition-all duration-300 ${
      isExpanded ? 'fixed bottom-4 right-4 left-4 lg:left-auto lg:w-[600px] z-50' : ''
    }`}>
      <CardHeader className="pb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a472a]/50 via-transparent to-[#1a472a]/50"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-green-200" />
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                Land Value Assistant
              </CardTitle>
              <span className="text-sm font-medium text-green-200 tracking-wide uppercase">
                Land Sourcing Group
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-green-200 hover:bg-white/10"
            onClick={toggleExpand}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`overflow-y-auto space-y-4 p-4 bg-white/95 rounded-lg transition-all duration-300 ${
            isExpanded ? 'h-[400px]' : 'h-[200px]'
          }`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-green-100 text-green-900"
                      : "bg-[#1a472a] text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-100 rounded-lg px-4 py-2">
                  <Spinner className="text-[#1a472a] h-4 w-4" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your property value..."
              className="flex-1 bg-white/90 border-0 focus-visible:ring-green-200"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-white text-[#1a472a] hover:bg-green-100"
            >
              Send
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
