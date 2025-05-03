import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ChevronRight, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CustomLogo } from "./CustomLogo";

export default function Footer() {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Newsletter subscription successful",
      description: "Thank you for subscribing to our newsletter!"
    });
    (e.target as HTMLFormElement).reset();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <footer className="border-t border-border bg-background">
      {/* Features Banner */}
      <div className="bg-secondary py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">UPI, Cards & More</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium">Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">1-Year Warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="py-10 bg-brewery-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest releases, exclusive offers, and style inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background"
                required
              />
              <Button type="submit" className="sm:w-auto">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand Description */}
          <motion.div variants={item} className="space-y-4">
            <div className="h-8 w-auto">
              <CustomLogo />
            </div>
            <p className="text-sm text-muted-foreground">
              Premium streetwear brand offering stylish and affordable clothing inspired by Mumbai's vibrant culture.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <a href="mailto:contact@brewery.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  contact@brewery.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">
                  42 Fashion Street, Mumbai - 400001
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div variants={item} className="space-y-4">
            <h4 className="text-lg font-semibold">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=t-shirts" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=shorts" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Shorts
                </Link>
              </li>
              <li>
                <Link to="/products?category=hoodies" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/products?category=jackets" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Jackets
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Sale
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={item} className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support - Updated with direct links to separate support pages */}
          <motion.div variants={item} className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support/faqs" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support/shipping" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/support/returns" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/support/size-guide" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/support/track-order" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Support Home
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brewery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
