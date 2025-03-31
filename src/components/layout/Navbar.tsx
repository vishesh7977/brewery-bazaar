
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { categories } from "@/lib/data";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="h-10 w-auto">
            <img 
              src="/lovable-uploads/5aefe79a-8b57-4e1d-bdf0-4ab6c38fde5b.png" 
              alt="Brewery Logo" 
              className="h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
              location.pathname === "/" ? "text-black dark:text-white" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="link" 
                className={`p-0 text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
                  location.pathname.includes("/products") ? "text-black dark:text-white" : "text-muted-foreground"
                }`}
              >
                Shop
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link 
                    to={`/products?category=${category.slug}`} 
                    className="cursor-pointer w-full"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link to="/products" className="cursor-pointer w-full">
                  View All
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link 
            to="/admin" 
            className={`text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
              location.pathname === "/admin" ? "text-black dark:text-white" : "text-muted-foreground"
            }`}
          >
            Admin
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link to="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden md:flex"
          >
            <Link to="/login" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="py-2">
              <div className="text-base font-medium mb-2">Shop</div>
              <div className="pl-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="block py-1 text-sm text-muted-foreground hover:text-black dark:hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/products"
                  className="block py-1 text-sm text-muted-foreground hover:text-black dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View All
                </Link>
              </div>
            </div>
            <Link
              to="/admin"
              className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <Link
              to="/login"
              className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
