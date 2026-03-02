/**
 * Header.tsx — Sticky navigation header with logo, nav links,
 * search bar, cart badge, wishlist, profile, admin, and login/logout.
 */
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Shield,
  LogOut,
  LogIn,
  Loader2,
} from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCart } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const NAV_LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Clothing',     to: '/products?category=Clothing' },
  { label: 'Jewelry',      to: '/products?category=Jewelry' },
  { label: 'Perfumes',     to: '/products?category=Perfumes' },
];

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: cart } = useGetCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const cartCount = cart?.items?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery.trim() } as never });
      setSearchQuery('');
    }
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/brand-logo.dim_256x256.png"
              alt="Luxe Store"
              className="h-9 w-9 object-contain"
            />
            <span className="font-serif text-xl font-semibold tracking-wide text-foreground hidden sm:block">
              Luxe Store
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to as never}
                className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Search ───────────────────────────────────────── */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-secondary border-border text-sm"
              />
            </div>
          </form>

          {/* ── Actions ──────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            {isAuthenticated && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAuth} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {isLoggingIn ? 'Logging in…' : 'Login'}
                </span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </form>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <Link
                        to={link.to as never}
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="my-2 border-t border-border" />
                  {isAuthenticated && (
                    <>
                      <SheetClose asChild>
                        <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                          Profile
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                          My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/wishlist" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors">
                          Wishlist
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
