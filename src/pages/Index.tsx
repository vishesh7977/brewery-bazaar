
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Star, Truck, Lock } from "lucide-react";

export default function Index() {
  // Filter products that are marked as featured
  const featuredProducts = products
    .filter(product => product.featured)
    .filter(product => product.category === "t-shirts" || product.category === "shorts");

  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section - Different for Desktop and Mobile */}
      <section className="relative bg-secondary">
        {/* Desktop Hero */}
        <div className="hidden md:block">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-16 md:py-24">
            <div className="flex flex-col justify-center">
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
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Brewery Streetwear" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Hero */}
        <div className="md:hidden">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Brewery Streetwear Mobile" 
              className="w-full h-[80vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Elevate Your Streetwear Game
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Premium pieces inspired by Mumbai's vibrant culture.
              </p>
              <Button asChild size="lg" className="text-base w-full">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Crafted with the finest materials for lasting comfort
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Mumbai Inspired</h3>
              <p className="text-sm text-muted-foreground">
                Designs that capture the city's vibrant spirit
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On all orders above ₹999 across India
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Shop with confidence using trusted payment methods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="link" className="group">
              <Link to="/products" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group overflow-hidden border-none rounded-md card-shadow hover-lift">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full product-image-hover"
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
                    <h3 className="font-medium mb-1 group-hover:underline transition-all">
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
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group block relative overflow-hidden aspect-video rounded-lg card-shadow"
              >
                <img 
                  src={`https://images.unsplash.com/photo-1529720317453-c8da503f2051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/40 hover:bg-white/30">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest releases, exclusive offers, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <Button type="submit" className="sm:w-auto">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
