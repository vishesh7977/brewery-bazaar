
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Star, Truck, Lock, Tags, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Index() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Filter products that are marked as featured
  const featuredProducts = products
    .filter(product => product.featured)
    .filter(product => product.category === "t-shirts" || product.category === "shorts");

  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
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
      {/* Hero Section - Different for Desktop and Mobile */}
      <section className="relative bg-secondary">
        {/* Desktop Hero */}
        <div className="hidden md:block">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-16 md:py-24"
          >
            <motion.div 
              variants={fadeIn}
              className="flex flex-col justify-center"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2">New Collection 2023</span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Elevate Your<br />Streetwear Game
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Premium pieces inspired by Mumbai's vibrant culture. Quality craftsmanship meets urban aesthetics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link to="/products">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/about-us">Our Story</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              variants={fadeIn}
              className="flex items-center justify-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Brewery Streetwear" 
                className="rounded-lg w-full h-auto shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Mobile Hero */}
        <div className="md:hidden">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Brewery Streetwear Mobile" 
              className="w-full h-[80vh] object-cover"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-2">New Collection 2023</span>
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Elevate Your Streetwear Game
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Premium pieces inspired by Mumbai's vibrant culture.
              </p>
              <Button asChild size="lg" className="text-base w-full">
                <Link to="/products">Shop Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-12 bg-background"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Crafted with the finest materials for lasting comfort
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Mumbai Inspired</h3>
              <p className="text-sm text-muted-foreground">
                Designs that capture the city's vibrant spirit
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On all orders above ₹999 across India
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
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

      {/* Featured Products */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-secondary"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              variants={fadeIn}
              className="text-2xl md:text-3xl font-bold"
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
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="group overflow-hidden border-none rounded-md card-shadow hover-lift">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full product-image-hover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 pb-0 px-2">
                      <div className="text-sm text-muted-foreground mb-1 capitalize">
                        {product.category.replace('-', ' ')}
                      </div>
                      <h3 className="font-medium mb-1 group-hover:underline transition-all line-clamp-1">
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
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeIn}
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
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
                  className="group block relative overflow-hidden aspect-video rounded-lg card-shadow"
                >
                  <img 
                    src={category.slug === "t-shirts" 
                      ? "https://images.unsplash.com/photo-1564859228273-274232fdb516?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                      : "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
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

      {/* Testimonials */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-brewery-accent/5"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Customers Say</h2>
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
                className="bg-background p-6 rounded-lg border shadow-sm"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-brewery-accent/20 flex items-center justify-center mr-3">
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

      {/* New Collection Promo */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-brewery-dark text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1573743414961-08ba8d314088?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Winter Collection" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-lg">
            <motion.span variants={fadeIn} className="inline-block px-3 py-1 bg-primary text-black text-xs font-medium rounded-full mb-4">
              NEW COLLECTION
            </motion.span>
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Winter Essentials 2023
            </motion.h2>
            <motion.p variants={fadeIn} className="text-white/80 mb-8">
              Stay warm and stylish this winter with our exclusive collection of hoodies, jackets and more. Premium quality, urban design.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link to="/products">Explore Collection</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
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
              <Button type="submit" className="sm:w-auto relative" disabled={loading}>
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

      {/* Why Choose Us */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 bg-secondary"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Brewery?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a clothing brand. We're a lifestyle, an attitude, and a commitment to quality and style.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn} 
              className="bg-background p-6 rounded-lg border text-center hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                <Tags className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable Luxury</h3>
              <p className="text-muted-foreground">
                Premium quality materials and craftsmanship at accessible price points. Style shouldn't break the bank.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn} 
              className="bg-background p-6 rounded-lg border text-center hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Designs</h3>
              <p className="text-muted-foreground">
                Each piece tells a story inspired by Mumbai's rich cultural tapestry and contemporary urban life.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn} 
              className="bg-background p-6 rounded-lg border text-center hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
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
