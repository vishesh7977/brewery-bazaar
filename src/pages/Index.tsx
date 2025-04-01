
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Star, Truck, Lock, Tags, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Index() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Filter products that are marked as featured
  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4); // Ensure we only show up to 4 featured products

  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts" || category.category === "hoodies"
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${(price / 10000).toFixed(2)}`;
  };

  // Newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Newsletter subscription successful",
        description: "Thank you for subscribing to our newsletter!"
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Testimonials
  const testimonials = [
    {
      id: 1,
      text: "The quality of Brewery's clothing is exceptional. The material is soft yet durable, and the fit is perfect. Highly recommend!",
      author: "Aarav Singh",
      location: "Mumbai"
    },
    {
      id: 2,
      text: "I've been wearing Brewery shirts for years now. The designs are always on trend and the comfort is unmatched. Super satisfied customer!",
      author: "Priya Mehta",
      location: "Delhi"
    },
    {
      id: 3,
      text: "Their customer service is as great as their products. When I had an issue with sizing, they resolved it immediately. Will shop again!",
      author: "Vikram Patel",
      location: "Bangalore"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with enhanced gradient and animation */}
      <section className="relative bg-gradient-to-br from-secondary via-background to-accent/30">
        {/* Desktop Hero */}
        <div className="hidden md:block">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-16 md:py-28"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col justify-center"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent uppercase tracking-wider mb-2">Premium Collection</span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Elevate Your<br />Streetwear Game
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Premium pieces inspired by Mumbai's vibrant culture. Quality craftsmanship meets urban aesthetics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300">
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base border-primary/30 hover:bg-primary/10">
                  <Link to="/about-us">Our Story</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/30 rounded-xl blur-lg -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Brewery Streetwear" 
                  className="rounded-lg w-full h-auto shadow-lg object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Mobile Hero with enhanced gradient */}
        <div className="md:hidden">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Brewery Streetwear Mobile" 
              className="w-full h-[85vh] object-cover"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2">Premium Collection</span>
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Elevate Your Streetwear Game
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Premium pieces inspired by Mumbai's vibrant culture.
              </p>
              <Button asChild size="lg" className="text-base w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity">
                <Link to="/products">Shop Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Features with improved hover effects */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-b from-background to-secondary/30"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Crafted with the finest materials for lasting comfort
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Mumbai Inspired</h3>
              <p className="text-sm text-muted-foreground">
                Designs that capture the city's vibrant spirit
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On all orders above ₹999 across India
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/30 transition-colors">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Shop with confidence using trusted payment methods
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products with enhanced card design */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-tr from-secondary/50 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              variants={fadeIn}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              Featured Products
            </motion.h2>
            <motion.div variants={fadeIn}>
              <Button asChild variant="link" className="group">
                <Link to="/products" className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`}>
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
                      <CardContent className="pt-4 pb-0 px-3">
                        <div className="text-sm text-muted-foreground mb-1 capitalize">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
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
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-sm">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-muted-foreground">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Categories with enhanced design */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-bl from-secondary/30 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group block relative overflow-hidden aspect-video rounded-lg shadow-lg"
                >
                  <img 
                    src={category.slug === "t-shirts" 
                      ? "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                      : "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30 group-hover:translate-x-2 transition-transform">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials with enhanced design */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-tr from-accent/10 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              We pride ourselves on quality and customer satisfaction. Here's what our customers have to say about their Brewery experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-card to-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter with enhanced design */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-br from-secondary/50 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest releases, exclusive offers, and style inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button type="submit" className="sm:w-auto relative bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us with enhanced design */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-gradient-to-tr from-secondary/30 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Why Choose Brewery?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a clothing brand. We're a lifestyle, an attitude, and a commitment to quality and style.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn} 
              className="bg-gradient-to-br from-card to-background p-6 rounded-lg border text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
                <Tags className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable Luxury</h3>
              <p className="text-muted-foreground">
                Premium quality materials and craftsmanship at accessible price points. Style shouldn't break the bank.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn} 
              className="bg-gradient-to-br from-card to-background p-6 rounded-lg border text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Designs</h3>
              <p className="text-muted-foreground">
                Each piece tells a story inspired by Mumbai's rich cultural tapestry and contemporary urban life.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn} 
              className="bg-gradient-to-br from-card to-background p-6 rounded-lg border text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focused</h3>
              <p className="text-muted-foreground">
                Exceptional shopping experience with attentive customer service and hassle-free returns.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
