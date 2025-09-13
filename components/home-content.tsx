"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, FileText, Users, Shield, Zap, Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function HomeContent() {
  const { t } = useLanguage()

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">{t("heroTitle")}</h1>
          <p className="text-xl text-foreground/80 mb-8 text-pretty max-w-2xl mx-auto">{t("heroSubtitle")}</p>

          {/* Input Method Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <Link href="/input?method=manual">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t("manualInput")}</h3>
                  <p className="text-foreground/70">{t("manualInputDesc")}</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/input?method=voice">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{t("voiceInput")}</h3>
                  <p className="text-foreground/70">{t("voiceInputDesc")}</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/input">{t("getStarted")}</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Why Choose SchemeLink?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the features that make SchemeLink the most trusted platform for government scheme recommendations
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Accessible for All</h3>
              <p className="text-gray-600 leading-relaxed">
                Voice and manual input options in Hindi and English make government schemes accessible to every citizen,
                regardless of literacy level or technical expertise.
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trusted & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with government-grade security and privacy standards. Your personal information is protected and
                never shared with third parties.
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI technology analyzes your profile and matches you with the most relevant government schemes,
                saving time and ensuring accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-blue-900 font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold">Scheme Link</span>
          </div>
          <p className="text-blue-200 mb-6 text-lg">
            Empowering every Indian citizen with easy access to government schemes
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-200">
            <span>Made with</span>
            <Heart className="w-5 h-5 text-red-400" />
            <span>for the people of India</span>
          </div>
        </div>
      </footer>
    </>
  )
}
