import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddToCart,
  useAddToWishlist,
  useGetWishlist,
} from "../hooks/useQueries";

interface ProductCardProps {
  product: Product;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-luxury">
      <Skeleton className="h-56 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: wishlist } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const isWishlisted =
    wishlist?.productIds?.some((id) => id === product.id) ?? false;
  const discountedPrice =
    product.discountPercent > 0
      ? product.price * (1 - Number(product.discountPercent) / 100)
      : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    addToCart.mutate({
      productId: product.id,
      quantity: 1n,
      variant: { quantity: 1n },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    addToWishlist.mutate(product.id);
  };

  return (
    <button
      type="button"
      onClick={() =>
        navigate({
          to: "/products/$productId",
          params: { productId: product.id.toString() },
        })
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate({
            to: "/products/$productId",
            params: { productId: product.id.toString() },
          });
        }
      }}
      className="bg-surface rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 cursor-pointer group w-full text-left"
    >
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img
          src={
            product.imageUrls[0] ||
            "/assets/generated/hero-banner-1.dim_1200x500.png"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
            -{Number(product.discountPercent)}%
          </span>
        )}
        {isAuthenticated && (
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isWishlisted
                ? "bg-primary text-primary-foreground"
                : "bg-black/40 text-white hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-muted-foreground text-xs line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </button>
  );
}
