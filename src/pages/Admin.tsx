import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { products as initialProducts, categories } from "@/lib/data";
import { Edit, Trash2, Plus, Search, Filter, Package, Users, ShoppingCart, Save, Eye, X, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product, ProductVariant, Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, 
} from "@/components/ui/alert-dialog";

// Helper component for order status badge
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Processing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300";
      case "Shipped":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300";
      case "Delivered":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-300";
      case "Cancelled":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-300";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

export default function Admin() {
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Get products from localStorage or use initial data
  const [products, setProducts] = useLocalStorage<Product[]>("products", initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  // Get orders from localStorage or use empty array
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  
  // Get customers from localStorage
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  
  // Form state for product editing/creation
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 2000,
    category: "t-shirts",
    images: ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"],
    variants: [
      {
        id: "var1",
        size: "M",
        color: "Black",
        colorCode: "#000000",
        stock: 10
      }
    ],
    rating: 4.5,
    reviews: 0,
    inStock: true
  });
  
  
  
  // Show login message with demo credentials
  useEffect(() => {
    toast({
      title: "Admin Dashboard",
      description: "Use admin@test.com / admin to log in",
    });
  }, []);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === null || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormProduct({
      name: "",
      description: "",
      price: 2000,
      category: "t-shirts",
      images: ["https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"],
      variants: [
        {
          id: "var1",
          size: "M",
          color: "Black",
          colorCode: "#000000",
          stock: 10
        }
      ],
      rating: 4.5,
      reviews: 0,
      inStock: true
    });
    setShowProductForm(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setShowProductForm(true);
  };
  
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed.",
    });
  };
  
  const handleSaveProduct = () => {
    if (!formProduct.name || !formProduct.price || !formProduct.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formProduct as Product, id: editingProduct.id } : p
      ));
      
      toast({
        title: "Product updated",
        description: `${formProduct.name} has been updated successfully.`,
      });
    } else {
      // Add new product
      const newId = `product-${Date.now()}`;
      const newProduct = {
        ...formProduct as Product,
        id: newId,
      };
      
      setProducts([...products, newProduct]);
      
      toast({
        title: "Product added",
        description: `${formProduct.name} has been added successfully.`,
      });
    }
    
    setShowProductForm(false);
  };
  
  const handleAddVariant = () => {
    const variants = formProduct.variants || [];
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      size: "M",
      color: "Black",
      colorCode: "#000000",
      stock: 10
    };
    
    setFormProduct({
      ...formProduct,
      variants: [...variants, newVariant]
    });
  };
  
  const handleRemoveVariant = (variantId: string) => {
    const updatedVariants = formProduct.variants?.filter(v => v.id !== variantId) || [];
    setFormProduct({
      ...formProduct,
      variants: updatedVariants
    });
  };
  
  const handleVariantChange = (variantId: string, field: keyof ProductVariant, value: any) => {
    const updatedVariants = formProduct.variants?.map(v => {
      if (v.id === variantId) {
        return { ...v, [field]: value };
      }
      return v;
    }) || [];
    
    setFormProduct({
      ...formProduct,
      variants: updatedVariants
    });
  };
  
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    setOrders(updatedOrders);
    
    toast({
      title: "Order updated",
      description: `Order #${orderId} status changed to ${status}`,
    });
  };
  
  // Delete an order
  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
    setViewingOrder(null);
    
    toast({
      title: "Order deleted",
      description: `Order #${orderId} has been deleted.`,
    });
  };
  
  // Generate color options
  const colorOptions = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Gray", code: "#808080" },
    { name: "Navy", code: "#000080" },
    { name: "Red", code: "#FF0000" },
    { name: "Green", code: "#008000" },
    { name: "Blue", code: "#0000FF" },
    { name: "Yellow", code: "#FFFF00" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
      >
        Admin Dashboard
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orders.length} orders processed
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden bg-gradient-to-br from-orange-500/5 to-orange-500/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orders.filter(o => o.status === "Processing").length} pending
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In {categories.length} categories
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.filter(c => c.orders > 0).length} active
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your product inventory, prices, and details.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={filterCategory || "all"} 
                    onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 transition-colors">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              
              <div className="rounded-md border">
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Stock</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        // Calculate total stock
                        const totalStock = product.variants.reduce(
                          (sum, variant) => sum + variant.stock,
                          0
                        );
                        
                        return (
                          <tr key={product.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.id}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 capitalize">
                              {product.category.replace('-', ' ')}
                            </td>
                            <td className="p-3">
                              ₹{(product.price / 100).toFixed(2)}
                              {product.originalPrice && (
                                <div className="text-xs text-muted-foreground">
                                  Was: ₹{(product.originalPrice / 100).toFixed(2)}
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div
                                className={`text-sm ${
                                  totalStock < 10
                                    ? "text-destructive"
                                    : totalStock < 20
                                    ? "text-yellow-600 dark:text-yellow-500"
                                    : "text-green-600 dark:text-green-500"
                                }`}
                              >
                                {totalStock} units
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                  asChild
                                >
                                  <Link to={`/product/${product.id}`} target="_blank">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-destructive/10"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-10">
                            <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                            <p className="text-muted-foreground">No products found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    View and manage customer orders and shipments.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              
              <div className="rounded-md border">
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3">Order ID</th>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="font-medium">#{order.id}</div>
                            </td>
                            <td className="p-3">{order.customer.name}</td>
                            <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-3">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="p-3">₹{(order.total / 100).toFixed(2)}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="hover:bg-primary/10"
                                  onClick={() => setViewingOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      className="hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete order #{order.id}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-10">
                            <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                            <p className="text-muted-foreground">No orders found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>
                    View and manage your customer accounts.
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search customers..."
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              
              <div className="rounded-md border">
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Orders</th>
                        <th className="text-left p-3">Spent</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <tr key={customer.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="font-medium">{customer.name}</div>
                            </td>
                            <td className="p-3">{customer.email}</td>
                            <td className="p-3">{new Date(customer.joinedDate).toLocaleDateString()}</td>
                            <td className="p-3">{customer.orders}</td>
                            <td className="p-3">₹{(customer.spent / 100).toFixed(2)}</td>
                            <td className="p-3 text-right">
                              <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-10">
                            <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                            <p className="text-muted-foreground">No customers found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Product form dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Make changes to the product here. Click save when you're done." 
                : "Add details for the new product here."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formProduct.name || ""}
                  onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                  placeholder="Product name"
                  className="focus:ring-primary/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formProduct.category || "t-shirts"} 
                  onValueChange={(value) => setFormProduct({ ...formProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formProduct.description || ""}
                onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                placeholder="Product description"
                rows={4}
                className="focus:ring-primary/30"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (in paise)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={formProduct.price || 0}
                  onChange={(e) => setFormProduct({ ...formProduct, price: parseInt(e.target.value) })}
                  placeholder="Price"
                  className="focus:ring-primary/30"
                />
                <p className="text-sm text-muted-foreground">
                  ₹{((formProduct.price || 0) / 100).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="original-price">Original Price (Optional)</Label>
                <Input
                  id="original-price"
                  type="number"
                  min="0"
                  step="100"
                  value={formProduct.originalPrice || ""}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    setFormProduct({ ...formProduct, originalPrice: value });
                  }}
                  placeholder="Original price"
                  className="focus:ring-primary/30"
                />
                {formProduct.originalPrice && (
                  <p className="text-sm text-muted-foreground">
                    ₹{(formProduct.originalPrice / 100).toFixed(2)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="status" 
                    checked={formProduct.inStock} 
                    onCheckedChange={(checked) => setFormProduct({ ...formProduct, inStock: checked })}
                  />
                  <Label htmlFor="status">{formProduct.inStock ? "In Stock" : "Out of Stock"}</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="images">Images (URLs)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(formProduct.images
