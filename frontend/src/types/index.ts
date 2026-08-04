export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductImage {
  url: string;
  public_id?: string;
  _id?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  brand: string;
  images: ProductImage[];
  stock: number;
  reviews: Review[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  tags?: string[];
  sold: number;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  _id?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id: string;
  user: User | string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string | Category;
  brand: string;
  stock: number;
  isFeatured?: boolean;
  tags?: string[];
  images?: { url: string; public_id?: string }[];
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  ordersByStatus: { _id: string; count: number }[];
}
