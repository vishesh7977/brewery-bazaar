
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { products, categories } from "@/lib/data";
import { Product, FilterState } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, SlidersHorizontal, X, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  
  // State for filters and filtered products
  const [filters, setFilters] = useState<FilterState>({
    category: categoryFromUrl,
    price: [0, 10000],
    size: null,
    color: null,
  });
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Available sizes and colors
  const sizes = ["S", "M", "L", "XL", "XXL", "One Size", "30", "32", "34", "36"];
  const colors = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" }, 
    { name: "Gray", code: "#808080" },
    { name: "Olive", code: "#556B2F" },
    { name: "Beige", code: "#F5F5DC" },
  ];
  
  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }
    
    // Filter by price
    result = result.filter(
      (product) => 
        product.price >= filters.price[0] &&
        product.price <= filters.price[1]
    );
    
    // Filter by size
    if (filters.size) {
      result = result.filter((product) =>
        product.variants.some((variant) => variant.size === filters.size)
      );
    }
    
    // Filter by color
    if (filters.color) {
      result = result.filter((product) =>
        product.variants.some((variant) => variant.color === filters.color)
      );
    }
    
    setFilteredProducts(result);
  }, [filters]);
  
  // Handle filter changes
  const handleCategoryChange = (category: string | null) => {
    setFilters({ ...filters, category });
  };
  
  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, price: values });
  };
  
  const handleSizeChange = (size: string) => {
    setFilters({ ...filters, size: filters.size === size ? null : size });
  };
  
  const handleColorChange = (color: string) => {
    setFilters({ ...filters, color: filters.color === color ? null : color });
  };
  
  const clearFilters = () => {
    setFilters({
      category: null,
      price: [0, 10000],
      size: null,
      color: null,
    });
  };
  
  // Toggle filter visibility for mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
      >
        {filters.category 
          ? `${categories.find(c => c.slug === filters.category)?.name || "Products"}`
          : "All Products"
        }
      </motion.h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={toggleFilters}
            className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {(filters.category || filters.size || filters.color || filters.price[0] > 0 || filters.price[1] < 10000) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-sm flex items-center gap-1 hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Filters sidebar with improved styling */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6 bg-card/30 p-4 rounded-lg border border-border/50`}
        >
          <div className="hidden lg:flex justify-between items-center mb-4">
            <h2 className="font-medium">Filters</h2>
            {(filters.category || filters.size || filters.color || filters.price[0] > 0 || filters.price[1] < 10000) && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="text-sm flex items-center gap-1 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Categories filter */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-foreground/90">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => handleCategoryChange(null)}
                  className={`text-sm justify-start px-2 h-8 w-full ${
                    filters.category === null ? "bg-secondary" : ""
                  }`}
                >
                  All Products
                </Button>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`text-sm justify-start px-2 h-8 w-full ${
                      filters.category === category.slug ? "bg-secondary" : ""
                    }`}
                  >
                    {category.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price filter */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-foreground/90">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[0, 10000]}
                max={10000}
                step={100}
                value={filters.price}
                onValueChange={handlePriceChange}
                className="my-6"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{(filters.price[0] / 100).toFixed(2)}</span>
                <span>₹{(filters.price[1] / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Size filter */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-foreground/90">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={filters.size === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSizeChange(size)}
                  className={`h-8 ${filters.size === size ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:bg-primary/10"}`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Color filter */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-foreground/90">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleColorChange(color.name)}
                    className={`w-8 h-8 rounded-full transition-all border ${
                      filters.color === color.name 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "ring-1 ring-border"
                    }`}
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Products grid with improved card design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredProducts.length} products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.originalPrice && (
                          <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                            Sale
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4 px-3">
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ₹{(product.price / 100).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-sm">
                              ₹{(product.originalPrice / 100).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-card/30 rounded-lg border border-border/50">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or browse our categories below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    onClick={() => handleCategoryChange(category.slug)}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
