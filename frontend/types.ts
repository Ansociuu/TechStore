
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isHot?: boolean;
  discount?: string;
  description: string;
  specs: Record<string, string>;
  isAIPick?: boolean;
  aiReasoning?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  trackingStep: number;
  items: OrderItem[];
  address: string;
  paymentMethod: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  isDefault: boolean;
  type: 'home' | 'office';
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  role?: 'user' | 'admin';
  phone?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  addresses?: Address[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'ai' | 'promo' | 'system';
  isRead: boolean;
  link?: string;
  targetPage?: Page;
}

export enum Page {
  HOME = 'HOME',
  LISTING = 'LISTING',
  DETAIL = 'DETAIL',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PROFILE = 'PROFILE',
  ORDER_DETAIL = 'ORDER_DETAIL',
  AUTH = 'AUTH',
  AI_ASSISTANT = 'AI_ASSISTANT',
  COMPARE = 'COMPARE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}
