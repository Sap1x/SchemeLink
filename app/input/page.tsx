"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Mic, FileText, ArrowRight, MicIcon, Loader2 } from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export default function InputPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [inputMethod, setInputMethod] = useState<"manual" | "voice">("manual")
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voiceInputStates, setVoiceInputStates] = useState({
    age: false,
    income: false,
    occupation: false,
  })
  const [stateError, setStateError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    occupation: "",
    state: "", // Added state field
    location: "",
    additionalInfo: "",
  })

  useEffect(() => {
    const method = searchParams.get("method")
    if (method === "voice" || method === "manual") {
      setInputMethod(method)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "state" && stateError) {
      setStateError("")
    }
  }

  const handleFieldVoiceInput = async (fieldName: "age" | "income" | "occupation") => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "hi-IN"

    setVoiceInputStates((prev) => ({ ...prev, [fieldName]: true }))

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript
      setFormData((prev) => ({ ...prev, [fieldName]: speechResult }))
      setVoiceInputStates((prev) => ({ ...prev, [fieldName]: false }))
    }

    recognition.onerror = () => {
      setVoiceInputStates((prev) => ({ ...prev, [fieldName]: false }))
      alert(`Voice input failed for ${fieldName}. Please try again.`)
    }

    recognition.onend = () => {
      setVoiceInputStates((prev) => ({ ...prev, [fieldName]: false }))
    }

    recognition.start()
  }

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser. Please use manual input.")
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "hi-IN"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript
      setIsListening(false)
      setTranscript(speechResult)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
      alert("Speech recognition failed. Please try again or use manual input.")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (inputMethod === "manual") {
      const missingFields = []
      if (!formData.age.trim()) missingFields.push("Age")
      if (!formData.income.trim()) missingFields.push("Income")
      if (!formData.occupation.trim()) missingFields.push("Occupation")
      if (!formData.state.trim()) {
        setStateError("Please select your state to continue.")
        return
      }

      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(", ")}`)
        return
      }
    } else if (inputMethod === "voice") {
      if (!transcript.trim()) {
        alert("Please provide voice input before submitting")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        method: inputMethod,
        ...(inputMethod === "manual" ? formData : { transcript }),
      }

      console.log("[v0] Submitting request:", requestData)

      const response = await fetch("/api/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (response.ok && result.schemes) {
        sessionStorage.setItem("schemeResults", JSON.stringify(result.schemes))
        sessionStorage.setItem("userInput", JSON.stringify(requestData))
        router.push("/results")
      } else {
        throw new Error(result.error || "Failed to get scheme recommendations")
      }
    } catch (error) {
      console.error("[v0] Submission error:", error)
      alert(`Failed to get scheme recommendations: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Tell Us About Yourself
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Provide your information to get personalized government scheme recommendations
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-soft border border-slate-200">
            <Button
              variant={inputMethod === "manual" ? "default" : "ghost"}
              onClick={() => setInputMethod("manual")}
              className={`flex items-center space-x-2 rounded-lg ${
                inputMethod === "manual" ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md" : "hover:bg-blue-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Manual Input</span>
            </Button>
            <Button
              variant={inputMethod === "voice" ? "default" : "ghost"}
              onClick={() => setInputMethod("voice")}
              className={`flex items-center space-x-2 rounded-lg ${
                inputMethod === "voice" ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md" : "hover:bg-blue-50"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Input</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {inputMethod === "manual" ? (
            <Card className="shadow-card border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Manual Information Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700 font-medium">
                      Age *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleFieldVoiceInput("age")}
                        disabled={voiceInputStates.age}
                        className="border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                      >
                        {voiceInputStates.age ? (
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        ) : (
                          <MicIcon className="w-4 h-4 text-orange-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income" className="text-slate-700 font-medium">
                      Annual Income (₹) *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="income"
                        type="number"
                        placeholder="Enter annual income"
                        value={formData.income}
                        onChange={(e) => handleInputChange("income", e.target.value)}
                        className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleFieldVoiceInput("income")}
                        disabled={voiceInputStates.income}
                        className="border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                      >
                        {voiceInputStates.income ? (
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        ) : (
                          <MicIcon className="w-4 h-4 text-orange-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-slate-700 font-medium">
                    Occupation *
                  </Label>
                  <div className="flex space-x-2">
                    <Select onValueChange={(value) => handleInputChange("occupation", value)}>
                      <SelectTrigger className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select your occupation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                        <SelectItem value="private-employee">Private Employee</SelectItem>
                        <SelectItem value="government-employee">Government Employee</SelectItem>
                        <SelectItem value="business-owner">Business Owner</SelectItem>
                        <SelectItem value="daily-wage-worker">Daily Wage Worker</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleFieldVoiceInput("occupation")}
                      disabled={voiceInputStates.occupation}
                      className="border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                    >
                      {voiceInputStates.occupation ? (
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      ) : (
                        <MicIcon className="w-4 h-4 text-orange-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700 font-medium">
                    Select State *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger
                      className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 ${stateError ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {stateError && <p className="text-red-500 text-sm font-medium">{stateError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 font-medium">
                    Location (Optional)
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, District"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-slate-700 font-medium">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional details that might help us recommend better schemes"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>Voice Input</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="text-center">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Click the microphone button and speak your details in Hindi or English.
                    <br />
                    <span className="text-sm text-slate-500">
                      Example: "मेरी उम्र 45 साल है, मैं किसान हूँ, और मेरी सालाना आय साठ हजार रुपये है।"
                    </span>
                  </p>

                  <Button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={isListening || isTranscribing}
                    size="lg"
                    className={`w-32 h-32 rounded-full shadow-lg transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    }`}
                  >
                    {isTranscribing ? (
                      <Loader2 className="w-12 h-12 animate-spin text-white" />
                    ) : (
                      <MicIcon className={`w-12 h-12 text-white ${isListening ? "animate-pulse" : ""}`} />
                    )}
                  </Button>

                  <p className="mt-4 text-sm font-medium text-slate-600">
                    {isListening
                      ? "🎤 Listening... Speak now"
                      : isTranscribing
                        ? "⏳ Processing your speech..."
                        : "Click to start speaking"}
                  </p>
                </div>

                {transcript && (
                  <div className="mt-6">
                    <Label className="text-slate-700 font-medium">Your Voice Input:</Label>
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-slate-800">{transcript}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setTranscript("")}
                      className="mt-2 border-slate-300 hover:bg-slate-50"
                    >
                      Clear & Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button
              type="submit"
              size="lg"
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finding Schemes...
                </>
              ) : (
                <>
                  Find Schemes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
