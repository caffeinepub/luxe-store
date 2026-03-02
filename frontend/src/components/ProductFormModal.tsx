import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Product } from '../backend';
import { useAddProduct, useUpdateProduct } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFormModalProps {
  mode: 'create' | 'edit';
  product?: Product;
  onClose: () => void;
}

const CATEGORIES = ['Clothes', 'Perfumes', 'Jewelry'];
const SUB_CATEGORIES: Record<string, string[]> = {
  Clothes: ['Men', 'Women', 'Kids'],
  Perfumes: ['Floral', 'Woody', 'Fresh', 'Oriental'],
  Jewelry: ['Necklaces', 'Rings', 'Earrings', 'Bracelets'],
};

export default function ProductFormModal({ mode, product, onClose }: ProductFormModalProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [category, setCategory] = useState(product?.category ?? 'Clothes');
  const [subCategory, setSubCategory] = useState(product?.subCategory ?? '');
  const [imageUrlsText, setImageUrlsText] = useState(product?.imageUrls?.join('\n') ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [discountPercent, setDiscountPercent] = useState(product?.discountPercent?.toString() ?? '0');
  const [stock, setStock] = useState(product?.stock?.toString() ?? '');
  const [variants, setVariants] = useState<{ size: string; color: string; quantity: string }[]>(
    product?.variants?.map((v) => ({
      size: v.size ?? '',
      color: v.color ?? '',
      quantity: v.quantity?.toString() ?? '0',
    })) ?? []
  );

  const inputClass = "bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60 h-9 text-sm";

  const addVariant = () => setVariants([...variants, { size: '', color: '', quantity: '1' }]);
  const removeVariant = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: string, val: string) => {
    setVariants(variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const imageUrls = imageUrlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    const productData: Product = {
      id: product?.id ?? BigInt(0),
      name,
      description,
      category,
      subCategory,
      imageUrls,
      price: parseFloat(price),
      discountPercent: BigInt(parseInt(discountPercent) || 0),
      stock: BigInt(parseInt(stock)),
      variants: variants.map((v) => ({
        size: v.size || undefined,
        color: v.color || undefined,
        quantity: BigInt(parseInt(v.quantity) || 0),
      })),
      createdAt: product?.createdAt ?? BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      if (mode === 'create') {
        await addProduct.mutateAsync(productData);
        toast.success('Product added successfully!');
      } else if (product) {
        await updateProduct.mutateAsync({ id: product.id, product: productData });
        toast.success('Product updated successfully!');
      }
      onClose();
    } catch {
      toast.error('Failed to save product. Make sure you are an admin.');
    }
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-serif text-xl text-foreground">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-foreground/80 text-xs">Product Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Silk Evening Dress" className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs">Category *</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v); setSubCategory(''); }}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-foreground text-sm">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs">Sub-Category</Label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {(SUB_CATEGORIES[category] ?? []).map((s) => (
                      <SelectItem key={s} value={s} className="text-foreground text-sm">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs">Price (₹) *</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2999" className={inputClass} required min="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground/80 text-xs">Discount %</Label>
                <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="0" className={inputClass} min="0" max="100" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-foreground/80 text-xs">Stock *</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" className={inputClass} required min="0" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-foreground/80 text-xs">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60 text-sm resize-none"
                  rows={3}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-foreground/80 text-xs">Image URLs (one per line)</Label>
                <Textarea
                  value={imageUrlsText}
                  onChange={(e) => setImageUrlsText(e.target.value)}
                  placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-gold/60 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-foreground/80 text-xs">Variants</Label>
                <Button type="button" onClick={addVariant} variant="ghost" size="sm" className="text-gold hover:text-gold-light text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="Size (S/M/L)" className={`${inputClass} flex-1`} />
                  <Input value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Color" className={`${inputClass} flex-1`} />
                  <Input type="number" value={v.quantity} onChange={(e) => updateVariant(i, 'quantity', e.target.value)} placeholder="Qty" className={`${inputClass} w-16`} min="0" />
                  <Button type="button" onClick={() => removeVariant(i)} variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-gold text-charcoal hover:bg-gold-light font-semibold">
              {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : mode === 'create' ? 'Add Product' : 'Save Changes'}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
