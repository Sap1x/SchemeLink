import { Navigation } from "@/components/navigation"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HomeContent />
    </div>
  )
}
