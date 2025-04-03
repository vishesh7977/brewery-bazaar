
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { products as initialProducts, categories } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Product, ProductVariant, Order, OrderStatus } from "@/types";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Package, ShoppingCart, Users } from "lucide-react";

// Import refactored components
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { DashboardTabContent } from "@/components/admin/DashboardTabContent";
import { ProductsTabContent } from "@/components/admin/ProductsTabContent";
import { OrdersTabContent } from "@/components/admin/OrdersTabContent";
import { CustomersTabContent } from "@/components/admin/CustomersTabContent";
import { ProductFormDialog } from "@/components/admin/ProductFormDialog";

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Get products from localStorage or use initial data
  const [products, setProducts] = useLocalStorage<Product[]>("products", initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  // Get orders from localStorage or use empty array
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Get customers from localStorage
  const [customers, setCustomers] = useLocalStorage<any[]>("customers", []);
  
  // For file uploads
  const [productImages, setProductImages] = useState<(File | null)[]>([null]);
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  
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
  
  // Handle uploaded images when added or removed
  useEffect(() => {
    // Convert any uploaded files to data URLs
    const convertFilesToUrls = async () => {
      const urls: string[] = [];
      
      for (const fileOrNull of productImages) {
        if (fileOrNull) {
          const url = await readFileAsDataURL(fileOrNull);
          urls.push(url);
        }
      }
      
      // Maintain existing image URLs that came from formProduct
      const existingUrls = formProduct.images?.filter(url => 
        !url.startsWith('blob:') && !url.startsWith('data:')
      ) || [];
      
      const allUrls = [...existingUrls, ...urls];
      
      setProductImageUrls(allUrls);
      setFormProduct(prev => ({
        ...prev,
        images: allUrls
      }));
    };
    
    convertFilesToUrls();
  }, [productImages]);
  
  // Read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };
  
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
      images: [],
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
    setProductImages([null]);
    setProductImageUrls([]);
    setShowProductForm(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormProduct(product);
    setProductImages([null]);
    setProductImageUrls(product.images || []);
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
    
    // Ensure there's at least one image
    if (!formProduct.images?.length) {
      toast({
        title: "Missing image",
        description: "Please add at least one product image.",
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
  
  const handleFileChange = (index: number, file: File | null) => {
    const newProductImages = [...productImages];
    newProductImages[index] = file;
    
    // If this was the last slot and a file was added, create a new empty slot
    if (index === productImages.length - 1 && file) {
      newProductImages.push(null);
    }
    
    setProductImages(newProductImages);
  };
  
  const handleRemoveImage = (index: number) => {
    // Remove from URLs array
    const newUrls = [...productImageUrls];
    newUrls.splice(index, 1);
    setProductImageUrls(newUrls);
    
    // Update form product
    setFormProduct(prev => ({
      ...prev,
      images: newUrls
    }));
    
    // If this was a file upload slot, remove it from productImages as well
    if (index < productImages.length) {
      const newProductImages = [...productImages];
      newProductImages.splice(index, 1);
      
      // Make sure we always have at least one upload slot
      if (newProductImages.length === 0) {
        newProductImages.push(null);
      }
      
      setProductImages(newProductImages);
    }
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
      
      <DashboardCards 
        orders={orders} 
        products={products} 
        categories={categories} 
        customers={customers} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
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

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <DashboardTabContent orders={orders} setActiveTab={setActiveTab} />
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <ProductsTabContent 
            products={products}
            filteredProducts={filteredProducts}
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <OrdersTabContent
            orders={orders}
            setViewingOrder={setViewingOrder}
          />
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers">
          <CustomersTabContent customers={customers} />
        </TabsContent>
      </Tabs>
      
      {/* Product form dialog */}
      <ProductFormDialog
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        formProduct={formProduct}
        setFormProduct={setFormProduct}
        editingProduct={editingProduct}
        productImages={productImages}
        setProductImages={setProductImages}
        productImageUrls={productImageUrls}
        categories={categories}
        handleSaveProduct={handleSaveProduct}
        handleAddVariant={handleAddVariant}
        handleRemoveVariant={handleRemoveVariant}
        handleVariantChange={handleVariantChange}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        colorOptions={colorOptions}
      />
    </div>
  );
}
