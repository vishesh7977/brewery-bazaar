
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Star, Package, ShoppingBag, CircleCheck, CircleAlert, Share2, Heart, Eye, Truck, RotateCcw, Shield, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tab, Tabs, TabList, TabPanel } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SizeChart } from "@/components/product/SizeChart";
import { Reviews } from "@/components/product/Reviews";
import { ReviewForm } from "@/components/product/ReviewForm";
import { products as initialProducts } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Product, ProductVariant } from "@/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  // Get products from localStorage or use initial data
  const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(initialProducts));
  
  // Find the product by ID
  const product = products.find((p: Product) => p.id === id);
  
  // If product not found, navigate to 404
  useEffect(() => {
    if (!product) {
      navigate("/not-found");
    }
  }, [product, navigate]);
  
  // State for selected variant, image, and quantity
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.length ? product.variants[0] : null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showSubmitReview, setShowSubmitReview] = useState(false);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    // Add item to cart
    addItem(product, selectedVariant, quantity);
  };
  
  // Handle quantity change
  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Maximum stock reached",
        description: `Only ${selectedVariant?.stock} items available`,
        variant: "destructive",
      });
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Change selected image
  const nextImage = () => {
    if (product && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };
  
  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };
  
  // Callback for when a review is submitted
  const handleReviewSubmitted = () => {
    setShowSubmitReview(false);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };
  
  // If product is not loaded yet, show loading
  if (!product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link to="/products" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square bg-muted rounded-lg overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
                  onClick={prevImage}
                  disabled={selectedImage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
                  onClick={nextImage}
                  disabled={selectedImage === product.images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </motion.div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-auto py-2">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold"
              >
                {product.name}
              </motion.h1>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : i < product.rating
                          ? "text-yellow-500 fill-yellow-500 opacity-50"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold">
                ₹{(product.price / 100).toFixed(2)}
              </div>
              {product.originalPrice && (
                <div className="text-muted-foreground line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </div>
              )}
              {product.originalPrice && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="mt-4 flex items-center space-x-1">
              <Badge
                variant="outline"
                className={product.inStock ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {product.category.replace("-", " ").charAt(0).toUpperCase() + product.category.replace("-", " ").slice(1)}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Select Size</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setShowSizeChart(true)}
              >
                <Info className="h-3 w-3 mr-1" />
                Size Guide
              </Button>
            </div>
            
            <RadioGroup
              defaultValue={selectedVariant?.size}
              onValueChange={(size) => {
                const variant = product.variants.find(v => v.size === size && v.color === selectedVariant?.color);
                if (variant) setSelectedVariant(variant);
              }}
            >
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(product.variants.map((v) => v.size))).map(
                  (size) => {
                    const isAvailable = product.variants.some(
                      (v) => v.size === size && v.stock > 0 && v.color === selectedVariant?.color
                    );
                    
                    return (
                      <div key={size} className="relative">
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="peer sr-only"
                          disabled={!isAvailable}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-transparent text-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary peer-disabled:bg-muted/50 peer-disabled:text-muted-foreground/50"
                        >
                          {size}
                        </Label>
                      </div>
                    );
                  }
                )}
              </div>
            </RadioGroup>
          </div>
          
          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-2">Select Color</h3>
            
            <RadioGroup
              defaultValue={selectedVariant?.color}
              onValueChange={(color) => {
                const variant = product.variants.find(v => v.color === color && v.size === selectedVariant?.size);
                if (variant) setSelectedVariant(variant);
              }}
            >
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    product.variants
                      .filter((v) => v.size === selectedVariant?.size)
                      .map((v) => v.color)
                  )
                ).map((color) => {
                  const variant = product.variants.find(
                    (v) => v.color === color && v.size === selectedVariant?.size
                  );
                  const isAvailable = variant?.stock && variant.stock > 0;
                  
                  return (
                    <div key={color} className="relative">
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                        disabled={!isAvailable}
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-transparent px-3 text-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary peer-disabled:bg-muted/50 peer-disabled:text-muted-foreground/50"
                      >
                        <span
                          className="mr-1 inline-block h-4 w-4 rounded-full border"
                          style={{
                            backgroundColor: variant?.colorCode || "#000",
                            borderColor: variant?.colorCode === "#FFFFFF" ? "#ddd" : variant?.colorCode,
                          }}
                        />
                        {color}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
          
          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <div className="h-10 w-12 flex items-center justify-center border-y">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={increaseQuantity}
                disabled={!selectedVariant || quantity >= selectedVariant.stock}
              >
                +
              </Button>
              
              <div className="ml-4 text-sm text-muted-foreground">
                {selectedVariant ? (
                  selectedVariant.stock > 0 ? (
                    <span className="flex items-center">
                      <CircleCheck className="h-4 w-4 text-green-600 mr-1" />
                      {selectedVariant.stock} available
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CircleAlert className="h-4 w-4 text-red-600 mr-1" />
                      Out of stock
                    </span>
                  )
                ) : (
                  <span>Select a variant</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="sm:flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Shipping info */}
          <div className="mt-6 space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">On orders over ₹599. Dispatched in 1-2 working days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-muted-foreground">30 day return policy. Return for a refund or exchange.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Secure Checkout</p>
                <p className="text-sm text-muted-foreground">Pay with confidence using secure payment methods.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Product Tabs */}
      <div className="my-12">
        <Tabs defaultValue="details">
          <TabList className="mb-8">
            <Tab value="details">Product Details</Tab>
            <Tab value="reviews">Reviews ({product.reviews})</Tab>
          </TabList>
          
          <TabPanel value="details">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Description</h3>
              <p>{product.description}</p>
              
              <h3>Features</h3>
              <ul>
                <li>Premium quality material</li>
                <li>Comfortable fit</li>
                <li>Durable and long-lasting</li>
                <li>Easy to care for</li>
                <li>Stylish design</li>
              </ul>
              
              <h3>Care Instructions</h3>
              <ul>
                <li>Machine wash cold</li>
                <li>Do not bleach</li>
                <li>Tumble dry low</li>
                <li>Iron on low heat if needed</li>
                <li>Do not dry clean</li>
              </ul>
            </div>
          </TabPanel>
          
          <TabPanel value="reviews">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Customer Reviews</h3>
                <Button onClick={() => setShowSubmitReview(true)}>Write a Review</Button>
              </div>
              
              <Reviews 
                productId={product.id}
                rating={product.rating}
                reviewCount={product.reviews}
              />
            </div>
          </TabPanel>
        </Tabs>
      </div>
      
      {/* Related Products */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p: Product) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct: Product) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden h-full border-border/40 hover:border-border hover:shadow-md transition-all">
                    <div className="aspect-square overflow-hidden relative group">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium truncate">{relatedProduct.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold">₹{(relatedProduct.price / 100).toFixed(2)}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs ml-1">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
      
      {/* Size Chart Dialog */}
      <Dialog open={showSizeChart} onOpenChange={setShowSizeChart}>
        <DialogContent className="max-w-2xl">
          <SizeChart />
        </DialogContent>
      </Dialog>
      
      {/* Review Form Dialog */}
      <Dialog open={showSubmitReview} onOpenChange={setShowSubmitReview}>
        <DialogContent className="max-w-lg">
          <ReviewForm 
            productId={product.id}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
