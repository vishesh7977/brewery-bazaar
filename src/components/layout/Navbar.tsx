
// Import the CustomLogo component
import { CustomLogo } from "./CustomLogo";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Search, ShoppingCart, Menu, User, Heart, LogOut } from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform search logic here using the searchQuery state
    console.log("Searching for:", searchQuery);
  };

  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  // Check if the current route is the admin panel
  const isAdminPanel = location.pathname.startsWith("/admin");

  // Get cart item count from cart items array
  const cartItemCount = cart.items ? cart.items.length : 0;

  return (
    <div className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:w-2/3 md:w-1/2">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore our site and discover something new.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <Link to="/" className="block py-2 hover:bg-secondary rounded-md px-3">Home</Link>
              <Link to="/products" className="block py-2 hover:bg-secondary rounded-md px-3">Products</Link>
              <Link to="/about-us" className="block py-2 hover:bg-secondary rounded-md px-3">About Us</Link>
              <Link to="/contact" className="block py-2 hover:bg-secondary rounded-md px-3">Contact</Link>
              {userRole === "admin" && (
                <Link to="/admin" className="block py-2 hover:bg-secondary rounded-md px-3">Admin Panel</Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <CustomLogo />

        {/* Search Bar (Hidden on small screens) */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 pr-2 w-[300px] md:w-[400px] bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="ml-2">Search</Button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* Profile Dropdown */}
          {userRole ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{userName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                {userRole === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-settings w-4 h-4 mr-2"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.11a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h.11a2 2 0 0 1 2 2v.11a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.11a2 2 0 0 1 2-2h4a2 2 0 0 0 2 2v.11a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-.11a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2h-.44Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
