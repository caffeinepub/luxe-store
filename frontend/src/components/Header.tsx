import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Heart, User, Search, Menu, X, Shield } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: cart } = useGetCart();
  const cartCount = cart?.items?.length ?? 0;

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery.trim() } });
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/brand-logo.dim_256x256.png"
              alt="Luxe Store"
              className="h-10 w-10 object-contain rounded-full"
            />
            <span className="font-display text-xl font-bold text-primary hidden sm:block">
              Luxe Store
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/products"
              search={{ category: 'Clothes' }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Clothes
            </Link>
            <Link
              to="/products"
              search={{ category: 'Jewelry' }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Jewelry
            </Link>
            <Link
              to="/products"
              search={{ category: 'Perfumes' }}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Perfumes
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <Shield className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
            <Button
              onClick={handleAuth}
              disabled={loginStatus === 'logging-in'}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className={isAuthenticated ? '' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link
                to="/products"
                className="text-sm font-medium text-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                to="/products"
                search={{ category: 'Clothes' }}
                className="text-sm font-medium text-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Clothes
              </Link>
              <Link
                to="/products"
                search={{ category: 'Jewelry' }}
                className="text-sm font-medium text-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jewelry
              </Link>
              <Link
                to="/products"
                search={{ category: 'Perfumes' }}
                className="text-sm font-medium text-foreground hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Perfumes
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="text-sm font-medium text-foreground hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-foreground hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
