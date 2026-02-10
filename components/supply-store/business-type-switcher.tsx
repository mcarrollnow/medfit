"use client"

import { useSupplyStoreBusinessType } from "@/lib/supply-store/business-context"
import { SUPPLY_STORE_BUSINESS_TYPES, type SupplyStoreBusinessType } from "@/lib/supply-store/types"
import { cn } from "@/lib/utils"
import { Dumbbell, Sparkles, Heart } from "lucide-react"

const icons = {
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  heart: Heart,
}

export function SupplyStoreBusinessTypeSwitcher() {
  const { businessType, setBusinessType } = useSupplyStoreBusinessType()

  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-foreground/5 border border-border backdrop-blur-sm">
      {Object.values(SUPPLY_STORE_BUSINESS_TYPES).map((type) => {
        const Icon = icons[type.icon]
        const isActive = businessType === type.id

        return (
          <button
            key={type.id}
            onClick={() => setBusinessType(type.id as SupplyStoreBusinessType)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              isActive
                ? "bg-foreground text-background shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/10",
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{type.name}</span>
          </button>
        )
      })}
    </div>
  )
}

