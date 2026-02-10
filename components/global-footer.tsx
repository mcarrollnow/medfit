"use client"

import Link from "next/link"

export function GlobalFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img
              src="/icon.svg"
              alt="MHP Logo"
              className="w-10 h-10"
            />
            <span className="font-serif font-light text-lg tracking-tight">Modern Health Pro</span>
          </div>
          
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-8">
            <Link 
              href="/" 
              className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/policy" 
              className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Policies
            </Link>
          </nav>
        </div>
        
        {/* Customer Service Contact */}
        <div className="border-t border-border pt-10 pb-6">
          <div className="text-center text-sm text-muted-foreground">
            <span className="font-mono text-xs tracking-widest uppercase">Customer Service: </span>
            <a 
              href="mailto:support@modernhealthpro.com" 
              className="text-foreground hover:underline ml-2"
            >
              support@modernhealthpro.com
            </a>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              © {currentYear} Modern Health Pro
            </p>
            <p className="text-xs text-muted-foreground/50 mt-2 italic">
              A division of STROUD COMPANY LLC
            </p>
          </div>
          <p className="text-xs text-muted-foreground/50 italic">
            All products for research use only. Not for human consumption.
          </p>
        </div>
      </div>
    </footer>
  )
}
