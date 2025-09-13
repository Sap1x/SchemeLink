import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // In a real implementation, you would integrate with Web Speech API or another service
    return NextResponse.json({
      transcript: "मैं 30 साल का किसान हूं और मेरी सालाना आय 2 लाख रुपए है। मैं राजस्थान में रहता हूं।",
      note: "Voice transcription temporarily disabled. Please use manual input.",
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
