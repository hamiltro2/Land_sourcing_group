"use client"

import { useState } from "react"
import { Metadata } from "next"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Flag } from "lucide-react"

const LandForm = dynamic(
  () => import("@/components/land-form"),
  { ssr: false }
)

const ChatWindow = dynamic(
  () => import("@/components/chat/chat-window").then(mod => mod.ChatWindow),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Background_LandSourcing.jpg-jYmWgMHI7EuE1sKTZxqz2PFlptvwLj.jpeg"
          alt="Aerial view of green fields"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      <main className="relative z-10 min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a472a] to-[#2a573a]"></div>
            <div className="absolute inset-[12px] bg-gradient-to-br from-green-200/20 to-transparent rounded-lg"></div>
            <div className="absolute inset-[12px] rounded-lg border-2 border-green-200/30 shadow-[inset_0_0_15px_rgba(134,239,172,0.15)]"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-8">
              <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] flex-shrink-0">
                <div 
                  className="absolute inset-0 bg-black/40 blur-2xl [mask-image:url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_dots-A46GQywiVpnmwAGb1MihmEBk6c26pv.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] scale-110"
                  style={{ maskImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_dots-A46GQywiVpnmwAGb1MihmEBk6c26pv.png')" }}
                ></div>
                <div 
                  className="absolute inset-0 bg-[#1a472a]/50 blur-xl scale-105 [mask-image:url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_dots-A46GQywiVpnmwAGb1MihmEBk6c26pv.png')] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]"
                  style={{ maskImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_dots-A46GQywiVpnmwAGb1MihmEBk6c26pv.png')" }}
                ></div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_dots-A46GQywiVpnmwAGb1MihmEBk6c26pv.png"
                  alt="USA network map logo"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.35)]"
                  priority
                />
              </div>
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 drop-shadow-[0_5px_25px_rgba(0,0,0,0.8)] [text-shadow:_0_2px_10px_rgba(0,0,0,0.8),_0_0_30px_rgba(0,0,0,0.6)]">
                    Land Sourcing Group
                  </h1>
                  <p className="text-2xl md:text-3xl text-green-200 drop-shadow-[0_5px_20px_rgba(0,0,0,0.7)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)]">
                    Premium US Land Acquisition Services
                  </p>
                </div>
                <p className="text-lg text-green-100 max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] [text-shadow:_0_1px_5px_rgba(0,0,0,0.6)]">
                  We specialize in acquiring premium land properties across the United States,
                  offering competitive prices and a seamless selling experience.
                </p>
              </div>
            </div>
          </Card>

          {/* Main Content Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg p-3">
            <div className="border border-green-600/20 rounded-lg p-2">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Location Pin Section */}
                  <div className="lg:w-1/2 p-8 bg-gradient-to-br from-green-700/90 to-green-900/90 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                    <div className="space-y-6 text-white">
                      <h2 className="text-3xl font-bold text-center text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_50%)]">
                        GOT LAND? GET A CASH OFFER!
                      </h2>
                      <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Land_pin.jpg-6UxQHY3sApNOauMWgbbv3XwNODqGfz.jpeg"
                          alt="Panoramic view of location pin in sunlit grass field"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <p className="text-lg text-center">
                        Enter your property details for a quick cash offer on your land!
                      </p>
                      <div className="mt-8">
                        <ChatWindow />
                      </div>
                    </div>
                  </div>

                  {/* Form Section */}
                  <LandForm />
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Add this content after the main form card */}
          <div className="space-y-8">
            {/* Hero Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg p-3">
              <div className="border border-green-600/20 rounded-lg p-2">
                <CardHeader>
                  <CardTitle className="text-3xl text-center text-green-800">
                    Ready to Sell Your Land? Get a Fast, Fair Cash Offer with The Land Sourcing Group!
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 space-y-4">
                  <p>
                    Are you considering selling your land? At The Land Sourcing Group, we specialize in purchasing vacant
                    land across the United States. Our streamlined process, quick cash offers, and commitment to covering
                    all closing costs ensure a hassle-free experience, making it easier than ever to sell your land.
                  </p>
                  <p>
                    While many real estate investors focus on houses, we exclusively buy vacant land. Whether it's raw
                    land, inherited parcels, or land with back taxes, our team is here to help you sell your property
                    quickly and at a fair price.
                  </p>
                </CardContent>
              </div>
            </Card>

            {/* Why Choose Us Section */}
            <Card className="bg-gradient-to-br from-green-700/90 to-green-900/90 text-white border-none shadow-lg p-3">
              <div className="border border-green-600/30 rounded-lg p-2">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Why Choose The Land Sourcing Group?</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2 p-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Hassle-Free Transactions with No Hidden Fees</h3>
                    <p className="text-green-100">
                      Selling land can feel overwhelming, but we've simplified the process for you. Our direct purchasing
                      approach eliminates the need for intermediaries like real estate agents, saving you time, money, and
                      the hassle of listing fees.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">We Cover All Closing Costs</h3>
                    <p className="text-green-100">
                      Unlike traditional land sales, where sellers often bear title fees and other expenses, The Land
                      Sourcing Group pays for all closing costs. The amount we offer is exactly what you'll receive—no
                      hidden fees, no surprises.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Expertise You Can Trust</h3>
                    <p className="text-green-100">
                      Our experienced team understands the nuances of the land market. Whether your property has liens,
                      unpaid taxes, or zoning challenges, we have the knowledge and expertise to guide you through the
                      process.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Fast Cash and a Quick Closing</h3>
                    <p className="text-green-100">
                      At The Land Sourcing Group, we value your time. Our process is designed to provide fast cash offers
                      and a quick closing date—often within 30 days or less.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Testimonials Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg p-3">
              <div className="border border-green-600/20 rounded-lg p-2">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-green-800">
                    Testimonials from Satisfied Sellers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 p-8">
                  <p className="text-center">
                    Our clients say it best! Landowners across the country have praised our fair offers, transparent
                    communication, and seamless selling experience. Whether you're looking to sell an unwanted parcel or
                    turn inherited land into cash, our team is here to help.
                  </p>
                </CardContent>
              </div>
            </Card>

            {/* The Land Sourcing Group Difference */}
            <Card className="bg-gradient-to-br from-green-700/90 to-green-900/90 text-white border-none shadow-lg p-3">
              <div className="border border-green-600/30 rounded-lg p-2">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">The Land Sourcing Group Difference</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      <span>No realtors, no commissions, no hassle</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      <span>All closing fees covered</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      <span>Fast cash offers for your land</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full" />
                      <span>Professional, experienced team</span>
                    </li>
                  </ul>
                </CardContent>
              </div>
            </Card>

            {/* Call to Action */}
            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg p-3">
              <div className="border border-green-600/20 rounded-lg p-2">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-green-800">Contact Us Today to Get Started</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-8">
                  <p className="text-green-700 mb-6">
                    If you're ready to sell your land and receive a fair cash offer, The Land Sourcing Group is here to
                    help. Say goodbye to hidden fees, closing costs, and the stress of traditional land sales. Discover
                    the fastest, easiest way to sell your land today!
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-[1.02]">
                    Get Your Cash Offer Now
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
