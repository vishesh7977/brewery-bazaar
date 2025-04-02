
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react";
import { categories } from "@/lib/data";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter categories to only show T-shirts and Shorts
  const filteredCategories = categories.filter(
    category => category.slug === "t-shirts" || category.slug === "shorts"
  );

  // Check authentication status
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    setIsAuthenticated(!!role);
  }, [location.pathname]); // Re-check when route changes

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserRole(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    navigate("/login");
  };

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="h-10 w-auto">
            <img 
              src="/lovable-uploads/79b98de2-50cc-47c0-b418-3357179b4a84.png" 
              alt="Brewery Logo" 
              className="h-full object-contain dark:invert" 
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
              {filteredCategories.map((category) => (
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
            to="/about-us" 
            className={`text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
              location.pathname === "/about-us" ? "text-black dark:text-white" : "text-muted-foreground"
            }`}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
              location.pathname === "/contact" ? "text-black dark:text-white" : "text-muted-foreground"
            }`}
          >
            Contact
          </Link>
          {userRole === "admin" && (
            <Link 
              to="/admin" 
              className={`text-sm font-medium hover:text-black dark:hover:text-white transition-colors ${
                location.pathname === "/admin" ? "text-black dark:text-white" : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
          )}
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
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {localStorage.getItem("userName")}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
          
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
                {filteredCategories.map((category) => (
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
              to="/about-us"
              className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin"
                className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start p-0 h-auto py-2 text-base font-medium hover:text-black dark:hover:text-white"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-base font-medium hover:text-black dark:hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
