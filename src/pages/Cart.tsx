
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Customer, Address } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    cart,
    removeItem,
    updateQuantity,
    shippingAddress,
    billingAddress,
    setShippingAddress,
    setBillingAddress,
    placeOrder
  } = useCart();
  
  // Checkout state
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  
  // Shipping information
  const [shippingInfo, setShippingInfo] = useState<Address>(
    shippingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    }
  );
  
  // Billing information
  const [billingInfo, setBillingInfo] = useState<Address>(
    billingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    }
  );
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState<Customer>({
    id: "",
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    phone: ""
  });
  
  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };
  
  // Handle shipping form fields
  const handleShippingChange = (field: keyof Address, value: string) => {
    const updated = { ...shippingInfo, [field]: value };
    setShippingInfo(updated);
    setShippingAddress(updated);
    
    if (useShippingAsBilling) {
      setBillingInfo(updated);
      setBillingAddress(updated);
    }
  };
  
  // Handle billing form fields
  const handleBillingChange = (field: keyof Address, value: string) => {
    const updated = { ...billingInfo, [field]: value };
    setBillingInfo(updated);
    setBillingAddress(updated);
  };
  
  // Handle customer form fields
  const handleCustomerChange = (field: keyof Customer, value: string) => {
    setCustomerInfo({ ...customerInfo, [field]: value });
  };
  
  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping fields",
        variant: "destructive"
      });
      return;
    }
    
    setShippingAddress(shippingInfo);
    
    if (useShippingAsBilling) {
      setBillingAddress(shippingInfo);
    }
    
    setStep("payment");
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all customer information",
        variant: "destructive"
      });
      return;
    }
    
    // Save customer info to localStorage for future use
    localStorage.setItem("userName", customerInfo.name);
    localStorage.setItem("userEmail", customerInfo.email);
    
    // Place the order
    const orderId = placeOrder(customerInfo, paymentMethod);
    
    // Redirect to thank you page (this would normally go to payment gateway)
    navigate("/");
    
    toast({
      title: "Order placed successfully",
      description: `Thank you for your order #${orderId}! We'll process it right away.`,
    });
  };
  
  // Calculate shipping and total
  const subtotal = cart.total;
  const shipping = subtotal >= 99900 ? 0 : 10000; // Free shipping for orders above ₹999
  const total = subtotal + shipping;
  
  // Empty cart view
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }
  
  // Shopping Cart Step
  if (step === "cart") {
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
            <AnimatePresence>
              {cart.items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-md p-4 md:p-0 md:border-none md:grid md:grid-cols-5 md:gap-4 md:items-center"
                >
                  {/* Product info */}
                  <div className="md:col-span-2 flex gap-4 items-center mb-4 md:mb-0 md:py-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="h-20 w-20 bg-secondary rounded-md overflow-hidden"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
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
                        onClick={() => removeItem(item.productId, item.variantId)}
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
                    <div>{formatPrice(item.product.price)}</div>
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
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
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
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                  
                  {/* Remove (desktop) */}
                  <div className="hidden md:flex md:justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-secondary/30 p-6 rounded-lg border border-border/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{subtotal >= 99900 ? 'Free' : formatPrice(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                onClick={() => setStep("shipping")}
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Free shipping on all orders above ₹999</p>
                <p className="mt-2">Secure payment via Razorpay</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Shipping Step
  if (step === "shipping") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("cart")}
              className="-ml-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
                <span className="ml-2">Cart</span>
              </div>
              <div className="w-8 h-0.5 bg-primary"></div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div className="w-8 h-0.5 bg-muted"></div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">3</div>
                <span className="ml-2">Payment</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
              
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-street">Street Address</Label>
                  <Input
                    id="shipping-street"
                    value={shippingInfo.street}
                    onChange={(e) => handleShippingChange("street", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping-city">City</Label>
                    <Input
                      id="shipping-city"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange("city", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-state">State</Label>
                    <Input
                      id="shipping-state"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange("state", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping-zipcode">Zip Code</Label>
                    <Input
                      id="shipping-zipcode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-country">Country</Label>
                    <Input
                      id="shipping-country"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 my-6">
                  <input
                    type="checkbox"
                    id="use-shipping-as-billing"
                    checked={useShippingAsBilling}
                    onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                    className="rounded border-border h-4 w-4"
                  />
                  <Label htmlFor="use-shipping-as-billing" className="text-sm font-normal">
                    Use shipping address as billing address
                  </Label>
                </div>
                
                {!useShippingAsBilling && (
                  <div className="mt-6 pt-6 border-t">
                    <h2 className="text-lg font-bold mb-4">Billing Information</h2>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billing-street">Street Address</Label>
                        <Input
                          id="billing-street"
                          value={billingInfo.street}
                          onChange={(e) => handleBillingChange("street", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-city">City</Label>
                          <Input
                            id="billing-city"
                            value={billingInfo.city}
                            onChange={(e) => handleBillingChange("city", e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="billing-state">State</Label>
                          <Input
                            id="billing-state"
                            value={billingInfo.state}
                            onChange={(e) => handleBillingChange("state", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billing-zipcode">Zip Code</Label>
                          <Input
                            id="billing-zipcode"
                            value={billingInfo.zipCode}
                            onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="billing-country">Country</Label>
                          <Input
                            id="billing-country"
                            value={billingInfo.country}
                            onChange={(e) => handleBillingChange("country", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end mt-8">
                  <Button type="submit" size="lg">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-muted/20 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <Accordion type="single" collapsible defaultValue="items">
                  <AccordionItem value="items">
                    <AccordionTrigger className="text-sm">
                      {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {cart.items.map((item) => (
                          <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                            <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium line-clamp-1">{item.product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.selectedVariant.size} / {item.selectedVariant.color}
                              </div>
                              <div className="flex justify-between mt-1 text-sm">
                                <span>{item.quantity} × {formatPrice(item.product.price)}</span>
                                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{subtotal >= 99900 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Payment Step
  if (step === "payment") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setStep("shipping")}
              className="-ml-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shipping
            </Button>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
                <span className="ml-2">Cart</span>
              </div>
              <div className="w-8 h-0.5 bg-primary"></div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</div>
                <span className="ml-2">Shipping</span>
              </div>
              <div className="w-8 h-0.5 bg-primary"></div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="mb-8">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="border rounded-md p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted/30 transition-colors">
                      <RadioGroupItem value="razorpay" id="r1" />
                      <Label htmlFor="r1" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Razorpay</span>
                          <img src="https://cdn.razorpay.com/logo.svg" alt="Razorpay" className="h-6" />
                        </div>
                      </Label>
                    </div>
                    
                    <div className="border rounded-md p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted/30 transition-colors">
                      <RadioGroupItem value="cod" id="r2" />
                      <Label htmlFor="r2" className="flex-1 cursor-pointer">
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <h2 className="text-lg font-bold mb-4">Contact Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input
                    id="customer-name"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email Address</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input
                    id="customer-phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                    <Check className="mr-2 h-4 w-4" />
                    Complete Order
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-muted/20 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <Accordion type="single" collapsible defaultValue="items">
                  <AccordionItem value="items">
                    <AccordionTrigger className="text-sm">
                      {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {cart.items.map((item) => (
                          <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                            <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium line-clamp-1">{item.product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.selectedVariant.size} / {item.selectedVariant.color}
                              </div>
                              <div className="flex justify-between mt-1 text-sm">
                                <span>{item.quantity} × {formatPrice(item.product.price)}</span>
                                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-sm">
                      Shipping Address
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm">
                        <p>{shippingInfo.street}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {!useShippingAsBilling && (
                    <AccordionItem value="billing">
                      <AccordionTrigger className="text-sm">
                        Billing Address
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm">
                          <p>{billingInfo.street}</p>
                          <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                          <p>{billingInfo.country}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{subtotal >= 99900 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
