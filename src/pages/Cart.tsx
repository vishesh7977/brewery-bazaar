
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { products } from "@/lib/data";
import { CartItem, Cart } from "@/types";

export default function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real app, this would be fetched from a state management solution or context
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  
  // For demo purposes, let's create a mock cart with one item from our products
  useEffect(() => {
    const mockCartItem: CartItem = {
      productId: products[0].id,
      variantId: products[0].variants[0].id,
      quantity: 1,
      product: products[0],
      selectedVariant: products[0].variants[0],
    };
    
    setCart({
      items: [mockCartItem],
      total: mockCartItem.product.price * mockCartItem.quantity,
    });
  }, []);
  
  // Handle quantity change
  const updateQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...cart.items];
    const item = updatedItems[itemIndex];
    
    // Check stock
    if (newQuantity > item.selectedVariant.stock) {
      toast({
        title: "Maximum stock reached",
        description: `Only ${item.selectedVariant.stock} items available`,
        variant: "destructive",
      });
      return;
    }
    
    // Update quantity
    updatedItems[itemIndex] = {
      ...item,
      quantity: newQuantity,
    };
    
    // Recalculate total
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    setCart({
      items: updatedItems,
      total: newTotal,
    });
  };
  
  // Remove item from cart
  const removeItem = (itemIndex: number) => {
    const updatedItems = cart.items.filter((_, index) => index !== itemIndex);
    
    // Recalculate total
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    setCart({
      items: updatedItems,
      total: newTotal,
    });
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  // Proceed to Razorpay checkout
  const handleCheckout = () => {
    toast({
      title: "Redirecting to payment",
      description: "You will be redirected to the Razorpay payment gateway",
    });
    
    // Redirect to Razorpay link
    window.location.href = "https://rzp.io/rzp/I3iwiEk";
  };
  
  // Empty cart view
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 -ml-3"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header (desktop only) */}
          <div className="hidden md:grid grid-cols-5 gap-4 py-2 border-b text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>
          
          {/* Cart items */}
          {cart.items.map((item, index) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="border rounded-md p-4 md:p-0 md:border-none md:grid md:grid-cols-5 md:gap-4 md:items-center"
            >
              {/* Product info */}
              <div className="md:col-span-2 flex gap-4 items-center mb-4 md:mb-0 md:py-4">
                <div className="h-20 w-20 bg-secondary rounded-md overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.selectedVariant.size} / {item.selectedVariant.color}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive p-0 h-auto text-xs mt-1 md:hidden"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              
              {/* Price */}
              <div className="md:text-center flex justify-between md:block">
                <div className="md:hidden text-sm text-muted-foreground">
                  Price
                </div>
                <div>₹{(item.product.price / 100).toFixed(2)}</div>
              </div>
              
              {/* Quantity */}
              <div className="md:text-center mt-2 md:mt-0 flex justify-between md:block items-center">
                <div className="md:hidden text-sm text-muted-foreground">
                  Quantity
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    disabled={item.quantity >= item.selectedVariant.stock}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Total */}
              <div className="md:text-right mt-2 md:mt-0 flex justify-between md:block items-center">
                <div className="md:hidden text-sm text-muted-foreground">
                  Total
                </div>
                <div className="font-medium">
                  ₹{((item.product.price * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
              
              {/* Remove (desktop) */}
              <div className="hidden md:flex md:justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(cart.total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>₹{(cart.total / 100).toFixed(2)}</span>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Free shipping on all orders</p>
              <p className="mt-2">Secure payment via Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
