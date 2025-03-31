
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Cart, Order, Address, Customer, OrderStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

type CartState = {
  items: CartItem[];
  total: number;
  shippingAddress: Address | null;
  billingAddress: Address | null;
};

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  shippingAddress: null,
  billingAddress: null
};

// Load cart from localStorage if available
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') return initialState;
  
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : initialState;
};

// Calculate total price from cart items
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.variantId === variant.id
      );
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            productId: product.id,
            variantId: variant.id,
            product,
            selectedVariant: variant,
            quantity
          }
        ];
      }
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'REMOVE_ITEM': {
      const { productId, variantId } = action.payload;
      const newItems = state.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      const newItems = state.items.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      });
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
      break;
    }
    
    case 'SET_SHIPPING_ADDRESS': {
      newState = {
        ...state,
        shippingAddress: action.payload
      };
      break;
    }
    
    case 'SET_BILLING_ADDRESS': {
      newState = {
        ...state,
        billingAddress: action.payload
      };
      break;
    }
    
    case 'CLEAR_CART': {
      newState = {
        ...initialState
      };
      break;
    }
    
    default:
      return state;
  }
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(newState));
  }
  
  return newState;
};

type CartContextType = {
  cart: Cart;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address) => void;
  placeOrder: (customer: Customer, paymentMethod: string) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  const { toast } = useToast();
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  
  const addItem = (product: Product, variant: ProductVariant, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    
    toast({
      title: 'Added to cart',
      description: `${quantity} × ${product.name} (${variant.size}, ${variant.color}) added to cart`,
    });
  };
  
  const removeItem = (productId: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
    });
  };
  
  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) return;
    
    // Find the item and check stock
    const item = state.items.find(
      item => item.productId === productId && item.variantId === variantId
    );
    
    if (item && quantity > item.selectedVariant.stock) {
      toast({
        title: 'Maximum stock reached',
        description: `Only ${item.selectedVariant.stock} items available`,
        variant: 'destructive',
      });
      return;
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
  };
  
  const setShippingAddress = (address: Address) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  };
  
  const setBillingAddress = (address: Address) => {
    dispatch({ type: 'SET_BILLING_ADDRESS', payload: address });
  };
  
  const placeOrder = (customer: Customer, paymentMethod: string) => {
    // Create order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Calculate subtotal and shipping
    const subtotal = state.total;
    const shipping = subtotal >= 99900 ? 0 : 10000; // Free shipping for orders above ₹999
    const total = subtotal + shipping;
    
    // Create order items
    const items = state.items.map(item => ({
      product: item.product,
      variant: item.selectedVariant,
      quantity: item.quantity,
      price: item.product.price * item.quantity
    }));
    
    // Create new order
    const newOrder: Order = {
      id: orderId,
      customer,
      items,
      shippingAddress: state.shippingAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
      },
      billingAddress: state.billingAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India"
      },
      subtotal,
      shipping,
      total,
      status: 'Processing' as OrderStatus,
      date: new Date().toISOString(),
      paymentMethod
    };
    
    // Add to orders in localStorage
    setOrders([...orders, newOrder]);
    
    // Update customer or add new one
    const existingCustomerIndex = customers.findIndex(c => c.email === customer.email);
    
    if (existingCustomerIndex >= 0) {
      const updatedCustomers = [...customers];
      const existingCustomer = updatedCustomers[existingCustomerIndex];
      
      updatedCustomers[existingCustomerIndex] = {
        ...existingCustomer,
        orders: (existingCustomer.orders || 0) + 1,
        spent: (existingCustomer.spent || 0) + total
      };
      
      setCustomers(updatedCustomers);
    } else {
      // Add new customer
      setCustomers([
        ...customers,
        {
          id: `cust-${Date.now()}`,
          ...customer,
          orders: 1,
          spent: total,
          joinedDate: new Date().toISOString()
        }
      ]);
    }
    
    // Clear cart
    clearCart();
    
    // Show success message
    toast({
      title: 'Order placed successfully',
      description: `Your order #${orderId} has been placed and is being processed.`,
    });
    
    return orderId;
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);
  
  const value = {
    cart: { items: state.items, total: state.total },
    shippingAddress: state.shippingAddress,
    billingAddress: state.billingAddress,
    addItem,
    removeItem,
    updateQuantity,
    setShippingAddress,
    setBillingAddress,
    placeOrder,
    clearCart,
    itemCount
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
