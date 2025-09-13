"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"

interface Scheme {
  name: string
  eligibility: string
  benefits: string
  description: string
  official_link?: string
}

export default function ResultsPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [userInput, setUserInput] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [playingScheme, setPlayingScheme] = useState<number | null>(null)

  useEffect(() => {
    // Get data from sessionStorage
    const storedSchemes = sessionStorage.getItem("schemeResults")
    const storedUserInput = sessionStorage.getItem("userInput")

    if (storedSchemes && storedUserInput) {
      setSchemes(JSON.parse(storedSchemes))
      setUserInput(JSON.parse(storedUserInput))
    }

    setIsLoading(false)
  }, [])

  const handlePlayAudio = (text: string, schemeIndex: number) => {
    if ("speechSynthesis" in window) {
      // Stop any currently playing speech
      speechSynthesis.cancel()

      setPlayingScheme(schemeIndex)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-IN" // Indian English for better pronunciation
      utterance.rate = 0.9 // Slightly slower for clarity
      utterance.pitch = 1

      utterance.onend = () => {
        setPlayingScheme(null)
      }

      utterance.onerror = () => {
        setPlayingScheme(null)
        alert("Text-to-speech failed. Please try again.")
      }

      speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-slate-600">Loading your scheme recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/input">
            <Button variant="outline" className="mb-4 border-blue-200 hover:bg-blue-50 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Input
            </Button>
          </Link>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Recommended Schemes for You
          </h1>

          {/* Display user input summary */}
          {userInput && (
            <Card className="mb-6 shadow-soft border border-slate-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-lg">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {userInput.method === "manual" ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Age:</span>
                      <span className="ml-2 text-slate-900">{userInput.age || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Income:</span>
                      <span className="ml-2 text-slate-900">₹{userInput.income || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Occupation:</span>
                      <span className="ml-2 text-slate-900">{userInput.occupation || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Location:</span>
                      <span className="ml-2 text-slate-900">{userInput.location || "Not provided"}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-slate-700">Voice Input:</span>
                    <p className="mt-2 text-slate-600 bg-blue-50 p-3 rounded-lg">{userInput.transcript}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Schemes Grid */}
        <div className="grid gap-6">
          {schemes.map((scheme, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 border-slate-200 hover:border-blue-300 bg-white"
            >
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                      {scheme.name}
                    </CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayAudio(`${scheme.name}. ${scheme.description}. ${scheme.benefits}`, index)}
                    disabled={playingScheme === index}
                    className="ml-4 border-green-300 hover:bg-green-50 hover:border-green-400"
                  >
                    {playingScheme === index ? (
                      <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-green-600" />
                    )}
                    <span className="ml-1 text-sm">Listen</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-2">Eligibility</h4>
                  <p className="text-slate-800 leading-relaxed">{scheme.eligibility}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-2">Key Benefits</h4>
                  <p className="text-slate-800 leading-relaxed font-medium">{scheme.benefits}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-2">Description</h4>
                  <p className="text-slate-800 leading-relaxed">{scheme.description}</p>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  {scheme.official_link ? (
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => window.open(scheme.official_link, "_blank")}
                    >
                      Visit Official Website
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700 bg-transparent"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No schemes found message */}
        {schemes.length === 0 && (
          <Card className="text-center py-12 shadow-soft border border-slate-200">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">No Schemes Found</h3>
              <p className="text-slate-600 mb-4">
                We couldn't find any schemes matching your criteria. Please try adjusting your information.
              </p>
              <Link href="/input">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Try Again</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
