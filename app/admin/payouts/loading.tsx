import { Card, CardContent } from "@/components/ui/card"

export default function PayoutsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-10 w-48 bg-foreground/10 rounded-xl animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-foreground/5 border-border">
              <CardContent className="p-6">
                <div className="h-16 bg-foreground/10 rounded-xl animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-foreground/5 border-border">
              <CardContent className="p-6">
                <div className="h-20 bg-foreground/10 rounded-xl animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

