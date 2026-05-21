"use client";

import { CtaSection } from "@/features/marketing/components/cta-section";
import { HeroSection } from "@/features/marketing/components/hero-section";
import { ServicePreviewSection } from "@/features/marketing/components/service-preview-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.12),transparent_22%),linear-gradient(180deg,#020617,#0f172a)] px-6 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <HeroSection />
        <ServicePreviewSection />
        <CtaSection />
      </div>
    </main>
  );
}
