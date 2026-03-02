/**
 * useQueries.ts — All React Query hooks for backend interactions.
 * Encapsulates products, user profile, cart, wishlist, orders, and reviews.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  Product,
  ProductId,
  UserProfile,
  CartItem,
  ShippingAddress,
  PaymentMethod,
  OrderId,
  OrderStatus,
} from '@/backend';

/* ═══════════════════════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════════════════════ */

/** Fetch all products from the backend. */
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Fetch a single product by ID. */
export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}

/** Search products by keyword. */
export function useSearchProducts(keyword: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', keyword],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

/** Add a new product (admin only). */
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ProductId, Error, Product>({
    mutationFn: async (product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/** Update an existing product (admin only). */
export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: ProductId; product: Product }>({
    mutationFn: async ({ id, product }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, product);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id.toString()] });
    },
  });
}

/** Delete a product (admin only). */
export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

/* ═══════════════════════════════════════════════════════════
   USER PROFILE
═══════════════════════════════════════════════════════════ */

/** Fetch the current caller's user profile. Returns null if none exists. */
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/** Save the current caller's user profile. */
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

/** Check if the current caller is an admin. */
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

/* ═══════════════════════════════════════════════════════════
   CART
═══════════════════════════════════════════════════════════ */

/** Fetch the cart for the current user. */
export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['cart', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Not authenticated');
      const principal = identity.getPrincipal();
      try {
        return await actor.getCart(principal);
      } catch {
        // Cart not found — return empty cart
        return { userId: principal, items: [] };
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

/** Add an item to the cart. */
export function useAddToCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation<void, Error, CartItem>({
    mutationFn: async (item) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart', identity?.getPrincipal().toString()],
      });
    },
  });
}

/* ═══════════════════════════════════════════════════════════
   WISHLIST
═══════════════════════════════════════════════════════════ */

/** Fetch the wishlist for the current user. */
export function useGetWishlist() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['wishlist', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Not authenticated');
      const principal = identity.getPrincipal();
      try {
        return await actor.getWishlist(principal);
      } catch {
        // Wishlist not found — return empty wishlist
        return { userId: principal, productIds: [] };
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

/** Add a product to the wishlist. */
export function useAddToWishlist() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductId>({
    mutationFn: async (productId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', identity?.getPrincipal().toString()],
      });
    },
  });
}

/* ═══════════════════════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════════════════════ */

/** Place a new order. */
export function usePlaceOrder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation<
    OrderId,
    Error,
    {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
      totalAmount: number;
    }
  >({
    mutationFn: async ({ items, shippingAddress, paymentMethod, totalAmount }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(items, shippingAddress, paymentMethod, totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders', identity?.getPrincipal().toString()],
      });
      // Clear cart after order
      queryClient.invalidateQueries({
        queryKey: ['cart', identity?.getPrincipal().toString()],
      });
    },
  });
}

/** Fetch a single order by ID. */
export function useGetOrder(orderId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['order', orderId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!identity && orderId > 0n,
  });
}

/** Fetch all orders for the current user. */
export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['orders', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Not authenticated');
      return actor.getUserOrders(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

/** Fetch all orders (admin only). */
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

/** Update an order's status (admin only). */
export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: OrderId; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId.toString()] });
    },
  });
}

/* ═══════════════════════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════════════════════ */

/** Fetch all reviews for a product. */
export function useGetProductReviews(productId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['reviews', productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && productId > 0n,
  });
}

/** Add a review for a product. */
export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    bigint,
    Error,
    { productId: bigint; rating: bigint; comment: string }
  >({
    mutationFn: async ({ productId, rating, comment }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(productId, rating, comment);
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId.toString()] });
    },
  });
}
