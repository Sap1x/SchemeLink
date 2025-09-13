import { type NextRequest, NextResponse } from "next/server"

interface SchemeRequest {
  age?: string
  income?: string
  occupation?: string
  location?: string
  state?: string
  additionalInfo?: string
  transcript?: string
  method: "manual" | "voice"
}

interface Scheme {
  name: string
  eligibility: string
  benefits: string
  description: string
  official_link: string
}

const SCHEMES_DATABASE: Scheme[] = [
  {
    name: "PM-Kisan Samman Nidhi",
    eligibility: "Small and marginal farmers with up to 2 hectares of landholding",
    benefits: "₹6,000 annually in three installments",
    description: "Direct income support for farmers to cover agricultural expenses",
    official_link: "https://pmkisan.gov.in",
  },
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    eligibility: "Families with annual income up to ₹18 lakh (urban) or ₹3 lakh (rural)",
    benefits: "Subsidized housing loans and direct assistance for home construction",
    description: "Affordable housing scheme for economically weaker sections",
    official_link: "https://pmaymis.gov.in",
  },
  {
    name: "Ayushman Bharat (PMJAY)",
    eligibility: "Families below poverty line or in SECC database",
    benefits: "Health insurance coverage up to ₹5 lakh annually",
    description: "Free health insurance for vulnerable families",
    official_link: "https://pmjay.gov.in",
  },
  {
    name: "Pradhan Mantri Mudra Yojana",
    eligibility: "Non-corporate, non-farm small/micro enterprises",
    benefits: "Loans up to ₹10 lakh without collateral",
    description: "Financial support for small businesses and startups",
    official_link: "https://www.mudra.org.in",
  },
  {
    name: "Stand Up India",
    eligibility: "Women and SC/ST entrepreneurs aged 18+ with business plan",
    benefits: "Bank loans between ₹10 lakh to ₹1 crore",
    description: "Support for women and SC/ST entrepreneurs to start businesses",
    official_link: "https://www.standupmitra.in",
  },
  {
    name: "Sukanya Samriddhi Yojana",
    eligibility: "Girl child below 10 years of age",
    benefits: "High interest rate savings account with tax benefits",
    description: "Savings scheme for girl child education and marriage expenses",
    official_link: "https://www.nsiindia.gov.in",
  },
  {
    name: "Atal Pension Yojana",
    eligibility: "Citizens aged 18-40 years with bank account",
    benefits: "Guaranteed pension of ₹1,000 to ₹5,000 per month",
    description: "Pension scheme for unorganized sector workers",
    official_link: "https://www.npscra.nsdl.co.in",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    eligibility: "All farmers including sharecroppers and tenant farmers",
    benefits: "Crop insurance against natural calamities",
    description: "Comprehensive crop insurance scheme for farmers",
    official_link: "https://pmfby.gov.in",
  },
  {
    name: "Ujjwala Yojana (PMUY)",
    eligibility: "BPL families, especially women",
    benefits: "Free LPG connection with financial assistance",
    description: "Clean cooking fuel for poor households",
    official_link: "https://pmuy.gov.in",
  },
  {
    name: "Kisan Credit Card (KCC)",
    eligibility: "All farmers including tenant farmers and sharecroppers",
    benefits: "Easy access to credit for agricultural needs",
    description: "Credit facility for farmers at subsidized interest rates",
    official_link: "https://www.nabard.org",
  },
]

