import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product, ProductVariant } from "@/types";
import { FileInput } from "@/components/ui/file-input";
import { Save, X } from "lucide-react";

interface ProductFormDialogProps {
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  formProduct: Partial<Product>;
  setFormProduct: (product: Partial<Product>) => void;
  editingProduct: Product | null;
  productImages: (File | null)[];
  setProductImages: (images: (File | null)[]) => void;
  productImageUrls: string[];
  categories: { name: string; slug: string }[];
  handleSaveProduct: () => void;
  handleAddVariant: () => void;
  handleRemoveVariant: (variantId: string) => void;
  handleVariantChange: (variantId: string, field: keyof ProductVariant, value: any) => void;
  handleFileChange: (index: number, file: File | null) => void;
  handleRemoveImage: (index: number) => void;
  colorOptions: { name: string; code: string }[];
}

export const ProductFormDialog = ({
  showProductForm,
  setShowProductForm,
  formProduct,
  setFormProduct,
  editingProduct,
  productImages,
  setProductImages,
  productImageUrls,
  categories,
  handleSaveProduct,
  handleAddVariant,
  handleRemoveVariant,
  handleVariantChange,
  handleFileChange,
  handleRemoveImage,
  colorOptions
}: ProductFormDialogProps) => {
  return (
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
                value={formProduct.category || ""} 
                onValueChange={(value) => setFormProduct({ ...formProduct, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
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
              className="min-h-[100px] focus:ring-primary/30"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (in ₹)</Label>
              <Input
                id="price"
                type="number"
                value={formProduct.price ? formProduct.price / 100 : ""}
                onChange={(e) => setFormProduct({ ...formProduct, price: Number(e.target.value) * 100 })}
                placeholder="0.00"
                className="focus:ring-primary/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (in ₹)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formProduct.originalPrice ? formProduct.originalPrice / 100 : ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value) * 100;
                  setFormProduct({ ...formProduct, originalPrice: value });
                }}
                placeholder="0.00"
                className="focus:ring-primary/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inStock">In Stock</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="inStock"
                  checked={formProduct.inStock}
                  onCheckedChange={(checked) => setFormProduct({ ...formProduct, inStock: checked })}
                />
                <Label htmlFor="inStock" className="cursor-pointer">
                  {formProduct.inStock ? "Available" : "Out of stock"}
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Product Images</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setProductImages([...productImages, null])}
              >
                Add Image Slot
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productImageUrls.map((url, idx) => (
                <div key={`url-${idx}`} className="relative rounded-md border p-1 overflow-hidden bg-card/50">
                  <img src={url} alt={`Product ${idx + 1}`} className="h-40 w-full object-contain" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full"
                    onClick={() => handleRemoveImage(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {productImages.map((file, idx) => (
                <div key={`upload-${idx}`} className={productImageUrls.length > 0 && idx === 0 ? "hidden" : ""}>
                  <FileInput
                    onFileChange={(file) => handleFileChange(idx, file)}
                    buttonText="Add Image"
                    preview={file ? URL.createObjectURL(file) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Product Variants</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleAddVariant}
              >
                Add Variant
              </Button>
            </div>
            
            <div className="space-y-4">
              {formProduct.variants?.map((variant, idx) => (
                <div key={variant.id} className="p-4 border rounded-md bg-muted/20 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 hover:bg-destructive/10 text-destructive"
                    onClick={() => handleRemoveVariant(variant.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`size-${variant.id}`}>Size</Label>
                      <Select 
                        value={variant.size} 
                        onValueChange={(value) => handleVariantChange(variant.id, 'size', value)}
                      >
                        <SelectTrigger id={`size-${variant.id}`}>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`color-${variant.id}`}>Color</Label>
                      <Select 
                        value={variant.color} 
                        onValueChange={(value) => {
                          const colorOption = colorOptions.find(c => c.name === value);
                          handleVariantChange(variant.id, 'color', value);
                          if (colorOption) {
                            handleVariantChange(variant.id, 'colorCode', colorOption.code);
                          }
                        }}
                      >
                        <SelectTrigger id={`color-${variant.id}`}>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map(color => (
                            <SelectItem key={color.name} value={color.name}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.code }}></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`colorCode-${variant.id}`}>Color Code</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: variant.colorCode }}
                        ></div>
                        <Input
                          id={`colorCode-${variant.id}`}
                          value={variant.colorCode}
                          onChange={(e) => handleVariantChange(variant.id, 'colorCode', e.target.value)}
                          placeholder="#000000"
                          className="focus:ring-primary/30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                      <Input
                        id={`stock-${variant.id}`}
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(variant.id, 'stock', Number(e.target.value))}
                        placeholder="0"
                        className="focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowProductForm(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveProduct}>
            <Save className="mr-2 h-4 w-4" />
            {editingProduct ? "Update Product" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
