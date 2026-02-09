"use client"

import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, MessageSquare, Settings, ShoppingBag, ShoppingCart, Search, Headphones } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { siteConfig } from '@/lib/site-config';

interface SharedHeaderProps {
  showCart?: boolean;
  environment: 'react' | 'nextjs';
  // React Router specific props
  Link?: any;
  useNavigate?: any;
  useAuthStore?: any;
  useCartStore?: any;
  NotificationCenter?: any;
  // Next.js specific props
  supabase?: any;
  cartCount?: number;
  user?: any;
}

export default function SharedHeader({
  showCart = true,
  environment,
  Link,
  useNavigate,
  useAuthStore,
  useCartStore,
  NotificationCenter,
  supabase,
  cartCount: nextCartCount,
  user: nextUser
}: SharedHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get auth and cart data based on environment
  const navigate = environment === 'react' ? useNavigate?.() : null;
  const authData = environment === 'react' ? useAuthStore?.() : { user: nextUser };
  const cartData = environment === 'react' ? useCartStore?.() : { getItemCount: () => nextCartCount || 0 };
  
  const user = authData?.user;
  const cartCount = environment === 'react' ? cartData?.getItemCount() : nextCartCount || 0;
  const mainAppUrl = environment === 'nextjs' ? (process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl) : '';

  const handleLogout = async () => {
    try {
      if (environment === 'react') {
        await authData?.logout();
        toast.success('Logged out successfully');
        // Use hard navigation to clear all cached state
        window.location.href = '/';
      } else {
        const { error } = await supabase?.auth.signOut() || {};
        if (error) {
          console.error('Logout error:', error);
          toast.error('Failed to logout. Please try again.');
          return;
        }
        toast.success('Logged out successfully');
        window.location.href = mainAppUrl || '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery) {
      if (environment === 'react') {
        navigate?.(`/?search=${encodeURIComponent(searchQuery)}`);
      } else {
        window.location.href = `${mainAppUrl}/?search=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  // Component for links that works in both environments
  const LinkComponent = ({ href, children, onClick, className }: any) => {
    if (environment === 'react') {
      return <Link to={href} onClick={onClick} className={className}>{children}</Link>;
    } else {
      return <a href={href} onClick={onClick} className={className}>{children}</a>;
    }
  };

  return (
    <>
      {/* Fixed Header - Full Width */}
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-gray-800 shadow-sm z-30">
        <div className="w-full px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Logo and Title */}
            <LinkComponent href={environment === 'react' ? '/' : mainAppUrl} className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src={environment === 'nextjs' ? '/images/eagleonlywhite.svg' : '/images/eagleonlywhite.svg'}
                alt="MHP Logo" 
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <h1 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap hidden md:block">
                MODERN HEALTH PRO
              </h1>
              <h1 className="text-lg font-bold text-white whitespace-nowrap block md:hidden">
                MHP
              </h1>
            </LinkComponent>

            {/* Search Bar */}
            <div className="flex-1 relative hidden sm:block max-w-md mx-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Icon for Mobile */}
            <button 
              className="sm:hidden text-white hover:text-primary transition p-2"
              onClick={() => {
                if (environment === 'react') {
                  navigate?.('/search');
                } else {
                  window.location.href = `${mainAppUrl}/search`;
                }
              }}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* NotificationCenter */}
              {NotificationCenter && <NotificationCenter />}

              {/* Messages Icon */}
              <LinkComponent 
                href={environment === 'react' ? '/support' : `${mainAppUrl}/support`}
                className="hidden sm:block text-white hover:text-primary transition p-2"
              >
                <MessageSquare className="w-6 h-6" />
              </LinkComponent>

              {/* Shopping Cart */}
              {showCart && (
                <LinkComponent 
                  href={environment === 'react' ? '/cart' : '/cart'}
                  className="text-white hover:text-primary transition relative p-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </LinkComponent>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white hover:text-primary transition p-2"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[60px]" />

      {/* Overlay Menu - Identical for both */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-6 right-6 text-white hover:text-primary transition"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-md w-full px-8">
            {/* User Profile Section */}
            {user && (
              <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-gray-800">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center border-2 border-primary">
                  <User className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user.firstName} {user.lastName?.charAt(0)}
                  </h2>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-primary text-xs font-bold uppercase mt-1">{user.role}</p>
                </div>
              </div>
            )}

            <nav className="space-y-6">
              {user ? (
                <>
                  <LinkComponent
                    href={environment === 'react' ? '/dashboard' : `${mainAppUrl}/dashboard`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xl">Dashboard</span>
                  </LinkComponent>

                  <LinkComponent
                    href={environment === 'react' ? '/support' : `${mainAppUrl}/support`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xl">Support Messages</span>
                  </LinkComponent>

                  <LinkComponent
                    href={environment === 'react' ? '/support-chat' : `${mainAppUrl}/support-chat`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <Headphones className="w-6 h-6" />
                    <span className="text-xl">Customer Support</span>
                  </LinkComponent>

                  {user.role === 'admin' && (
                    <>
                      <LinkComponent
                        href={environment === 'react' ? '/admin' : `${mainAppUrl}/admin/dashboard`}
                        className="flex items-center space-x-4 text-white hover:text-primary transition group"
                        onClick={closeMenu}
                      >
                        <Settings className="w-6 h-6" />
                        <span className="text-xl">Admin Panel</span>
                      </LinkComponent>
                      <LinkComponent
                        href={environment === 'react' ? '/admin/support-ui' : `${mainAppUrl}/supportui`}
                        className="flex items-center space-x-4 text-white hover:text-primary transition group"
                        onClick={closeMenu}
                      >
                        <Headphones className="w-6 h-6" />
                        <span className="text-xl">Support Dashboard</span>
                      </LinkComponent>
                    </>
                  )}

                  {user.role === 'rep' && (
                    <LinkComponent
                      href={environment === 'react' ? '/rep/dashboard' : `${mainAppUrl}/rep/dashboard`}
                      className="flex items-center space-x-4 text-white hover:text-primary transition group"
                      onClick={closeMenu}
                    >
                      <Settings className="w-6 h-6" />
                      <span className="text-xl">Rep Dashboard</span>
                    </LinkComponent>
                  )}

                  <LinkComponent
                    href={environment === 'react' ? '/profile' : `${mainAppUrl}/profile`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-xl">Profile Settings</span>
                  </LinkComponent>

                  <LinkComponent
                    href={environment === 'react' ? '/' : mainAppUrl}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-xl">Continue Shopping</span>
                  </LinkComponent>

                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group w-full text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-xl">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <LinkComponent
                    href={environment === 'react' ? '/' : mainAppUrl}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-xl">Shop</span>
                  </LinkComponent>

                  <LinkComponent
                    href={environment === 'react' ? '/login' : `${mainAppUrl}/login`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xl">Login</span>
                  </LinkComponent>

                  <LinkComponent
                    href={environment === 'react' ? '/register' : `${mainAppUrl}/register`}
                    className="flex items-center space-x-4 text-white hover:text-primary transition group"
                    onClick={closeMenu}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-xl">Register</span>
                  </LinkComponent>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
