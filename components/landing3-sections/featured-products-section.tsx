"use client";

import { FadeImage } from "@/components/landing3-sections/fade-image";
import { useLanding3Images } from "@/components/landing3-sections/landing3-images-provider";

const featuresMeta = [
  { slotId: "featured_1", title: "Smart Temperature Control", description: "Innovation" },
  { slotId: "featured_2", title: "Ultra-Light Carbon Frame", description: "Performance" },
  { slotId: "featured_3", title: "Weather-Resistant Design", description: "Durability" },
  { slotId: "featured_4", title: "Integrated GPS Tracking", description: "Navigation" },
  { slotId: "featured_5", title: "Built-In LED Flashlight", description: "Visibility" },
  { slotId: "featured_6", title: "Self-Heating Technology", description: "Comfort" },
];

export function FeaturedProductsSection() {
  const { getImage } = useLanding3Images();

  const features = featuresMeta.map((f) => ({
    ...f,
    image: getImage(f.slotId),
  }));
  return (
    <section id="technology" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Engineered for Excellence.
          <br />
          Designed for Adventure.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Technology
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-xl font-semibold">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}
