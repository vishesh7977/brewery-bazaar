
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand Description */}
          <div className="space-y-4">
            <div className="h-8 w-auto">
              <img 
                src="/lovable-uploads/5aefe79a-8b57-4e1d-bdf0-4ab6c38fde5b.png" 
                alt="Brewery Logo" 
                className="h-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Premium streetwear brand offering stylish and affordable clothing inspired by Mumbai's vibrant culture.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=t-shirts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=hoodies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/products?category=pants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pants
                </Link>
              </li>
              <li>
                <Link to="/products?category=shorts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shorts
                </Link>
              </li>
              <li>
                <Link to="/products?category=jackets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brewery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
