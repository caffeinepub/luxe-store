import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useGetAllProducts, useDeleteProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../backend';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProductManagementTable() {
  const { data: products, isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground font-sans">{products?.length ?? 0} products</p>
        <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-gold text-charcoal hover:bg-gold-light font-semibold text-xs">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="text-muted-foreground text-xs font-sans">Product</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Category</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Price</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Stock</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id.toString()} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                      {product.imageUrls?.[0] ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-sans font-medium text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-sans">ID: {product.id.toString()}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs border-gold/30 text-gold">{product.category}</Badge>
                  {product.subCategory && (
                    <p className="text-xs text-muted-foreground mt-0.5">{product.subCategory}</p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-sans text-foreground">₹{product.price.toFixed(0)}</p>
                  {product.discountPercent > 0 && (
                    <p className="text-xs text-gold">-{Number(product.discountPercent)}%</p>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-sans ${Number(product.stock) < 10 ? 'text-destructive' : 'text-foreground'}`}>
                    {Number(product.stock)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-gold"
                      onClick={() => setEditProduct(product)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-foreground">Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground font-sans">
                            This action cannot be undone. "{product.name}" will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border text-foreground">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!products || products.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8 font-sans text-sm">
                  No products yet. Add your first product!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductFormModal mode="create" onClose={() => setShowAddModal(false)} />
      )}
      {editProduct && (
        <ProductFormModal mode="edit" product={editProduct} onClose={() => setEditProduct(null)} />
      )}
    </div>
  );
}
