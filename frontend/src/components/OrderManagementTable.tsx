import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGetAllOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { OrderStatus } from '../backend';

const statusColors: Record<string, string> = {
  placed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  confirmed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  outForDelivery: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function OrderManagementTable() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return <div className="text-muted-foreground text-sm py-8 text-center">Loading orders...</div>;
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-foreground font-semibold">Order ID</TableHead>
            <TableHead className="text-foreground font-semibold">Items</TableHead>
            <TableHead className="text-foreground font-semibold">Total</TableHead>
            <TableHead className="text-foreground font-semibold">Status</TableHead>
            <TableHead className="text-foreground font-semibold">Date</TableHead>
            <TableHead className="text-foreground font-semibold">Update Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const statusKey = String(order.status);
              return (
                <TableRow key={order.id.toString()} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${statusColors[statusKey] || ''}`}
                    >
                      {statusKey}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={statusKey}
                      onValueChange={(val) =>
                        updateStatus.mutate({
                          orderId: order.id,
                          status: val as OrderStatus,
                        })
                      }
                    >
                      <SelectTrigger className="w-36 h-8 text-xs bg-muted border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="outForDelivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
