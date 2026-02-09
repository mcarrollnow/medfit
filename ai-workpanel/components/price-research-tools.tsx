"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  Package,
  Globe,
  BarChart3,
  Plus,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  name: string
  sku: string
  currentPrice: number
  stock: number
  category: string
}

type PriceComparison = {
  source: string
  price: number
  url: string
  inStock: boolean
  lastUpdated: Date
}

export function PriceResearchTools() {
  const [activeTab, setActiveTab] = React.useState("comparison")

  return (
    <div className="flex h-full flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-4 gap-1">
          <TabsTrigger value="comparison" className="text-xs">
            <DollarSign className="mr-1 size-3" />
            Prices
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs">
            <Package className="mr-1 size-3" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="websites" className="text-xs">
            <Globe className="mr-1 size-3" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <BarChart3 className="mr-1 size-3" />
            Stats
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="comparison" className="mt-0">
            <PriceComparisonPanel />
          </TabsContent>
          <TabsContent value="inventory" className="mt-0">
            <InventoryPanel />
          </TabsContent>
          <TabsContent value="websites" className="mt-0">
            <WebsiteComparisonPanel />
          </TabsContent>
          <TabsContent value="stats" className="mt-0">
            <StatsPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function PriceComparisonPanel() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [comparisons, setComparisons] = React.useState<PriceComparison[]>([
    {
      source: "Amazon",
      price: 999.99,
      url: "https://amazon.com",
      inStock: true,
      lastUpdated: new Date(),
    },
    {
      source: "Best Buy",
      price: 1049.99,
      url: "https://bestbuy.com",
      inStock: true,
      lastUpdated: new Date(),
    },
    {
      source: "Walmart",
      price: 979.99,
      url: "https://walmart.com",
      inStock: false,
      lastUpdated: new Date(),
    },
  ])

  const lowestPrice = Math.min(...comparisons.map((c) => c.price))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Comparison</CardTitle>
          <CardDescription>Compare prices across multiple retailers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="icon" variant="outline">
              <RefreshCw className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {comparisons.map((comparison, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3",
                  comparison.price === lowestPrice && "border-primary bg-primary/5",
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{comparison.source}</p>
                    {comparison.price === lowestPrice && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Lowest
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn(comparison.inStock ? "text-green-600" : "text-red-600")}>
                      {comparison.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    <span>•</span>
                    <span>Updated {comparison.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">${comparison.price.toFixed(2)}</p>
                  <Button size="icon-sm" variant="ghost" asChild>
                    <a href={comparison.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <DollarSign className="mr-2 size-4" />
            Update Our Price
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Plus className="mr-2 size-4" />
            Add to Watchlist
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function InventoryPanel() {
  const [products, setProducts] = React.useState<Product[]>([
    { id: "1", name: "iPhone 15 Pro", sku: "IPH15P-256", currentPrice: 999.99, stock: 45, category: "Phones" },
    { id: "2", name: "MacBook Pro 14", sku: "MBP14-512", currentPrice: 1999.99, stock: 12, category: "Laptops" },
    { id: "3", name: "AirPods Pro", sku: "APP-2ND", currentPrice: 249.99, stock: 0, category: "Audio" },
  ])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventory Management</CardTitle>
          <CardDescription>Track stock levels and product information</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4 w-full">
            <Plus className="mr-2 size-4" />
            Add New Product
          </Button>

          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-semibold">${product.currentPrice}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          product.stock > 10
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Update All Prices
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Package className="mr-2 size-4" />
            Export Inventory
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function WebsiteComparisonPanel() {
  const [url1, setUrl1] = React.useState("https://amazon.com")
  const [url2, setUrl2] = React.useState("https://bestbuy.com")
  const [showComparison, setShowComparison] = React.useState(false)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Website Comparison</CardTitle>
          <CardDescription>Compare product pages side by side</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url1">Website 1</Label>
            <Input id="url1" placeholder="https://..." value={url1} onChange={(e) => setUrl1(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url2">Website 2</Label>
            <Input id="url2" placeholder="https://..." value={url2} onChange={(e) => setUrl2(e.target.value)} />
          </div>
          <Button className="w-full" onClick={() => setShowComparison(!showComparison)}>
            <Globe className="mr-2 size-4" />
            {showComparison ? "Hide Comparison" : "Compare Websites"}
          </Button>
        </CardContent>
      </Card>

      {showComparison && (
        <Card>
          <CardContent className="p-2">
            <div className="space-y-2">
              <div className="aspect-video overflow-hidden rounded-lg border">
                <iframe src={url1} className="size-full" title="Website 1" sandbox="allow-same-origin allow-scripts" />
              </div>
              <div className="aspect-video overflow-hidden rounded-lg border">
                <iframe src={url2} className="size-full" title="Website 2" sandbox="allow-same-origin allow-scripts" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatsPanel() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Analytics</CardTitle>
          <CardDescription>Market insights and trends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Avg Market Price</p>
              <p className="mt-1 text-xl font-bold">$1,009.99</p>
              <div className="mt-1 flex items-center text-xs text-green-600">
                <TrendingDown className="mr-1 size-3" />
                2.3% vs last week
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Your Price</p>
              <p className="mt-1 text-xl font-bold">$999.99</p>
              <div className="mt-1 flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 size-3" />
                Competitive
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">AI Suggestions</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Consider lowering price by $10 to match lowest competitor
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Stock levels are low - reorder recommended
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                Price trend shows 5% decrease over 30 days
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Products</span>
            <span className="font-semibold">247</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Low Stock Items</span>
            <span className="font-semibold text-yellow-600">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Out of Stock</span>
            <span className="font-semibold text-red-600">3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price Updates Today</span>
            <span className="font-semibold">8</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
