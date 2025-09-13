"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Navigation() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">Scheme Link</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              {t("about")}
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              {t("contact")}
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Globe className="w-4 h-4" />
              <span>{t("language")}</span>
            </Button>
          </div>

          {/* Mobile Navigation - simplified for space */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "हि" : "En"}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
