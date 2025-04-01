
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product } from "@/types";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Index() {
  const { toast } = useToast();
  const [storedProducts] = useLocalStorage<Product[]>("products", products);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Welcome toast
  useEffect(() => {
    toast({
      title: "Welcome to StyleStore!",
      description: "Discover the latest in fashion trends and styles.",
    });
  }, [toast]);
  
  // Categories (limited to t-shirts and shorts only)
  const categories = [
    {
      id: "t-shirts",
      name: "T-Shirts",
      slug: "t-shirts",
      image: "https://img.freepik.com/free-photo/basic-white-tee-women-s-casual-wear-studio-shoot_53876-102822.jpg"
    },
    {
      id: "shorts",
      name: "Shorts",
      slug: "shorts",
      image: "https://img.freepik.com/free-photo/beige-drawstring-shorts-men-s-summer-apparel_53876-104149.jpg"
    }
  ];
  
  // Filter featured products
  const featuredProducts = storedProducts
    .filter(p => p.featured && (p.category === "t-shirts" || p.category === "shorts"))
    .slice(0, 6);
  
  // Filter new arrivals
  const newArrivals = storedProducts
    .filter(p => p.category === "t-shirts" || p.category === "shorts")
    .sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]))
    .slice(0, 6);
  
  // Filter by category
  const getByCategoryProducts = (categorySlug: string) => {
    return storedProducts
      .filter(product => product.category === categorySlug)
      .slice(0, 6);
  };
  
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-24 mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Style Elevated
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Discover the latest trends in fashion for every occasion.
              </p>
            </div>
            
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10" asChild>
                <Link to="/about-us">About Us</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 hidden md:block">
            <img
              src="https://img.freepik.com/free-photo/fashionable-model-posing-studio_1303-22149.jpg"
              alt="Fashion Model"
              className="rounded-xl w-full h-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </motion.section>
      
      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <Button variant="ghost" asChild>
            <Link to="/products" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/products?category=${category.slug}`}>
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-0 relative">
                    <div className="aspect-[16/9] bg-gradient-to-r from-primary/10 to-primary/5">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <Button 
                          variant="outline" 
                          className="text-white border-white hover:bg-white/20 w-fit"
                        >
                          Explore
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Featured Products Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-16"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <Button variant="ghost" asChild>
            <Link to="/products" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <motion.div 
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6`}
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariant}>
              <Link to={`/product/${product.id}`}>
                <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </div>
                  </div>
                  <CardContent className="pt-4 px-3">
                    <div className="text-sm text-muted-foreground mb-1 capitalize">
                      {product.category.replace('-', ' ')}
                    </div>
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
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
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* Tabs section - New arrivals & by category */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="new" className="space-y-8">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="new">New Arrivals</TabsTrigger>
            <TabsTrigger value="t-shirts">T-Shirts</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <motion.div 
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6`}
            >
              {newArrivals.map((product) => (
                <motion.div key={product.id} variants={itemVariant}>
                  <Link to={`/product/${product.id}`}>
                    <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="pt-4 px-3">
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
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
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="t-shirts">
            <motion.div 
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6`}
            >
              {getByCategoryProducts("t-shirts").map((product) => (
                <motion.div key={product.id} variants={itemVariant}>
                  <Link to={`/product/${product.id}`}>
                    <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="pt-4 px-3">
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
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
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="shorts">
            <motion.div 
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6`}
            >
              {getByCategoryProducts("shorts").map((product) => (
                <motion.div key={product.id} variants={itemVariant}>
                  <Link to={`/product/${product.id}`}>
                    <Card className="group overflow-hidden border-none rounded-md shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="pt-4 px-3">
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
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
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </div>
  );
}
