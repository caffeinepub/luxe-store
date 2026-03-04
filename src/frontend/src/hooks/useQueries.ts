import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Cart,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductId,
  Review,
  ShippingAddress,
  UserProfile,
  Wishlist,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: ProductId) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useSearchProducts(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["search", keyword],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      product,
    }: { id: ProductId; product: Product }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Cart | null>({
    queryKey: ["cart", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const principal = identity.getPrincipal();
      try {
        return await actor.getCart(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToCart(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "cart",
          identity?.getPrincipal().toString() ??
            Principal.anonymous().toString(),
        ],
      });
    },
  });
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export function useGetWishlist() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Wishlist | null>({
    queryKey: ["wishlist", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const principal = identity.getPrincipal();
      try {
        return await actor.getWishlist(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "wishlist",
          identity?.getPrincipal().toString() ??
            Principal.anonymous().toString(),
        ],
      });
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ["orders", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserOrders(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetOrder(orderId: bigint) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order>({
    queryKey: ["order", orderId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && !!identity && orderId !== undefined,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    }: {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: PaymentMethod;
      totalAmount: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(
        items,
        shippingAddress,
        paymentMethod,
        totalAmount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["cart", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useGetProductReviews(productId: ProductId) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && !isFetching && productId !== undefined,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: ProductId;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addReview(productId, rating, comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId.toString()],
      });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
