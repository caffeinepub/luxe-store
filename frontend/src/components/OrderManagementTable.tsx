import { Loader2 } from 'lucide-react';
import { useGetAllOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '../backend';
import { toast } from 'sonner';

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.placed]: 'Placed',
  [OrderStatus.confirmed]: 'Confirmed',
  [OrderStatus.shipped]: 'Shipped',
  [OrderStatus.outForDelivery]: 'Out for Delivery',
  [OrderStatus.delivered]: 'Delivered',
  [OrderStatus.cancelled]: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.placed]: 'border-blue-400/40 text-blue-400',
  [OrderStatus.confirmed]: 'border-yellow-400/40 text-yellow-400',
  [OrderStatus.shipped]: 'border-purple-400/40 text-purple-400',
  [OrderStatus.outForDelivery]: 'border-orange-400/40 text-orange-400',
  [OrderStatus.delivered]: 'border-green-400/40 text-green-400',
  [OrderStatus.cancelled]: 'border-red-400/40 text-red-400',
};

const UPDATABLE_STATUSES = [
  { value: OrderStatus.confirmed, label: 'Confirmed' },
  { value: OrderStatus.shipped, label: 'Shipped' },
  { value: OrderStatus.outForDelivery, label: 'Out for Delivery' },
  { value: OrderStatus.delivered, label: 'Delivered' },
  { value: OrderStatus.cancelled, label: 'Cancelled' },
];

export default function OrderManagementTable() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: bigint, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const sortedOrders = [...(orders ?? [])].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-sans">{sortedOrders.length} orders</p>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="text-muted-foreground text-xs font-sans">Order ID</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Date</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Items</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Total</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs font-sans">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id.toString()} className="border-border hover:bg-muted/50">
                <TableCell>
                  <p className="text-sm font-sans font-medium text-foreground">#{order.id.toString()}</p>
                  <p className="text-xs text-muted-foreground font-mono">{order.userId.toString().slice(0, 12)}...</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-muted-foreground font-sans">
                    {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-sans text-foreground">{order.items.length}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-sans text-gold font-medium">₹{order.totalAmount.toFixed(0)}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${STATUS_COLORS[order.status] ?? 'border-border text-muted-foreground'}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-40 h-8 text-xs bg-card border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {UPDATABLE_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value} className="text-foreground text-xs">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {sortedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8 font-sans text-sm">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
