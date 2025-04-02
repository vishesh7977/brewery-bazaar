
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { PageLoader } from "./components/ui/page-loader";
import { useLocalStorage } from "./hooks/use-local-storage";
import { products as initialProducts } from "./lib/data";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";

// Support pages
import SupportHome from "./pages/support/SupportHome";
import FAQs from "./pages/support/FAQs";
import ShippingInfo from "./pages/support/ShippingInfo";
import ReturnsExchanges from "./pages/support/ReturnsExchanges";
import SizeGuide from "./pages/support/SizeGuide";
import TrackOrder from "./pages/support/TrackOrder";

const queryClient = new QueryClient();

// ScrollToTop component to handle scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected route for admin panel
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, this would check the authenticated user's role
  // For demo, we'll consider the user with email admin@test.com as admin
  const isAdmin = localStorage.getItem("userRole") === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Protected route for user pages
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, this would check if the user is authenticated
  // For demo, we'll consider any userRole in localStorage as authenticated
  const isAuthenticated = !!localStorage.getItem("userRole");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  
  // Initialize products in localStorage if not present
  const [products, setProducts] = useLocalStorage("products", initialProducts);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <PageLoader loading={loading} />
      <div className={`flex flex-col min-h-screen ${loading ? 'overflow-hidden' : ''}`}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Support Routes */}
            <Route path="/support" element={<SupportHome />} />
            <Route path="/support/faqs" element={<FAQs />} />
            <Route path="/support/shipping" element={<ShippingInfo />} />
            <Route path="/support/returns" element={<ReturnsExchanges />} />
            <Route path="/support/size-guide" element={<SizeGuide />} />
            <Route path="/support/track-order" element={<TrackOrder />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
