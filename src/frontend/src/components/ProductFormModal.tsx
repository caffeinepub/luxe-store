import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { Product } from "../backend";
import { useAddProduct, useUpdateProduct } from "../hooks/useQueries";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

const emptyProduct: Omit<Product, "id" | "createdAt"> = {
  name: "",
  description: "",
  category: "",
  subCategory: "",
  imageUrls: [],
  price: 0,
  discountPercent: 0n,
  stock: 0n,
  variants: [],
};

export default function ProductFormModal({
  open,
  onClose,
  product,
}: ProductFormModalProps) {
  const [form, setForm] = useState(emptyProduct);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        imageUrls: product.imageUrls,
        price: product.price,
        discountPercent: product.discountPercent,
        stock: product.stock,
        variants: product.variants,
      });
      setImageUrlInput(product.imageUrls.join("\n"));
    } else {
      setForm(emptyProduct);
      setImageUrlInput("");
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = imageUrlInput
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    const productData: Product = {
      ...form,
      id: product?.id ?? 0n,
      imageUrls,
      createdAt: product?.createdAt ?? BigInt(Date.now()) * 1_000_000n,
    };

    if (product) {
      updateProduct.mutate(
        { id: product.id, product: productData },
        { onSuccess: onClose },
      );
    } else {
      addProduct.mutate(productData, { onSuccess: onClose });
    }
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-surface border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Product Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                className="bg-muted border-border"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Product description"
                className="bg-muted border-border resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Category *
              </Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Clothes"
                className="bg-muted border-border"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Sub Category
              </Label>
              <Input
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                placeholder="e.g. Dresses"
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Price ($) *
              </Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-muted border-border"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Discount (%)
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={Number(form.discountPercent)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountPercent: BigInt(
                      Number.parseInt(e.target.value) || 0,
                    ),
                  })
                }
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Stock
              </Label>
              <Input
                type="number"
                min={0}
                value={Number(form.stock)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: BigInt(Number.parseInt(e.target.value) || 0),
                  })
                }
                className="bg-muted border-border"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium text-foreground mb-1 block">
                Image URLs (one per line)
              </Label>
              <Textarea
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/image1.jpg"
                className="bg-muted border-border resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
