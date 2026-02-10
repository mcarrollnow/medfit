"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import { Menu, X, User, LogOut, MessageSquare, Settings, ShoppingBag, ShoppingCart, Search, Headphones, LayoutDashboard, Users, UserCheck, Package, Percent, Trophy, Link2, BarChart3, Wallet, Globe, ArrowLeft, Construction, CreditCard, Ticket, Mail, Truck, Bot, Banknote, FileText, Database, ScrollText, Shield, Calculator, Eye } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useSupplyStoreCart } from '@/lib/supply-store/cart';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useImpersonationStore } from '@/lib/impersonation-store';
import { toast } from 'react-hot-toast';
import NotificationCenter from './notification-center';
import { getOpenTicketCount } from '@/app/actions/support';

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

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "View As", href: "/admin/view-as", icon: Eye },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Get Paid", href: "/admin/get-paid", icon: Banknote },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Invoices", href: "/admin/stripe/invoices", icon: FileText },
  { title: "Payment Links", href: "/admin/stripe/payment-links", icon: Link2 },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Sales Reps", href: "/admin/reps", icon: UserCheck },
  { title: "Pricing Formula", href: "/admin/pricing-formula", icon: Calculator },
  { title: "Support", href: "/admin/support", icon: Ticket },
  { title: "Inventory", href: "/admin/inventory", icon: Package },
  { title: "Shipments", href: "/admin/shipments", icon: Truck },
  { title: "Email Tracking", href: "/admin/tracking", icon: Mail },
  { title: "AI Agents", href: "/admin/ai-agents", icon: Bot },
  { title: "Discounts", href: "/admin/discounts", icon: Percent },
  { title: "Rewards", href: "/admin/rewards", icon: Trophy },
  { title: "Referrals", href: "/admin/referrals", icon: Link2 },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Maintenance", href: "/admin/maintenance", icon: Construction },
  { title: "Settings", href: "/admin/settings", icon: Settings },
  { title: "Wallets", href: "/admin/wallets", icon: Wallet },
  { title: "Website", href: "/admin/website", icon: Globe },
  { title: "Policies", href: "/admin/policy", icon: ScrollText },
  { title: "PCI Scan", href: "/admin/pci-scan", icon: Shield },
  { title: "Supabase", href: "/admin/supabase", icon: Database },
  { title: "Supplier Shipments", href: "/admin/supplier-shipments", icon: Package },
  { title: "Supplier", href: "/supplier", icon: Truck },
];

const supplierNavItems = [
  { title: "Dashboard", href: "/supplier", icon: LayoutDashboard },
  { title: "Orders", href: "/supplier/orders", icon: ShoppingCart },
  { title: "Customers", href: "/supplier/customers", icon: Users },
  { title: "Ship Product", href: "/supplier/ship-product", icon: Truck },
  { title: "Inventory", href: "/supplier/inventory", icon: Package },
  { title: "Payments", href: "/supplier/payments", icon: CreditCard },
];

