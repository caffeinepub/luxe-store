import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export default function Footer() {
  const hostname = window.location.hostname;
  const appId = encodeURIComponent(hostname || "thezuro");

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/brand-logo.dim_256x256.png"
                alt="TheZuro"
                className="h-10 w-10 object-contain rounded-full"
              />
              <span className="font-display text-xl font-bold text-primary">
                TheZuro
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover premium fashion, exquisite jewelry, and luxury fragrances
              curated for the discerning shopper.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Clothes" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Clothes
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Jewelry" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Jewelry
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: "Perfumes" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Perfumes
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TheZuro. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-primary fill-primary" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
