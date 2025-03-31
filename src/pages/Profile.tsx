
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Package, Star, Heart, LogOut, Edit, Save } from "lucide-react";
import { sampleUser } from "@/lib/data";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real application, this would be fetched from a user context or state
  const [user, setUser] = useState(sampleUser);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("9876543210"); // Example phone number
  
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
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since June 2023</p>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="flex flex-col items-stretch h-auto bg-transparent border-r p-0">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "profile" ? "bg-secondary" : ""}`}
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "orders" ? "bg-secondary" : ""}`}
              >
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium border-b ${activeTab === "reviews" ? "bg-secondary" : ""}`}
              >
                <Star className="h-4 w-4 mr-2" />
                My Reviews
              </button>
              <button 
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center justify-start px-4 py-3 text-left text-sm font-medium ${activeTab === "wishlist" ? "bg-secondary" : ""}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </button>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <Card>
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
                      <h3 className="text-lg font-medium mb-4">Shipping Addresses</h3>
                      <div className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Home</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          123 Main Street, Apartment 4B<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        + Add New Address
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>
                  View and track your order history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
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
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "reviews" && (
            <Card>
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
          )}
          
          {activeTab === "wishlist" && (
            <Card>
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
          )}
        </div>
      </div>
    </div>
  );
}