export default function GlobalNav({ showCart = true }: GlobalNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const { getItemCount, fetchCart } = useCartStore();
  const cartCount = getItemCount();
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const { isImpersonating } = useImpersonationStore();

  // Detect if we're on admin or supplier routes
  const isAdminRoute = pathname?.startsWith('/admin');
  const isSupplierRoute = pathname?.startsWith('/supplier');

  // Use relative URLs for development, absolute for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const mainAppUrl = isDevelopment ? '' : (process.env.NEXT_PUBLIC_MAIN_APP_URL || siteConfig.appUrl);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch actual user data from database to get correct role
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, first_name, last_name, role, profile_picture_url')
          .eq('auth_id', session.user.id)
          .single();
        
        setUser({
          id: dbUser?.id || session.user.id,
          authId: session.user.id,
          email: session.user.email || '',
          firstName: dbUser?.first_name || session.user.user_metadata?.first_name || 'User',
          lastName: dbUser?.last_name || session.user.user_metadata?.last_name || '',
          role: dbUser?.role || session.user.user_metadata?.role || 'customer',
          profilePictureUrl: dbUser?.profile_picture_url || session.user.user_metadata?.profile_picture_url
        });
        // Fetch cart items when user is logged in
        fetchCart();
      }
    }
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Fetch actual user data from database to get correct role
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, first_name, last_name, role, profile_picture_url')
          .eq('auth_id', session.user.id)
          .single();
        
        setUser({
          id: dbUser?.id || session.user.id,
          authId: session.user.id,
          email: session.user.email || '',
          firstName: dbUser?.first_name || session.user.user_metadata?.first_name || 'User',
          lastName: dbUser?.last_name || session.user.user_metadata?.last_name || '',
          role: dbUser?.role || session.user.user_metadata?.role || 'customer',
          profilePictureUrl: dbUser?.profile_picture_url || session.user.user_metadata?.profile_picture_url
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch open ticket count for admins
  const isAdminOrSuperadmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  useEffect(() => {
    async function fetchTicketCount() {
      if (isAdminRoute && isAdminOrSuperadmin) {
        const count = await getOpenTicketCount();
        setOpenTicketCount(count);
      }
    }
    fetchTicketCount();
    
    // Refresh every 30 seconds when on admin routes
    const interval = isAdminRoute && isAdminOrSuperadmin 
      ? setInterval(fetchTicketCount, 30000) 
      : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAdminRoute, isAdminOrSuperadmin]);

  const handleLogout = async () => {
    try {
      // Clear local state first to prevent UI flicker
      setUser(null);
      
      // Clear cart store states
      useCartStore.setState({ items: [] });
      useSupplyStoreCart.setState({ items: [] });
      
      // Clear all localStorage items (nuclear option to ensure clean slate)
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
        } catch {}
        
        // Clear session storage
        try {
          sessionStorage.clear();
        } catch {}
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, still redirect since we cleared local state
      }
      
      toast.success('Logged out successfully');
      
      // Use hard navigation to clear all cached state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even on error - we've cleared local state
      window.location.href = '/';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Header - Chronicles Glass Style */}
      <header className={`fixed left-0 right-0 bg-background glass-card border-x-0 border-t-0 rounded-none z-50 ${isImpersonating ? 'top-10' : 'top-0'}`} style={{ paddingTop: isImpersonating ? '0px' : 'env(safe-area-inset-top, 0px)' }}>
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Logo and Title */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <img
                src="/icon.svg"
                alt="MHP Logo"
                className="w-8 h-8"
              />
              <h1 className="text-lg md:text-xl font-serif font-light tracking-tight text-foreground whitespace-nowrap hidden md:block">
                MODERN HEALTH PRO
              </h1>
              <h1 className="text-base font-serif font-light text-foreground whitespace-nowrap block md:hidden">
                MHP
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-2.5 glass-button rounded-2xl text-foreground placeholder-muted-foreground focus:border-border focus:outline-none transition text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `${mainAppUrl}/?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Right Side Icons - Support, Notifications, Cart and Hamburger */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* View As - Admin only */}
              {isAdminOrSuperadmin && (
                <Link 
                  href="/admin/view-as" 
                  className={`text-muted-foreground hover:text-foreground transition ${isImpersonating ? 'text-foreground' : ''}`}
                  title="View As Customer"
                >
                  <Eye className="w-5 h-5" />
                </Link>
              )}

              {/* Support Tickets - Admin only */}
              {isAdminRoute && isAdminOrSuperadmin && (
                <Link 
                  href="/admin/support" 
                  className="text-muted-foreground hover:text-foreground transition relative"
                  title="Support Tickets"
                >
                  <Ticket className="w-5 h-5" />
                  {openTicketCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-4 h-4 flex items-center justify-center font-mono text-[10px]">
                      {openTicketCount > 9 ? '9+' : openTicketCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Notifications */}
              {user && <NotificationCenter />}

              {/* Shopping Cart */}
              {showCart && (
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-4 h-4 flex items-center justify-center font-mono text-[10px]">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-muted-foreground hover:text-foreground transition"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Menu - Chronicles Style */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9999] bg-background overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="fixed top-6 right-6 text-muted-foreground hover:text-foreground transition z-[10000]"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="min-h-full flex flex-col justify-center py-16 px-8">
            <div className="max-w-md w-full mx-auto">
            {/* User Profile Section */}
            {user && (
              <div className="flex items-center space-x-4 mb-16 pb-8 border-b border-border">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-14 h-14 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full glass-button flex items-center justify-center">
                    <User className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h2 className="font-serif text-xl font-light text-foreground">
                    {user.firstName} {user.lastName?.charAt(0)}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mt-1">{user.role}</p>
                </div>
              </div>
            )}

            {/* Action Icons Row - hide on admin routes since admin nav has these */}
            {!isAdminRoute && (
              <div className="flex items-center justify-center gap-12 mb-12 pb-8 border-b border-border">
                <Link
                  href="/support"
                  onClick={closeMenu}
                  className="flex flex-col items-center space-y-3 text-muted-foreground hover:text-foreground transition group"
                >
                  <div className="glass-button rounded-2xl p-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono tracking-widest uppercase">Messages</span>
                </Link>

                <Link
                  href="/support-chat"
                  onClick={closeMenu}
                  className="flex flex-col items-center space-y-3 text-muted-foreground hover:text-foreground transition group"
                >
                  <div className="glass-button rounded-2xl p-4">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono tracking-widest uppercase">Support</span>
                </Link>
              </div>
            )}

            <nav className="space-y-2">
              {isAdminRoute ? (
                /* Admin Menu Items */
                <>
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        prefetch={false}
                        className={`flex items-center space-x-4 transition group py-3 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-serif text-xl font-light">{item.title}</span>
                      </Link>
                    );
                  })}

                  {/* Separator */}
                  <div className="w-full h-px bg-border my-6" />

                  {/* Back to Store */}
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Back to Store</span>
                  </Link>

                  <button
                    onClick={async () => {
                      closeMenu();
                      await handleLogout();
                    }}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3 w-full text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Logout</span>
                  </button>
                </>
              ) : isSupplierRoute ? (
                /* Supplier Menu Items */
                <>
                  {supplierNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/supplier" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        prefetch={false}
                        className={`flex items-center space-x-4 transition group py-3 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-serif text-xl font-light">{item.title}</span>
                      </Link>
                    );
                  })}

                  {/* Separator */}
                  <div className="w-full h-px bg-border my-6" />

                  {/* Back to Store */}
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Back to Store</span>
                  </Link>

                  <button
                    onClick={async () => {
                      closeMenu();
                      await handleLogout();
                    }}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3 w-full text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Logout</span>
                  </button>
                </>
              ) : user ? (
                /* Logged-in User Menu Items */
                <>
                  <Link
                    href={(user.role === 'admin' || user.role === 'superadmin') ? '/admin' : user.role === 'supplier' ? '/supplier' : '/dashboard'}
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Profile</span>
                  </Link>

                  <Link
                    href="/wallet"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Wallets</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Shop</span>
                  </Link>

                  <button
                    onClick={async () => {
                      closeMenu();
                      await handleLogout();
                    }}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3 w-full text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Logout</span>
                  </button>
                </>
              ) : (
                /* Guest Menu Items */
                <>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Shop</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Login</span>
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition group py-3"
                  >
                    <User className="w-6 h-6" />
                    <span className="font-serif text-xl font-light">Register</span>
                  </Link>
                </>
              )}
            </nav>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header (extra space when impersonating) */}
      <div className={isImpersonating ? "h-28 sm:h-32" : "h-16 sm:h-20"}></div>
    </>
  );
}
