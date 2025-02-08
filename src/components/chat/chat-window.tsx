"use client"

import { useState, useEffect, useRef } from "react"
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

const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Land Assistant from Land Sourcing Group. Do you need help getting a fair cash offer for your land quickly? Call us at (407) 284-8192 or submit your land details through our form so we can analyze your property.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const lastActivityTime = useRef<number>(Date.now())
  const refreshTimeout = useRef<NodeJS.Timeout>()
  const eventSource = useRef<EventSource | null>(null)

  // Function to check inactivity and refresh if needed
  const checkInactivity = () => {
    const currentTime = Date.now()
    if (currentTime - lastActivityTime.current >= INACTIVITY_TIMEOUT) {
      window.location.reload()
    }
  }

  // Update last activity time on user interactions
  const updateLastActivity = () => {
    lastActivityTime.current = Date.now()
  }

  // Set up activity monitoring
  useEffect(() => {
    // Set up periodic check for inactivity
    refreshTimeout.current = setInterval(checkInactivity, 60 * 1000) // Check every minute
    
    // Set up event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity)
    })

    // Cleanup
    return () => {
      if (refreshTimeout.current) {
        clearInterval(refreshTimeout.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity)
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      setInput('')
      setIsLoading(true)
      updateLastActivity()

      // Add user message
      const userMessage: Message = { role: "user", content: input }
      setMessages(prev => [...prev, userMessage])

      // Make the API request
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Handle the response
      const data = await response.json()
      
      // Add assistant message
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error. Please try again or contact us at (407) 284-8192 for immediate assistance."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    updateLastActivity()
  }

  useEffect(() => {
    return () => {
      if (eventSource.current) {
        eventSource.current.close()
      }
    }
  }, [])

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
              <div className="flex flex-col space-y-4 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-full",
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "flex max-w-[80%] rounded-lg px-4 py-3",
                        message.role === "assistant"
                          ? "bg-[#2C5530]/10 text-[#2C5530] shadow-sm"
                          : "bg-[#2C5530] text-white shadow-md"
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content.split('\n').map((line, i, arr) => {
                          // Format bullet points
                          if (line.trim().startsWith('•')) {
                            const isFirstBullet = !arr[i - 1]?.trim().startsWith('•')
                            const isLastBullet = !arr[i + 1]?.trim().startsWith('•')
                            
                            return (
                              <div 
                                key={i} 
                                className={cn(
                                  "flex items-start",
                                  isFirstBullet ? "mt-6" : "mt-4",
                                  isLastBullet ? "mb-6" : "mb-4"
                                )}
                              >
                                <span className={cn(
                                  "mt-0.5 text-lg min-w-[1.5rem] flex-shrink-0",
                                  message.role === "assistant" ? "text-[#2C5530]" : "text-white"
                                )}>•</span>
                                <span className="flex-1 pl-2">{line.substring(1).trim()}</span>
                              </div>
                            )
                          }
                          
                          // Format phone numbers and other lines
                          const formattedLine = line
                            .replace(/\(?(\d{3})\)?[-\s]*(\d{3})[-\s]*(\d{4})/g, '<span class="font-semibold">($1) $2-$3</span>')
                          
                          return (
                            <div 
                              key={i} 
                              className={cn(
                                "leading-relaxed my-2",
                                // Add spacing after paragraphs
                                line.trim() && !arr[i + 1]?.trim() && "mb-4"
                              )}
                              dangerouslySetInnerHTML={{ __html: formattedLine }} 
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#2C5530]/10 text-[#2C5530] max-w-[80%] rounded-lg px-4 py-2">
                      <Spinner className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
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
