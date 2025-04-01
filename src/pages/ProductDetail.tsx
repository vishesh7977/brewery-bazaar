
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product, ProductVariant } from "@/types";
import { products as initialProducts } from "@/lib/data";
import { 
  ChevronLeft, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Clock, 
  Star, 
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import SizeChart from "@/components/product/SizeChart";
import Reviews from "@/components/product/Reviews";
import ReviewForm from "@/components/product/ReviewForm";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  // Get products from localStorage to include new products added by admin
  const [storedProducts] = useLocalStorage<Product[]>("products", initialProducts);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  
  // Find the product with the given ID
  useEffect(() => {
    if (id) {
      const foundProduct = storedProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        // Set default size and color from first variant if available
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedSize(foundProduct.variants[0].size);
          setSelectedColor(foundProduct.variants[0].color);
          setSelectedVariant(foundProduct.variants[0]);
        }
      }
    }
  }, [id, storedProducts]);
  
  // Update selected variant when size or color changes
  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      const variant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [product, selectedSize, selectedColor]);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addToCart({
        product,
        variant: selectedVariant,
        quantity,
        price: product.price
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} (${selectedVariant.size}, ${selectedVariant.color}) x ${quantity} added to your cart.`,
      });
    } else {
      toast({
        title: "Please select options",
        description: "Select size and color before adding to cart.",
        variant: "destructive",
      });
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
      const newValue = prev + change;
      return newValue < 1 ? 1 : newValue;
    });
  };
  
  // Get available sizes and colors
  const getAvailableSizes = () => {
    if (!product) return [];
    const sizes = new Set<string>();
    product.variants.forEach(v => sizes.add(v.size));
    return Array.from(sizes);
  };
  
  const getAvailableColors = (size: string) => {
    if (!product || !size) return [];
    const colors = new Set<string>();
    product.variants
      .filter(v => v.size === size)
      .forEach(v => colors.add(v.color));
    return Array.from(colors);
  };
  
  const getVariantByColorAndSize = (color: string, size: string) => {
    if (!product) return null;
    return product.variants.find(
      v => v.color === color && v.size === size
    );
  };
  
  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-muted p-8 rounded-lg max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Button asChild>
            <Link to="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link to="/products" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-muted aspect-square rounded-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-md overflow-hidden border cursor-pointer hover:border-primary transition-colors"
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground capitalize">{product.category.replace('-', ' ')}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold">
                ₹{(product.price / 100).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <Badge className="bg-green-500">
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}% OFF
                </Badge>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="size">Size</Label>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-primary"
                  onClick={() => setShowSizeChart(true)}
                >
                  Size Chart
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes().map((size) => {
                  const isAvailable = getAvailableColors(size).length > 0;
                  return (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedSize(size);
                        const availableColors = getAvailableColors(size);
                        if (
                          availableColors.length > 0 &&
                          (!selectedColor || !availableColors.includes(selectedColor))
                        ) {
                          setSelectedColor(availableColors[0]);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`${
                        selectedSize === size
                          ? ""
                          : isAvailable
                          ? "border-primary/30 hover:bg-primary/10"
                          : "opacity-50"
                      }`}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {selectedSize && (
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex flex-wrap gap-3">
                  {getAvailableColors(selectedSize).map((color) => {
                    const variant = getVariantByColorAndSize(color, selectedSize);
                    const isAvailable = variant && variant.stock > 0;
                    
                    return (
                      <div key={color} className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          disabled={!isAvailable}
                          className={`w-8 h-8 rounded-full border transition-all ${
                            selectedColor === color
                              ? "ring-2 ring-primary ring-offset-2"
                              : !isAvailable
                              ? "opacity-50 cursor-not-allowed"
                              : "ring-1 ring-border hover:ring-2 hover:ring-primary/50"
                          }`}
                          style={{
                            backgroundColor: variant?.colorCode || "#000000",
                          }}
                        />
                        <span className="text-xs">{color}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <div className="h-8 px-4 flex items-center justify-center border-y">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    selectedVariant ? quantity >= selectedVariant.stock : true
                  }
                >
                  +
                </Button>
              </div>
              
              {selectedVariant && (
                <span className="text-sm text-muted-foreground">
                  {selectedVariant.stock} available
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || !selectedVariant}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-primary/30 hover:bg-primary/10"
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
            <Card className="bg-muted/50">
              <CardContent className="p-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-sm">Free shipping above ₹599</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm">Money-back guarantee</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">Delivery in 3-5 days</span>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Tabs defaultValue="description" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details & Care</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p>{product.description || "No description available."}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Product Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Material</span>
                    <span>100% Cotton</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Pattern</span>
                    <span>Solid</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Fit</span>
                    <span>Regular Fit</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Neck</span>
                    <span>Round Neck</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Sleeve</span>
                    <span>Short Sleeve</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Wash Care</h3>
                <ul className="space-y-2 text-sm">
                  <li>Machine wash cold</li>
                  <li>Wash with similar colors</li>
                  <li>Gentle cycle</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Cool iron if needed</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-8">
              <Reviews productId={product.id} />
              <Separator />
              <ReviewForm productId={product.id} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <SizeChart open={showSizeChart} onOpenChange={setShowSizeChart} />
    </div>
  );
}
