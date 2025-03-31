
// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  variants: ProductVariant[];
  featured?: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorCode: string;
  stock: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Cart Types
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  selectedVariant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// UI State Types
export interface FilterState {
  category: string | null;
  price: number[];
  size: string | null;
  color: string | null;
}
