
import React, { createContext, useContext, useReducer } from 'react';
import { Product, ProductVariant, Cart, Order, Address, Customer } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  cartReducer, 
  initialState, 
  loadCartFromStorage, 
  CartState, 
  CartAction 
} from './cart/cartReducer';
import { CartContextType } from './cart/cartTypes';
import { createOrder, updateCustomer } from './cart/orderManager';

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
    // Create the order
    const { newOrder, orderId } = createOrder(state, customer, paymentMethod, orders);
    
    // Add to orders in localStorage
    setOrders([...orders, newOrder]);
    
    // Update customer information
    const updatedCustomers = updateCustomer(customer, customers, newOrder.total);
    setCustomers(updatedCustomers);
    
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