function matchSchemes(userProfile: SchemeRequest): Scheme[] {
  const matchedSchemes: Scheme[] = []
  const age = Number.parseInt(userProfile.age || "0")
  const income = Number.parseInt(userProfile.income?.replace(/[^\d]/g, "") || "0")
  const occupation = userProfile.occupation?.toLowerCase() || ""

  // Rule-based matching logic
  SCHEMES_DATABASE.forEach((scheme) => {
    let isMatch = false

    // Farmer-specific schemes
    if (occupation.includes("farmer") || occupation.includes("agriculture") || occupation.includes("farming")) {
      if (scheme.name.includes("Kisan") || scheme.name.includes("Fasal") || scheme.name === "Kisan Credit Card (KCC)") {
        isMatch = true
      }
    }

    // Low income schemes
    if (income <= 300000) {
      // ₹3 lakh or less
      if (scheme.name.includes("Awas") || scheme.name.includes("Ayushman") || scheme.name.includes("Ujjwala")) {
        isMatch = true
      }
    }

    // Business/entrepreneur schemes
    if (occupation.includes("business") || occupation.includes("entrepreneur") || occupation.includes("self")) {
      if (scheme.name.includes("Mudra") || scheme.name.includes("Stand Up")) {
        isMatch = true
      }
    }

    // Age-based schemes
    if (age >= 18 && age <= 40) {
      if (scheme.name.includes("Atal Pension")) {
        isMatch = true
      }
    }

    // Universal schemes (applicable to most users)
    if (scheme.name.includes("Ayushman") || scheme.name === "Atal Pension Yojana") {
      isMatch = true
    }

    // Girl child scheme (if user mentions daughter/girl child)
    if (
      userProfile.additionalInfo?.toLowerCase().includes("daughter") ||
      userProfile.additionalInfo?.toLowerCase().includes("girl")
    ) {
      if (scheme.name.includes("Sukanya")) {
        isMatch = true
      }
    }

    if (isMatch && !matchedSchemes.find((s) => s.name === scheme.name)) {
      matchedSchemes.push(scheme)
    }
  })

  // If no specific matches, return some universal schemes
  if (matchedSchemes.length === 0) {
    return [
      SCHEMES_DATABASE.find((s) => s.name.includes("Ayushman"))!,
      SCHEMES_DATABASE.find((s) => s.name.includes("Mudra"))!,
      SCHEMES_DATABASE.find((s) => s.name.includes("Atal Pension"))!,
    ].filter(Boolean)
  }

  return matchedSchemes.slice(0, 5) // Return max 5 schemes
}

export async function POST(request: NextRequest) {
  try {
    const data: SchemeRequest = await request.json()
    console.log("[v0] Received request data:", data)

    let userProfile: SchemeRequest

    if (data.method === "manual") {
      if (!data.age || !data.income || !data.occupation) {
        return NextResponse.json(
          { error: "Missing required fields: age, income, and occupation are required" },
          { status: 400 },
        )
      }
      userProfile = data
    } else {
      if (!data.transcript?.trim()) {
        return NextResponse.json({ error: "Voice transcript is required for voice input method" }, { status: 400 })
      }
      const transcript = data.transcript.toLowerCase()
      userProfile = {
        ...data,
        age: extractAge(transcript),
        income: extractIncome(transcript),
        occupation: extractOccupation(transcript),
      }
    }

    console.log("[v0] Processing user profile:", userProfile)

    const schemes = matchSchemes(userProfile)

    console.log("[v0] Returning schemes:", schemes)
    return NextResponse.json({ schemes })
  } catch (error) {
    console.error("Scheme matching error:", error)
    return NextResponse.json(
      {
        error: "Failed to get scheme recommendations. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function extractAge(text: string): string {
  const ageMatch = text.match(/(\d+)\s*(?:years?|साल)/i)
  return ageMatch ? ageMatch[1] : "25"
}

function extractIncome(text: string): string {
  const incomeMatch = text.match(/(\d+)\s*(?:lakh|thousand|हजार|लाख)/i)
  if (incomeMatch) {
    const amount = Number.parseInt(incomeMatch[1])
    if (text.includes("lakh") || text.includes("लाख")) {
      return (amount * 100000).toString()
    }
    if (text.includes("thousand") || text.includes("हजार")) {
      return (amount * 1000).toString()
    }
  }
  return "200000"
}

function extractOccupation(text: string): string {
  if (text.includes("farmer") || text.includes("किसान") || text.includes("खेती")) return "farmer"
  if (text.includes("business") || text.includes("व्यापार") || text.includes("धंधा")) return "business"
  if (text.includes("student") || text.includes("छात्र")) return "student"
  if (text.includes("teacher") || text.includes("शिक्षक")) return "teacher"
  if (text.includes("driver") || text.includes("चालक")) return "driver"
  return "other"
}
