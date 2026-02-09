"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, MessageSquare, Settings, ShoppingBag, ShoppingCart, Search, Headphones, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface GlobalNavProps {
  showCart?: boolean;
}

interface UserProfile {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePictureUrl?: string;
}

export default function GlobalNavigation({ showCart = true }: GlobalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  // Mock data for v0 demo - replace with your actual auth/cart logic
  useEffect(() => {
    // Mock user data
    setUser({
      id: '1',
      authId: '1',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'customer',
      profilePictureUrl: undefined
    });
    
    // Mock cart count
    setCartCount(3);
  }, []);

  const handleLogout = async () => {
    setUser(null);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 shadow-sm z-30">
        <div className="w-full px-4 py-3 max-w-full overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              {/* Replace with your logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap hidden md:block">
                MODERN HEALTH PRO
              </h1>
              <h1 className="text-lg font-bold text-white whitespace-nowrap block md:hidden">
                MHP
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 bg-transparent border border-gray-700 text-white placeholder-white/40 focus:border-primary focus:outline-none rounded-lg transition text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    router.push(`/?search=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Right Side Icons - Notifications, Cart and Hamburger */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Simple Notifications Bell */}
              {user && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-white hover:text-white/80 transition p-2"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {notifications.length}
                    </span>
                  )}
                </button>
              )}

              {/* Shopping Cart */}
              {showCart && (
                <Link href="/cart" className="text-white hover:text-white/80 transition relative">
                  <ShoppingCart className="w-8 h-8" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white hover:text-white/80 transition relative"
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
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-white hover:text-white/80 transition"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-md w-full px-8">
            {/* User Profile Section */}
            {user && (
              <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-gray-800">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center border-2 border-primary">
                    <User className="w-7 h-7 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user.firstName} {user.lastName?.charAt(0)}
                  </h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-primary text-xs font-bold uppercase mt-1">{user.role}</p>
                </div>
              </div>
            )}

            {/* Action Icons Row */}
            <div className="flex items-center justify-center gap-8 mb-8 pb-6 border-b border-gray-800">
              <Link
                href="/support"
                onClick={closeMenu}
                className="flex flex-col items-center space-y-2 text-white hover:text-white/80 transition group"
              >
                <MessageSquare className="w-8 h-8" />
                <span className="text-sm font-medium">Messages</span>
              </Link>

              <Link
                href="/support-chat"
                onClick={closeMenu}
                className="flex flex-col items-center space-y-2 text-white hover:text-white/80 transition group"
              >
                <Headphones className="w-8 h-8" />
                <span className="text-sm font-medium">Support</span>
              </Link>
            </div>

            <nav className="space-y-4">
              {user ? (
                <>
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <Settings className="w-8 h-8" />
                    <span className="text-2xl font-bold">Profile</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <ShoppingBag className="w-8 h-8" />
                    <span className="text-2xl font-bold">Shop</span>
                  </Link>

                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3 w-full text-left"
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
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <ShoppingBag className="w-8 h-8" />
                    <span className="text-2xl font-bold">Shop</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Login</span>
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-white hover:text-white transition group py-3"
                  >
                    <User className="w-8 h-8" />
                    <span className="text-2xl font-bold">Register</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}
