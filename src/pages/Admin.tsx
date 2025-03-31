
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { products, categories } from "@/lib/data";
import { Edit, Trash2, Plus, Search, Filter, Package, Users, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  
  // Show login message with demo credentials
  useState(() => {
    toast({
      title: "Admin Dashboard",
      description: "Use admin@test.com / admin to log in",
    });
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,567.89</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground mt-1">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
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
          <Card>
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
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      // Calculate total stock
                      const totalStock = product.variants.reduce(
                        (sum, variant) => sum + variant.stock,
                        0
                      );
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="capitalize">
                            {product.category.replace('-', ' ')}
                          </TableCell>
                          <TableCell>
                            ₹{(product.price / 100).toFixed(2)}
                            {product.originalPrice && (
                              <div className="text-xs text-muted-foreground">
                                Was: ₹{(product.originalPrice / 100).toFixed(2)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
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
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">#ORD-001</div>
                      </TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Jun 21, 2023</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-200 dark:bg-green-800/30 dark:text-green-400 dark:border-green-800">
                          Delivered
                        </div>
                      </TableCell>
                      <TableCell>₹1,999.00</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">#ORD-002</div>
                      </TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Jun 20, 2023</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-400 dark:border-yellow-800">
                          Shipped
                        </div>
                      </TableCell>
                      <TableCell>₹3,499.00</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">#ORD-003</div>
                      </TableCell>
                      <TableCell>Robert Johnson</TableCell>
                      <TableCell>Jun 19, 2023</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:border-blue-800">
                          Processing
                        </div>
                      </TableCell>
                      <TableCell>₹5,999.00</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">John Doe</div>
                      </TableCell>
                      <TableCell>john.doe@example.com</TableCell>
                      <TableCell>Jan 15, 2023</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>₹12,349.50</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Jane Smith</div>
                      </TableCell>
                      <TableCell>jane.smith@example.com</TableCell>
                      <TableCell>Feb 28, 2023</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>₹8,799.00</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Robert Johnson</div>
                      </TableCell>
                      <TableCell>robert.j@example.com</TableCell>
                      <TableCell>Mar 12, 2023</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>₹5,999.00</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
