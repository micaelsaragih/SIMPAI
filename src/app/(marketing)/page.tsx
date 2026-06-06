import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { JournalTemplatesSection } from "@/components/landing/journal-templates-section"
import { WhySimpaiSection } from "@/components/landing/why-simpai-section"
import { FaqSection } from "@/components/landing/faq-section"
import { CtaSection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* 3. Workflow Section */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* 4. Journal Templates Section */}
      <div id="templates">
        <JournalTemplatesSection />
      </div>

      {/* 5. Value Proposition (Why SIMPAI) */}
      <WhySimpaiSection />

      {/* 6. FAQ Section */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* 7. Call To Action Section */}
      <CtaSection />
    </div>
  )
}
