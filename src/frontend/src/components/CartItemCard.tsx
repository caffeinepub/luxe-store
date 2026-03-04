import { Trash2 } from "lucide-react";
import type { CartItem, Product } from "../backend";
import QuantityPicker from "./QuantityPicker";

interface CartItemCardProps {
  item: CartItem;
  product: Product;
  onQuantityChange: (item: CartItem, newQty: number) => void;
  onRemove: (item: CartItem) => void;
}

export default function CartItemCard({
  item,
  product,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const discountedPrice =
    product.discountPercent > 0
      ? product.price * (1 - Number(product.discountPercent) / 100)
      : product.price;

  const itemTotal = discountedPrice * Number(item.quantity);

  return (
    <div className="flex gap-4 p-4 bg-surface rounded-xl shadow-luxury">
      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
        <img
          src={
            product.imageUrls[0] ||
            "/assets/generated/hero-banner-1.dim_1200x500.png"
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        {(item.variant.size || item.variant.color) && (
          <p className="text-xs text-muted-foreground mb-2">
            {item.variant.size && `Size: ${item.variant.size}`}
            {item.variant.size && item.variant.color && " · "}
            {item.variant.color && `Color: ${item.variant.color}`}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <QuantityPicker
            value={Number(item.quantity)}
            min={1}
            max={Number(product.stock)}
            onChange={(qty) => onQuantityChange(item, qty)}
          />
          <div className="text-right">
            <p className="font-bold text-primary">${itemTotal.toFixed(2)}</p>
            {product.discountPercent > 0 && (
              <p className="text-xs text-muted-foreground line-through">
                ${(product.price * Number(item.quantity)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
