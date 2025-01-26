"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { MessageCircle, Minimize2, Maximize2, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Land Assistant from Land Sourcing Group. I can help you estimate your property's value and answer any questions about selling your land. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: userMessage,
          messages: messages 
        }),
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
    <>
      <Card id="chat-window" className={cn(
        "w-full border-green-600/20 transition-all duration-300",
        isExpanded ? "h-[350px]" : "h-[58px]"
      )}>
        <CardHeader className="pb-4 relative">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/10 p-2 rounded-full">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-xl font-bold text-green-800">
                  Land Assistant
                </CardTitle>
                <span className="text-sm text-green-600/80">
                  Land Sourcing Group
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-800"
                onClick={toggleExpand}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className={cn(
            "flex flex-col transition-all duration-300",
            isExpanded ? "opacity-100 h-[calc(350px-120px)]" : "opacity-0 h-0"
          )}>
            <div className="overflow-y-auto flex-1 space-y-4 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-start",
                    message.role === "user" && "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === "assistant"
                        ? "bg-green-600/10 text-green-900"
                        : "bg-green-600 text-white"
                    )}
                  >
                    <div className="prose prose-sm">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-green-600/10 text-green-900">
                    <Spinner className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 pt-0">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about selling your land..."
                  className="flex-1 bg-white/95 border-green-600/20 focus:border-green-600/40 focus:ring-green-600/40"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 rounded-full text-white">
          <Phone className="h-6 w-6" />
          <a href="tel:407-284-8192" className="text-lg font-semibold hover:underline">
            (407) 284-8192
          </a>
        </div>
      </div>
    </>
  )
}
