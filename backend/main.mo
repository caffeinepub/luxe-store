import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types

  public type ProductId = Nat;
  public type OrderId = Nat;
  public type ReviewId = Nat;

  public type ProductVariant = {
    size : ?Text;
    color : ?Text;
    quantity : Nat;
  };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    category : Text;
    subCategory : Text;
    imageUrls : [Text];
    price : Float;
    discountPercent : Nat;
    stock : Nat;
    variants : [ProductVariant];
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type CartItem = {
    productId : ProductId;
    variant : ProductVariant;
    quantity : Nat;
  };

  public type Cart = {
    userId : Principal;
    items : [CartItem];
  };

  public type Wishlist = {
    userId : Principal;
    productIds : [ProductId];
  };

  public type ShippingAddress = {
    name : Text;
    address : Text;
    city : Text;
    state : Text;
    zipCode : Text;
    country : Text;
    phone : Text;
  };

  public type PaymentMethod = {
    #upi;
    #creditCard : CreditCardInfo;
    #wallet;
    #cashOnDelivery;
  };

  public type CreditCardInfo = {
    cardNumber : Text;
    expiry : Text;
    cvv : Text;
  };

  public type OrderStatus = {
    #placed;
    #confirmed;
    #shipped;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  public type OrderStatusHistory = {
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type Order = {
    id : OrderId;
    userId : Principal;
    items : [CartItem];
    shippingAddress : ShippingAddress;
    paymentMethod : PaymentMethod;
    totalAmount : Float;
    status : OrderStatus;
    statusHistory : [OrderStatusHistory];
    createdAt : Time.Time;
  };

  public type Review = {
    id : ReviewId;
    productId : ProductId;
    userId : Principal;
    rating : Nat;
    comment : Text;
    date : Time.Time;
  };

  // Authorization
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State
  var nextProductId : ProductId = 1;
  var nextOrderId : OrderId = 1;
  var nextReviewId : ReviewId = 1;

  let products = Map.empty<ProductId, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let carts = Map.empty<Principal, Cart>();
  let wishlists = Map.empty<Principal, Wishlist>();
  let orders = Map.empty<OrderId, Order>();
  let reviews = Map.empty<ReviewId, Review>();

  // Products — public catalog, no auth required
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func searchProducts(keyword : Text) : async [Product] {
    let lowerKeyword = keyword.toLower();
    products.values().toArray().filter(
      func(product) {
        let nameMatch = product.name.toLower().contains(#text lowerKeyword);
        let descMatch = product.description.toLower().contains(#text lowerKeyword);
        nameMatch or descMatch;
      }
    );
  };

  public shared ({ caller }) func addProduct(product : Product) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let id = nextProductId;
    nextProductId += 1;
    let newProduct : Product = {
      product with id;
    };
    products.add(id, newProduct);
    id;
  };

  public shared ({ caller }) func updateProduct(id : ProductId, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.add(id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // User Profiles
  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can't view other user profiles");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Cart
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let cartItems = List.empty<CartItem>();
    cartItems.add(item);
    carts.add(
      caller,
      {
        userId = caller;
        items = cartItems.toArray();
      },
    );
  };

  // Only the owning user or an admin may view a cart
  public query ({ caller }) func getCart(userId : Principal) : async Cart {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own cart");
    };
    switch (carts.get(userId)) {
      case (null) { Runtime.trap("Cart not found") };
      case (?cart) { cart };
    };
  };

  // Wishlist
  public shared ({ caller }) func addToWishlist(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to wishlist");
    };
    let productIdsArray = [productId];
    wishlists.add(
      caller,
      {
        userId = caller;
        productIds = productIdsArray;
      },
    );
  };

  // Only the owning user or an admin may view a wishlist
  public query ({ caller }) func getWishlist(userId : Principal) : async Wishlist {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own wishlist");
    };
    switch (wishlists.get(userId)) {
      case (null) { Runtime.trap("Wishlist not found") };
      case (?wishlist) { wishlist };
    };
  };

  // Orders
  public shared ({ caller }) func placeOrder(
    items : [CartItem],
    shippingAddress : ShippingAddress,
    paymentMethod : PaymentMethod,
    totalAmount : Float,
  ) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let id = nextOrderId;
    nextOrderId += 1;
    let newOrder : Order = {
      id;
      userId = caller;
      items;
      shippingAddress;
      paymentMethod;
      totalAmount;
      status = #placed;
      statusHistory = [{
        status = #placed;
        timestamp = Time.now();
      }];
      createdAt = Time.now();
    };
    orders.add(id, newOrder);
    id;
  };

  // Only the owning user or an admin may view an order
  public query ({ caller }) func getOrder(orderId : OrderId) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (caller != order.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  // Only the owning user or an admin may list a user's orders
  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    let userOrders = List.empty<Order>();
    for (order in orders.values()) {
      if (order.userId == userId) {
        userOrders.add(order);
      };
    };
    userOrders.toArray();
  };

  public shared ({ caller }) func updateOrderStatus(
    orderId : OrderId,
    status : OrderStatus,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let history = order.statusHistory.concat([
          {
            status;
            timestamp = Time.now();
          }
        ]);
        let updatedOrder = {
          order with
          status;
          statusHistory = history;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Reviews — only authenticated users may submit reviews
  public shared ({ caller }) func addReview(
    productId : ProductId,
    rating : Nat,
    comment : Text,
  ) : async ReviewId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    let id = nextReviewId;
    nextReviewId += 1;

    let newReview : Review = {
      id;
      productId;
      userId = caller;
      rating;
      comment;
      date = Time.now();
    };

    reviews.add(id, newReview);
    id;
  };

  // Product reviews are public
  public query ({ caller }) func getProductReviews(productId : ProductId) : async [Review] {
    let productReviews = List.empty<Review>();
    for (review in reviews.values()) {
      if (review.productId == productId) {
        productReviews.add(review);
      };
    };
    productReviews.toArray();
  };

  // Admin functions
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all orders");
    };
    orders.values().toArray();
  };

  public func upgrade() : async () { Runtime.trap("Not allowed to upgrade canister") };
};
