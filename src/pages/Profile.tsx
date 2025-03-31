
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Package, Star, Heart, LogOut, Edit, Save, Plus, Trash } from "lucide-react";
import { sampleUser } from "@/lib/data";
import { Address } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { shippingAddress, setShippingAddress } = useCart();
  
  // In a real application, this would be fetched from a user context or state
  const [user, setUser] = useState(sampleUser);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("9876543210"); // Example phone number
  
  // Addresses management
  const [addresses, setAddresses] = useLocalStorage<Address[]>("saved-addresses", []);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  
  // Orders from localStorage
  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  
  // Load saved address on mount if none exists
  useEffect(() => {
    if (addresses.length === 0 && shippingAddress) {
      setAddresses([shippingAddress]);
    }
  }, [shippingAddress]);
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };
  
  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: name,
      email: email,
    });
    
    // Save to localStorage for persistence
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };
  
  const handleAddressChange = (field: keyof Address, value: string) => {
    setNewAddress({ ...newAddress, [field]: value });
  };
  
  const handleSaveAddress = () => {
    if (editingAddressIndex !== null) {
      // Update existing address
      const updatedAddresses = [...addresses];
      updatedAddresses[editingAddressIndex] = newAddress;
      setAddresses(updatedAddresses);
      
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully",
      });
    } else {
      // Add new address
      setAddresses([...addresses, newAddress]);
      
      toast({
        title: "Address added",
        description: "Your new address has been saved",
      });
    }
    
    // Also update shipping address in cart if it's the first address
    if (addresses.length === 0) {
      setShippingAddress(newAddress);
    }
    
    setIsAddingAddress(false);
    setEditingAddressIndex(null);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    });
  };
  
  const handleEditAddress = (index: number) => {
    setEditingAddressIndex(index);
    setNewAddress(addresses[index]);
    setIsAddingAddress(true);
  };
  
  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
    
    toast({
      title: "Address removed",
      description: "The address has been removed from your profile",
    });
  };
  
  const handleSetDefaultAddress = (index: number) => {
    const selectedAddress = addresses[index];
    setShippingAddress(selectedAddress);
    
    toast({
      title: "Default address set",
      description: "This address will be used for your next order",
    });
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  <>
                    Cancel <Edit className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Edit Profile <Edit className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Full Name
                      </h3>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Email
                      </h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Phone
                      </h3>
                      <p>+91 {phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Account Type
                      </h3>
                      <p className="capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Shipping Addresses</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setNewAddress({
                            street: "",
                            city: "",
                            state: "",
                            zipCode: "",
                            country: "India"
                          });
                          setEditingAddressIndex(null);
                          setIsAddingAddress(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Address
                      </Button>
                    </div>
                    
                    {addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{index === 0 ? "Default Address" : `Address ${index + 1}`}</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditAddress(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-destructive"
                                  onClick={() => handleDeleteAddress(index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zipCode}<br />
                              {address.country}
                            </p>
                            {index !== 0 && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultAddress(index)}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center border rounded-lg p-8">
                        <p className="text-muted-foreground mb-4">You haven't added any addresses yet</p>
                        <Button 
                          variant="outline"
                          onClick={() => setIsAddingAddress(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Address
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case "orders":
        return (
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>
                View and track your order history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-muted-foreground">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:border-blue-800">
                            {order.status}
                          </div>
                          <div className="font-medium">
                            ₹{(order.total / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-medium mb-2">Items</div>
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-secondary rounded-md overflow-hidden">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium line-clamp-1">{item.product.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.variant.size}, {item.variant.color} • Qty: {item.quantity}
                                </div>
                              </div>
                              <div className="text-sm">
                                ₹{(item.price / 100).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case "reviews":
        return (
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>
                Manage your product reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="py-6 text-center">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't reviewed any products yet.
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    Browse Products
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "wishlist":
        return (
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>
                Products you've saved for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="py-6 text-center">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Save items you're interested in for later.
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    Explore Products
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center p-6 bg-secondary/30 rounded-lg backdrop-blur-sm border border-border/50"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since June 2023</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm"
          >
            <nav className="flex flex-col">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "profile" ? "bg-secondary/50" : ""}`}
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "orders" ? "bg-secondary/50" : ""}`}
              >
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "reviews" ? "bg-secondary/50" : ""}`}
              >
                <Star className="h-4 w-4 mr-2" />
                My Reviews
              </button>
              <button 
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium ${activeTab === "wishlist" ? "bg-secondary/50" : ""}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </button>
            </nav>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-3"
        >
          {renderTabContent()}
        </motion.div>
      </div>
      
      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingAddressIndex !== null ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddressIndex !== null 
                ? "Update your address details below." 
                : "Fill in your address details below."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={newAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={newAddress.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingAddress(false);
              setEditingAddressIndex(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress}>
              {editingAddressIndex !== null ? "Update Address" : "Save Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
