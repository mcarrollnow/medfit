"use client";

import { Header } from "@/components/landing3-sections/header";
import { HeroSection } from "@/components/landing3-sections/hero-section";
import { PhilosophySection } from "@/components/landing3-sections/philosophy-section";
import { FeaturedProductsSection } from "@/components/landing3-sections/featured-products-section";
import { TechnologySection } from "@/components/landing3-sections/technology-section";
import { GallerySection } from "@/components/landing3-sections/gallery-section";
import { CollectionSection } from "@/components/landing3-sections/collection-section";
import { EditorialSection } from "@/components/landing3-sections/editorial-section";
import { TestimonialsSection } from "@/components/landing3-sections/testimonials-section";
import { FooterSection } from "@/components/landing3-sections/footer-section";
import { Landing3ImagesProvider } from "@/components/landing3-sections/landing3-images-provider";

export default function Landing3Page() {
  return (
    <Landing3ImagesProvider>
      <main className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <PhilosophySection />
        <FeaturedProductsSection />
        <TechnologySection />
        <GallerySection />
        <CollectionSection />
        <EditorialSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </Landing3ImagesProvider>
  );
}
