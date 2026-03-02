import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAllProducts, useDeleteProduct } from '../hooks/useQueries';
import ProductFormModal from './ProductFormModal';
import type { Product } from '../backend';

export default function ProductManagementTable() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) {
    return <div className="text-muted-foreground text-sm py-8 text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddModal(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">Category</TableHead>
              <TableHead className="text-foreground font-semibold">Price</TableHead>
              <TableHead className="text-foreground font-semibold">Stock</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No products yet. Add your first product!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id.toString()} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.imageUrls[0] || '/assets/generated/hero-banner-1.dim_1200x500.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-foreground text-sm line-clamp-2 max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{product.category}</TableCell>
                  <TableCell className="text-foreground font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{Number(product.stock)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditProduct(product)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProduct.mutate(product.id)}
                        disabled={deleteProduct.isPending}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        product={null}
      />
      <ProductFormModal
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        product={editProduct}
      />
    </div>
  );
}
