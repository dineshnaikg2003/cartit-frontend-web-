export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  unit: string;
  imageUrl: string;
  discountPercent: number;
  isOrganic?: boolean;
  isExpress?: boolean;
  rating: number;
  ratingCount: number;
  description: string;
  stock: number;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  houseNo: string;
  street: string;
  landmark?: string;
  pincode: string;
  city: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  googleSubject?: string;
  addresses: Address[];
}

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PACKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: Address;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  estimatedDeliveryMinutes: number;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  gradient: string;
  imageUrl: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';
