"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, MessageSquare, Settings, ShoppingBag, Search } from 'lucide-react'

export default function SupportHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Main site URL - defaults to localhost for development
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:5173'

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, just log the search - you can add actual search functionality later
    console.log('Search query:', searchQuery)
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 shadow-sm z-30">
        <div className="w-full max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <img 
                src="/eagleonlywhite.svg" 
                alt="MHP Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="hidden lg:block text-lg sm:text-xl font-bold text-white whitespace-nowrap">
                MODERN HEALTH PRO
              </h1>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets, customers, orders..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-[#3dff8b] focus:outline-none transition"
                />
              </div>
            </form>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-white hover:bg-gray-800 rounded-lg transition"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-2xl w-full px-8">
            <nav className="space-y-6">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <User className="w-8 h-8" />
                <span className="text-3xl font-bold">Admin Support</span>
              </Link>
              
              <Link
                href="/customer"
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <MessageSquare className="w-8 h-8" />
                <span className="text-3xl font-bold">Customer Support</span>
              </Link>
              
              <a
                href={`${mainSiteUrl}/admin`}
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <User className="w-8 h-8" />
                <span className="text-3xl font-bold">Dashboard</span>
              </a>
              
              <a
                href={`${mainSiteUrl}/profile`}
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <Settings className="w-8 h-8" />
                <span className="text-3xl font-bold">Profile</span>
              </a>
              
              <a
                href={`${mainSiteUrl}/support`}
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <MessageSquare className="w-8 h-8" />
                <span className="text-3xl font-bold">Support</span>
              </a>
              
              <a
                href={`${mainSiteUrl}`}
                onClick={closeMenu}
                className="flex items-center space-x-4 text-white hover:text-[#3dff8b] transition group"
              >
                <ShoppingBag className="w-8 h-8" />
                <span className="text-3xl font-bold">Shop</span>
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  )
}
