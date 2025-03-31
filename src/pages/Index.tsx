
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Index() {
  // Filter products that are marked as featured
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Elevate Your Streetwear Game</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Premium pieces inspired by Mumbai's vibrant culture. Quality craftsmanship meets urban aesthetics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <Link to="/products">Shop Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/products?category=new-arrivals">New Arrivals</Link>
              </Button>
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
                <Card className="group overflow-hidden border-none rounded-md">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group block bg-secondary rounded-md overflow-hidden aspect-square relative hover:bg-secondary/80 transition-colors"
              >
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <span className="font-medium group-hover:underline">
                    {category.name}
                  </span>
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
