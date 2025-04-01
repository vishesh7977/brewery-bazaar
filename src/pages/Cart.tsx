
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Order } from "@/types";
import { motion } from "framer-motion";

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, updateQuantity, clearCart } = useCart();
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  
  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    notes: ""
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate cart totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  // Free shipping for orders above ₹599
  const shippingCost = subtotal >= 59900 ? 0 : 4999;
  const total = subtotal + shippingCost;
  
  // Handle checkout
  const handleCheckout = () => {
    // Form validation
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "zipCode"];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    // Create order object
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        id: `cust-${Date.now()}`,
        name: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
      },
      shippingAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      },
      items: cart.items.map(item => ({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      shipping: shippingCost,
      total,
      status: "Processing",
      paymentMethod: "Razorpay",
      notes: shippingInfo.notes,
    };
    
    // Save order to localStorage
    setOrders([...orders, newOrder]);
    
    // Display success message and redirect
    toast({
      title: "Order placed successfully!",
      description: `Your order #${orderId} has been confirmed. Thank you for shopping with us!`
    });
    
    // Simulate payment processing with Razorpay
    simulateRazorpayPayment(newOrder);
    
    // Clear cart
    clearCart();
    
    // Redirect to home page
    navigate("/");
  };
  
  // Simulate Razorpay payment (in a real app, this would be implemented properly)
  const simulateRazorpayPayment = (order: Order) => {
    console.log("Processing payment via Razorpay for order:", order);
    
    // In a real implementation, you would integrate with the Razorpay API here
    // This is just a placeholder to show how the flow would work
    toast({
      title: "Razorpay Payment",
      description: "Payment of ₹" + (order.total/100).toFixed(2) + " processed successfully via Razorpay!"
    });
  };
  
  // Custom removeFromCart function since it doesn't exist in CartContextType
  const removeFromCart = (item: any) => {
    updateQuantity(item.productId, item.variantId, 0);
  };
  
  // Empty cart view
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild>
            <Link to="/products" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <ThemeToggle />
        </div>
        
        <div className="max-w-md mx-auto text-center py-16">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" asChild>
          <Link to="/products" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
      >
        Your Shopping Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border/50 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({cart.items.length})</h2>
              <div className="space-y-6">
                {cart.items.map((item, index) => (
                  <motion.div 
                    key={`${item.product.id}-${item.variant.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex gap-4 pb-6 border-b last:border-0 last:pb-0"
                  >
                    <div className="h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <div className="text-sm text-muted-foreground mb-2">
                            {item.variant.size} • {item.variant.color}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ₹{(item.price / 100).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            ₹{((item.price * item.quantity) / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-8 px-4 flex items-center justify-center border-y">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-card border border-border/50 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name<span className="text-destructive">*</span></Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address<span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number<span className="text-destructive">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country<span className="text-destructive">*</span></Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address Line 1<span className="text-destructive">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder="Street address, P.O. box, etc."
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address2">Address Line 2 (optional)</Label>
                  <Input
                    id="address2"
                    name="address2"
                    value={shippingInfo.address2}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City<span className="text-destructive">*</span></Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State<span className="text-destructive">*</span></Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">PIN Code<span className="text-destructive">*</span></Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    placeholder="PIN Code"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="sticky top-6 border-border/50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingCost === 0 
                    ? <span className="text-green-600 dark:text-green-500">Free</span> 
                    : `₹${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              
              {shippingCost > 0 && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  Add ₹{((59900 - subtotal) / 100).toFixed(2)} more for free shipping
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span className="text-lg">₹{(total / 100).toFixed(2)}</span>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p>Free shipping on orders above ₹599</p>
                    <p className="text-xs text-muted-foreground">Delivery in 3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p>Secure checkout</p>
                    <p className="text-xs text-muted-foreground">Powered by Razorpay</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>
              <div className="flex items-center gap-2 text-xs text-center justify-center text-muted-foreground">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/c/cf/Razorpay_logo.svg" 
                  alt="Razorpay" 
                  className="h-4" 
                />
                <span>Secure payment via Razorpay</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
