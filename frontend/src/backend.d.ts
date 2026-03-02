import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: ReviewId;
    userId: Principal;
    date: Time;
    productId: ProductId;
    comment: string;
    rating: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface CreditCardInfo {
    cvv: string;
    expiry: string;
    cardNumber: string;
}
export type Time = bigint;
export type PaymentMethod = {
    __kind__: "upi";
    upi: null;
} | {
    __kind__: "creditCard";
    creditCard: CreditCardInfo;
} | {
    __kind__: "cashOnDelivery";
    cashOnDelivery: null;
} | {
    __kind__: "wallet";
    wallet: null;
};
export interface ShippingAddress {
    country: string;
    city: string;
    name: string;
    zipCode: string;
    state: string;
    address: string;
    phone: string;
}
export interface ProductVariant {
    color?: string;
    size?: string;
    quantity: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    userId: Principal;
    createdAt: Time;
    statusHistory: Array<OrderStatusHistory>;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    items: Array<CartItem>;
}
export interface Wishlist {
    productIds: Array<ProductId>;
    userId: Principal;
}
export interface OrderStatusHistory {
    status: OrderStatus;
    timestamp: Time;
}
export type ReviewId = bigint;
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
    variant: ProductVariant;
}
export interface Cart {
    userId: Principal;
    items: Array<CartItem>;
}
export interface Product {
    id: ProductId;
    subCategory: string;
    imageUrls: Array<string>;
    name: string;
    createdAt: Time;
    description: string;
    discountPercent: bigint;
    variants: Array<ProductVariant>;
    stock: bigint;
    category: string;
    price: number;
}
export type OrderId = bigint;
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    outForDelivery = "outForDelivery",
    placed = "placed",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<ProductId>;
    addReview(productId: ProductId, rating: bigint, comment: string): Promise<ReviewId>;
    addToCart(item: CartItem): Promise<void>;
    addToWishlist(productId: ProductId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(userId: Principal): Promise<Cart>;
    getOrder(orderId: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product>;
    getProductReviews(productId: ProductId): Promise<Array<Review>>;
    getUserOrders(userId: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    getWishlist(userId: Principal): Promise<Wishlist>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(items: Array<CartItem>, shippingAddress: ShippingAddress, paymentMethod: PaymentMethod, totalAmount: number): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
    updateProduct(id: ProductId, product: Product): Promise<void>;
    upgrade(): Promise<void>;
}
