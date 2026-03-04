import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ProductVariant } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddToCart,
  useAddToWishlist,
  useGetAllProducts,
  useGetWishlist,
} from "../hooks/useQueries";

export default function Wishlist() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: wishlist, isLoading: wishlistLoading } = useGetWishlist();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const isLoading = wishlistLoading || productsLoading;
  const wishlistProductIds = wishlist?.productIds ?? [];
  const wishlistProducts =
    products?.filter((p) => wishlistProductIds.some((id) => id === p.id)) ?? [];

  const handleMoveToCart = async (productId: bigint) => {
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    try {
      const variant: ProductVariant = { quantity: BigInt(1) };
      await addToCart.mutateAsync({ productId, quantity: BigInt(1), variant });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleRemove = async (productId: bigint) => {
    try {
      await addToWishlist.mutateAsync(productId);
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-3">
          Your Wishlist
        </h2>
        <p className="text-muted-foreground font-sans mb-6">
          Please login to view your wishlist
        </p>
        <Button
          onClick={login}
          className="bg-gold text-charcoal hover:bg-gold-light font-semibold"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl text-foreground mb-6">
          My Wishlist
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {["wl-sk-1", "wl-sk-2", "wl-sk-3", "wl-sk-4"].map((k) => (
            <Skeleton key={k} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-muted-foreground font-sans mb-6">
          Save items you love to your wishlist
        </p>
        <Button
          onClick={() => navigate({ to: "/products" })}
          className="bg-gold text-charcoal hover:bg-gold-light font-semibold"
        >
          Explore Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-gold text-xs font-sans uppercase tracking-[0.2em] mb-1">
          Saved Items
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          My Wishlist
        </h1>
        <p className="text-muted-foreground text-sm font-sans mt-1">
          {wishlistProducts.length} item
          {wishlistProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => {
          const discountedPrice =
            product.discountPercent > 0
              ? product.price * (1 - Number(product.discountPercent) / 100)
              : product.price;
          const imageUrl = product.imageUrls?.[0] || "";

          return (
            <div
              key={product.id.toString()}
              className="bg-card border border-border rounded-lg overflow-hidden group"
            >
              <button
                type="button"
                className="aspect-[3/4] overflow-hidden bg-muted cursor-pointer w-full"
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
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/300x400/1a1a1a/c9a84c?text=${encodeURIComponent(product.name.slice(0, 2))}`;
                  }}
                />
              </button>
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground font-sans">
                  {product.category}
                </p>
                <h3 className="text-sm font-sans font-medium text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-gold font-semibold text-sm">
                    ₹{discountedPrice.toFixed(0)}
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="text-muted-foreground text-xs line-through">
                      ₹{product.price.toFixed(0)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={() => handleMoveToCart(product.id)}
                    disabled={addToCart.isPending}
                    size="sm"
                    className="flex-1 bg-gold text-charcoal hover:bg-gold-light font-semibold text-xs h-8"
                  >
                    {addToCart.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleRemove(product.id)}
                    disabled={addToWishlist.isPending}
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 text-xs h-8 px-2"
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
