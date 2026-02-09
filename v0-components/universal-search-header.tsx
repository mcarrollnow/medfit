"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, MessageCircle, ShoppingCart, Menu, User, Package, Wallet, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notification-center"

interface UniversalSearchHeaderProps {
  isAdmin: boolean
  onMenuClick?: () => void
  onMessagesClick?: () => void
}

type SearchResultType = "customer" | "product" | "wallet" | "discount" | "order"

interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle: string
}

const resultIcons = {
  customer: User,
  product: Package,
  wallet: Wallet,
  discount: Tag,
  order: ShoppingCart,
}

export function UniversalSearchHeader({ isAdmin, onMenuClick, onMessagesClick }: UniversalSearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock search function - replace with actual API call
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock results
    const mockResults: SearchResult[] = [
      {
        id: "1",
        type: "customer",
        title: "John Doe",
        subtitle: "john.doe@example.com",
      },
      {
        id: "2",
        type: "product",
        title: "Premium Support Plan",
        subtitle: "$99.99/month",
      },
      {
        id: "3",
        type: "order",
        title: "Order #12345",
        subtitle: "Completed - $299.99",
      },
    ]

    setSearchResults(mockResults)
    setIsSearching(false)
  }

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery)
      }, 300)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    // Store result ID in sessionStorage for navigation
    sessionStorage.setItem(`search_result_${result.type}`, result.id)
    setShowResults(false)
    setSearchQuery("")
    // Navigate to result page (implement based on your routing)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  return (
    <header className="sticky top-0 border-b bg-background z-[10000]">
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customers, orders, products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              className="w-full pl-12 pr-12 py-3 rounded-xl"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (searchResults.length > 0 || isSearching || searchQuery.trim()) && (
            <>
              {/* Overlay */}
              <div className="fixed inset-0 bg-black/85 z-[9998]" onClick={() => setShowResults(false)} />

              {/* Results Container */}
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-[80vh] overflow-y-auto z-[9999] bg-background border rounded-xl shadow-lg">
                {isSearching ? (
                  <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => {
                      const Icon = resultIcons[result.type]
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full p-4 rounded-lg hover:bg-accent transition-colors flex items-center gap-4 text-left"
                        >
                          <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                              {result.type}
                            </div>
                            <div className="text-base font-semibold mb-1 truncate">{result.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{result.subtitle}</div>
                          </div>
                          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="w-12 h-12 mb-3" />
                    <p className="text-sm">No results found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              {/* Admin Messages */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onMessagesClick}
                className="relative p-3 rounded-xl hover:bg-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {/* Unread badge example */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-semibold rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </>
          ) : (
            <>
              {/* Customer Actions */}
              <NotificationCenter unreadCount={2} />
              <Button
                variant="ghost"
                size="icon"
                onClick={onMessagesClick}
                className="p-3 rounded-xl hover:bg-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative p-3 rounded-xl hover:bg-accent transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-semibold rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>
            </>
          )}

          {/* Always Visible */}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="p-3 rounded-xl hover:bg-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
