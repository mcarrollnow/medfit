import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function SupplyStoreFooter() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <span className="text-background font-serif text-lg">M</span>
              </div>
              <span className="font-serif text-lg font-light">Modern Health Pro</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium B2B wholesale supply for wellness professionals. Equip your facility with the best in recovery,
              fitness, and wellness equipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-light mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Products", href: "/supply-store/products" },
                { label: "My Orders", href: "/supply-store/orders" },
                { label: "Contact", href: "/supply-store/contact" },
                { label: "FAQ", href: "/supply-store/faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-lg font-light mb-4">Categories</h4>
            <ul className="space-y-3">
              {["Recovery Equipment", "Cold Plunge", "Cardio", "Strength", "Supplements"].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/supply-store/products"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-light mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                sales@modernhealthpro.com
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                1-800-MHP-SUPPLY
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  123 Wellness Blvd
                  <br />
                  Los Angeles, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-mono">© 2025 Modern Health Pro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
