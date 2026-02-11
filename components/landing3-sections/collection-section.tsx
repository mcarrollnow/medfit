"use client";

import { FadeImage } from "@/components/landing3-sections/fade-image";
import { useLanding3Images } from "@/components/landing3-sections/landing3-images-provider";

const accessoriesMeta = [
  { id: 1, slotId: "accessory_1", name: "Wireless Charging Stand", description: "Induction charging dock for effortless power", price: "$89" },
  { id: 2, slotId: "accessory_2", name: "Protective Silicone Sleeve", description: "Textured grip sleeve for enhanced durability", price: "$45" },
  { id: 3, slotId: "accessory_3", name: "Carbon Fiber Bike Mount", description: "Ultra-light mounting system for cycling", price: "$129" },
  { id: 4, slotId: "accessory_4", name: "Premium Carry Strap", description: "Adjustable strap with quick-release clips", price: "$39" },
  { id: 5, slotId: "accessory_5", name: "Carabiner Clip System", description: "Secure attachment for hands-free carrying", price: "$29" },
  { id: 6, slotId: "accessory_6", name: "Bluetooth Speaker Base", description: "High-fidelity audio dock with grip stabilizers", price: "$149" },
];

export function CollectionSection() {
  const { getImage } = useLanding3Images();

  const accessories = accessoriesMeta.map((a) => ({
    ...a,
    image: getImage(a.slotId),
  }));
  return (
    <section id="accessories" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Essential Accessories
        </h2>
      </div>

      {/* Accessories Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group flex-shrink-0 w-[75vw] snap-center">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {accessory.description}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium leading-snug text-foreground">
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {accessory.description}
                    </p>
                  </div>
                  <span className="font-medium text-foreground text-2xl">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
