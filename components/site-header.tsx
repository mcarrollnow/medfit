'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, MessageSquare, Settings, ShoppingBag, ShoppingCart, Search, Headphones } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../lib/cart-store';
import { toast } from 'react-hot-toast';
import NotificationCenter from './notification-center';

interface SiteHeaderProps {
  showCart?: boolean;
}

export default function SiteHeader({ showCart = true }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const router = useRouter();
  const cartCount = getItemCount();

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      // Use hard navigation to clear all cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-30">
        <div className="w-full px-4 py-3 max-w-full overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <img
                src="/images/eagleonlywhite.svg"
                alt="MHP Logo"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <h1 className="text-xl lg:text-2xl font-bold text-foreground whitespace-nowrap hidden sm:block">
                MODERN HEALTH PRO
              </h1>
              <h1 className="text-lg font-bold text-foreground whitespace-nowrap block sm:hidden">
                MHP
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 bg-transparent border border-border text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none rounded-lg transition text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    router.push(`/?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right Side Icons - Notifications, Cart and Hamburger */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Notifications */}
              {user && <NotificationCenter />}

              {/* Shopping Cart */}
              {showCart && (
                <Link href="/cart" className="text-foreground hover:text-foreground/80 transition relative">
                  <ShoppingCart className="w-8 h-8" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-foreground hover:text-foreground/80 transition relative"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] bg-background overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="fixed top-6 right-6 text-muted-foreground hover:text-foreground transition z-[10000]"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="min-h-full flex flex-col justify-center py-16 px-8">
            <div className="max-w-md w-full mx-auto">
            {/* User Profile Section */}
            {user && (
              <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-border">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-accent"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border-2 border-accent">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {user.firstName} {user.lastName?.charAt(0)}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <p className="text-accent text-xs font-bold uppercase mt-1">{user.role}</p>
                </div>
              </div>
            )}

            {/* Action Icons Row */}
            <div className="flex items-center justify-center gap-8 mb-8 pb-6 border-b border-border">
              <Link
                href="/support"
                onClick={closeMenu}
                className="flex flex-col items-center space-y-2 text-foreground hover:text-foreground/80 transition group"
              >
                <MessageSquare className="w-8 h-8" />
                <span className="text-sm font-medium">Messages</span>
              </Link>
              
              <Link
                href="/support-chat"
                onClick={closeMenu}
                className="flex flex-col items-center space-y-2 text-foreground hover:text-foreground/80 transition group"
              >
                <Headphones className="w-8 h-8" />
                <span className="text-sm font-medium">Support</span>
              </Link>
            </div>

            <nav className="space-y-4">
              {user ? (
                <>
                  <Link
                    href={(user.role === 'admin' || user.role === 'superadmin') ? '/admin' : '/dashboard'}
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <Settings className="w-8 h-8" />
                    <span className="text-2xl font-bold">Profile</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ShoppingBag className="w-8 h-8" />
                    <span className="text-2xl font-bold">Shop</span>
                  </Link>

                  <button
                    onClick={async () => {
                      closeMenu();
                      await handleLogout();
                    }}
                    className="flex items-center space-x-4 text-foreground hover:text-foreground transition group py-3 w-full text-left"
                  >
                    <LogOut className="w-8 h-8" />
                    <span className="text-2xl font-bold">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ShoppingBag className="w-8 h-8" />
                    <span className="text-2xl font-bold">Shop</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Login</span>
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Register</span>
                  </Link>
                </>
              )}
            </nav>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}
