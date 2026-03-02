/**
 * App.tsx — Main application component with TanStack Router setup,
 * all route definitions, QueryClientProvider, and ThemeProvider.
 * Order tracking route is /orders/$orderId (not /order-tracking/$orderId).
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileSetupModal from '@/components/ProfileSetupModal';

import Home from '@/pages/Home';
import ProductListing from '@/pages/ProductListing';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderHistory from '@/pages/OrderHistory';
import OrderTracking from '@/pages/OrderTracking';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import SearchResults from '@/pages/SearchResults';

/* ── Query Client ─────────────────────────────────────────── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

/* ── Layout ───────────────────────────────────────────────── */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ProfileSetupModal />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

/* ── 404 ──────────────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-serif text-6xl text-accent">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-accent text-accent-foreground rounded-sm font-medium hover:bg-gold-600 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

/* ── Routes ───────────────────────────────────────────────── */
const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductListing,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: Wishlist,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmation,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistory,
});

// Order tracking lives at /orders/$orderId (not /order-tracking/$orderId)
const orderTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  component: OrderTracking,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchResults,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
});

/* ── Router ───────────────────────────────────────────────── */
const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  wishlistRoute,
  checkoutRoute,
  orderConfirmationRoute,
  orderHistoryRoute,
  orderTrackingRoute,
  profileRoute,
  adminRoute,
  searchRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/* ── App ──────────────────────────────────────────────────── */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
