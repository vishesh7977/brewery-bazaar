
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, Plus, Package, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";

interface ProductsTabContentProps {
  products: Product[];
  filteredProducts: Product[];
  categories: { name: string; slug: string }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (productId: string) => void;
}

export const ProductsTabContent = ({
  products,
  filteredProducts,
  categories,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct
}: ProductsTabContentProps) => {
  return (
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
  );
};
