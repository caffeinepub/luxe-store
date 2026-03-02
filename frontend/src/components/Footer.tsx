/**
 * Footer.tsx — Site footer with navigation links, social icons, and branding.
 */
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { SiInstagram, SiFacebook, SiX, SiPinterest } from 'react-icons/si';

const SHOP_LINKS = [
  { label: 'All Products', to: '/products' },
  { label: 'Clothing',     to: '/products?category=Clothing' },
  { label: 'Jewelry',      to: '/products?category=Jewelry' },
  { label: 'Perfumes',     to: '/products?category=Perfumes' },
];

const ACCOUNT_LINKS = [
  { label: 'My Profile',  to: '/profile' },
  { label: 'My Orders',   to: '/orders' },
  { label: 'Wishlist',    to: '/wishlist' },
  { label: 'Cart',        to: '/cart' },
];

const SOCIAL_LINKS = [
  { icon: SiInstagram, href: '#', label: 'Instagram' },
  { icon: SiFacebook,  href: '#', label: 'Facebook' },
  { icon: SiX,         href: '#', label: 'X (Twitter)' },
  { icon: SiPinterest, href: '#', label: 'Pinterest' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'luxe-store');

  return (
    <footer className="bg-charcoal-900 text-charcoal-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/brand-logo.dim_256x256.png"
                alt="Luxe Store"
                className="h-8 w-8 object-contain"
              />
              <span className="font-serif text-xl font-semibold text-white">
                Luxe Store
              </span>
            </Link>
            <p className="text-sm text-charcoal-400 leading-relaxed mb-4">
              Curated luxury for the discerning individual. Discover timeless pieces
              crafted with exceptional quality.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-8 w-8 rounded-full bg-charcoal-700 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to as never}
                    className="text-sm text-charcoal-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to as never}
                    className="text-sm text-charcoal-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-charcoal-400 cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-charcoal-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-500">
          <p>© {year} Luxe Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <Heart className="h-3 w-3 fill-accent text-accent" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
