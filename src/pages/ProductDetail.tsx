
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HeartIcon, ShoppingCart, Star, ArrowLeft, Share2, Truck, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { products as initialProducts } from "@/lib/data";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  // Get products from localStorage or use initial data
  const [storedProducts] = useLocalStorage<Product[]>("products", initialProducts);
  
  // Find the product by ID
  const product = storedProducts.find((p) => p.id === id);
  
  // If product not found, show a message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }
  
  // Get all available sizes and colors from variants
  const availableSizes = Array.from(
    new Set(product.variants.map((variant) => variant.size))
  );
  
  const availableColors = Array.from(
    new Set(
      product.variants.map((variant) => ({
        name: variant.color,
        code: variant.colorCode,
      }))
    ),
    (item) => JSON.stringify(item)
  ).map((item) => JSON.parse(item));
  
  // State for selected size, color, and quantity
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Find selected variant based on size and color
  const selectedVariant = product.variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color === selectedColor
  );
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Select both size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVariant) {
      toast({
        title: "Variant not available",
        description: "The selected combination is not available",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedVariant.stock < quantity) {
      toast({
        title: "Not enough stock",
        description: `Only ${selectedVariant.stock} items available`,
        variant: "destructive",
      });
      return;
    }
    
    // Add to cart using context
    addItem(product, selectedVariant, quantity);
    
    // Navigate to cart
    navigate("/cart");
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`,
    });
  };
  
  // Get filtered variants for the selected size/color
  const getAvailableVariants = (
    type: "size" | "color",
    value: string
  ): ProductVariant[] => {
    if (type === "size") {
      return product.variants.filter((variant) => variant.size === value);
    } else {
      return product.variants.filter((variant) => variant.color === value);
    }
  };
  
  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string): boolean => {
    if (!selectedColor) return true;
    return getAvailableVariants("color", selectedColor).some(
      (variant) => variant.size === size
    );
  };
  
  // Check if a color is available for the selected size
  const isColorAvailable = (color: string): boolean => {
    if (!selectedSize) return true;
    return getAvailableVariants("size", selectedSize).some(
      (variant) => variant.color === color
    );
  };
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    } else if (!selectedVariant) {
      setQuantity(quantity + 1);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 -ml-3 hover:bg-secondary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square bg-secondary rounded-md overflow-hidden"
          >
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-md overflow-hidden bg-secondary cursor-pointer border-2 ${
                  index === activeImageIndex ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
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
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Size</span>
              <Link to="/support/size-guide" className="text-sm underline text-muted-foreground">
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={`${
                    !isSizeAvailable(size)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (isSizeAvailable(size)) {
                      setSelectedSize(size);
                      
                      // If the current color isn't available for this size, reset color
                      if (
                        selectedColor &&
                        !getAvailableVariants("size", size).some(
                          (v) => v.color === selectedColor
                        )
                      ) {
                        setSelectedColor(null);
                      }
                    }
                  }}
                  disabled={!isSizeAvailable(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Color Selection */}
          <div className="space-y-4">
            <span className="font-medium">Color</span>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isColorAvailable(color.name)) {
                        setSelectedColor(color.name);
                        
                        // If the current size isn't available for this color, reset size
                        if (
                          selectedSize &&
                          !getAvailableVariants("color", color.name).some(
                            (v) => v.size === selectedSize
                          )
                        ) {
                          setSelectedSize(null);
                        }
                      }
                    }}
                    disabled={!isColorAvailable(color.name)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      !isColorAvailable(color.name)
                        ? "opacity-50 cursor-not-allowed ring-1 ring-border"
                        : selectedColor === color.name
                        ? "ring-2 ring-primary ring-offset-2 scale-110"
                        : "ring-1 ring-border hover:ring-2 hover:ring-primary/50"
                    }`}
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quantity and Stock */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Quantity</span>
              {selectedVariant && (
                <span
                  className={`text-sm ${
                    selectedVariant.stock < 5
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {selectedVariant.stock < 5
                    ? `Only ${selectedVariant.stock} left!`
                    : `${selectedVariant.stock} in stock`}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                -
              </Button>
              <span className="w-16 text-center mx-2">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                disabled={
                  selectedVariant ? quantity >= selectedVariant.stock : false
                }
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Shipping and Returns Info */}
          <div className="border-t border-b py-4 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30-day easy returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">1-year warranty on all products</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToWishlist}
              className="flex-1"
            >
              <HeartIcon className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
          </div>
          
          {/* Product Description */}
          <div className="pt-6 border-t">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">
              {product.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
