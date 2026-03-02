import { Loader2 } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManagementTable from '../components/ProductManagementTable';
import OrderManagementTable from '../components/OrderManagementTable';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Button } from '@/components/ui/button';

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-foreground mb-3">Admin Panel</h2>
        <p className="text-muted-foreground font-sans mb-6">Please login to access the admin panel</p>
        <Button onClick={login} className="bg-gold text-charcoal hover:bg-gold-light font-semibold">
          Login to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-gold text-xs font-sans uppercase tracking-[0.2em] mb-1">Management</p>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Admin Panel</h1>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="bg-muted border border-border mb-6">
          <TabsTrigger value="products" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal font-sans text-sm">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-gold data-[state=active]:text-charcoal font-sans text-sm">
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManagementTable />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagementTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
