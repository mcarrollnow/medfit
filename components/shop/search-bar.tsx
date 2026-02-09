'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
      <Input
        type="text"
        placeholder="Search by name, CAS number, or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-white/40 backdrop-blur-md focus-visible:border-white/30 focus-visible:ring-white/20"
      />
    </div>
  )
}
