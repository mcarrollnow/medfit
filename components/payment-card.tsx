import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Logo {
  icon: React.ReactNode
  name: string
}

interface PaymentCardProps {
  title: string
  description: string
  logos: Logo[]
  buttonText: string
  featured?: boolean
}

export function PaymentCard({ title, description, logos, buttonText, featured }: PaymentCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        "border-0 bg-foreground/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(58,66,51,0.15)]",
        "hover:bg-foreground/[0.12] hover:shadow-[0_12px_40px_rgba(58,66,51,0.2)]",
        featured && "ring-1 ring-foreground/20",
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col h-full">
          {/* Title & Description */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 text-balance">{title}</h2>
            <p className="text-muted-foreground text-sm sm:text-base text-pretty">{description}</p>
          </div>

          {/* Logos */}
          <div className="flex items-center gap-3 mb-8">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-foreground/[0.06] border border-border p-2.5 transition-all duration-200 group-hover:bg-foreground/[0.08] group-hover:scale-105"
                title={logo.name}
              >
                {logo.icon}
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="mt-auto">
            <Button
              className="w-full group/btn justify-between text-base font-medium h-12 sm:h-14 bg-foreground/[0.08] hover:bg-foreground/[0.15] border border-border hover:border-border text-foreground backdrop-blur-sm"
              variant="outline"
            >
              <span>{buttonText}</span>
              <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

