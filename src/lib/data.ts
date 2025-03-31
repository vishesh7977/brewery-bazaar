
import { Product } from "@/types";

// Mock product data
export const products: Product[] = [
  {
    id: "prod_1",
    name: "Essential Oversized Tee",
    description: "Crafted from premium cotton, this oversized tee offers unmatched comfort with a modern silhouette. Perfect for layering or as a standalone statement piece.",
    price: 2499,
    originalPrice: 2999,
    category: "t-shirts",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_1", size: "S", color: "Black", colorCode: "#000000", stock: 10 },
      { id: "var_2", size: "M", color: "Black", colorCode: "#000000", stock: 15 },
      { id: "var_3", size: "L", color: "Black", colorCode: "#000000", stock: 20 },
      { id: "var_4", size: "XL", color: "Black", colorCode: "#000000", stock: 10 },
      { id: "var_5", size: "S", color: "White", colorCode: "#FFFFFF", stock: 10 },
      { id: "var_6", size: "M", color: "White", colorCode: "#FFFFFF", stock: 15 },
      { id: "var_7", size: "L", color: "White", colorCode: "#FFFFFF", stock: 20 },
      { id: "var_8", size: "XL", color: "White", colorCode: "#FFFFFF", stock: 10 },
    ],
    featured: true,
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: "prod_2",
    name: "Urban Cargo Pants",
    description: "These cargo pants combine streetwear aesthetics with practical design. Multiple pockets and adjustable features offer both style and functionality.",
    price: 3999,
    category: "pants",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_9", size: "30", color: "Olive", colorCode: "#556B2F", stock: 8 },
      { id: "var_10", size: "32", color: "Olive", colorCode: "#556B2F", stock: 12 },
      { id: "var_11", size: "34", color: "Olive", colorCode: "#556B2F", stock: 15 },
      { id: "var_12", size: "36", color: "Olive", colorCode: "#556B2F", stock: 6 },
      { id: "var_13", size: "30", color: "Black", colorCode: "#000000", stock: 8 },
      { id: "var_14", size: "32", color: "Black", colorCode: "#000000", stock: 12 },
      { id: "var_15", size: "34", color: "Black", colorCode: "#000000", stock: 15 },
      { id: "var_16", size: "36", color: "Black", colorCode: "#000000", stock: 6 },
    ],
    featured: true,
    rating: 4.5,
    reviews: 86,
    inStock: true,
  },
  {
    id: "prod_3",
    name: "Logo Hoodie",
    description: "Stay warm in style with our signature hoodie. Made from heavyweight cotton blend with a brushed interior for maximum comfort and warmth.",
    price: 4999,
    category: "hoodies",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_17", size: "S", color: "Black", colorCode: "#000000", stock: 12 },
      { id: "var_18", size: "M", color: "Black", colorCode: "#000000", stock: 18 },
      { id: "var_19", size: "L", color: "Black", colorCode: "#000000", stock: 22 },
      { id: "var_20", size: "XL", color: "Black", colorCode: "#000000", stock: 15 },
      { id: "var_21", size: "S", color: "Gray", colorCode: "#808080", stock: 10 },
      { id: "var_22", size: "M", color: "Gray", colorCode: "#808080", stock: 16 },
      { id: "var_23", size: "L", color: "Gray", colorCode: "#808080", stock: 20 },
      { id: "var_24", size: "XL", color: "Gray", colorCode: "#808080", stock: 12 },
    ],
    featured: true,
    rating: 4.9,
    reviews: 215,
    inStock: true,
  },
  {
    id: "prod_4",
    name: "Technical Jacket",
    description: "Our Technical Jacket combines weather resistance with urban styling. Multiple pockets and adjustable features make it both practical and fashionable.",
    price: 7999,
    originalPrice: 9999,
    category: "jackets",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_25", size: "S", color: "Black", colorCode: "#000000", stock: 6 },
      { id: "var_26", size: "M", color: "Black", colorCode: "#000000", stock: 10 },
      { id: "var_27", size: "L", color: "Black", colorCode: "#000000", stock: 8 },
      { id: "var_28", size: "XL", color: "Black", colorCode: "#000000", stock: 4 },
    ],
    featured: true,
    rating: 4.7,
    reviews: 58,
    inStock: true,
  },
  {
    id: "prod_5",
    name: "Minimalist Shorts",
    description: "Clean lines and premium materials define our Minimalist Shorts. Perfect for warm weather with a comfortable fit and subtle branded details.",
    price: 2999,
    category: "shorts",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_29", size: "S", color: "Black", colorCode: "#000000", stock: 20 },
      { id: "var_30", size: "M", color: "Black", colorCode: "#000000", stock: 25 },
      { id: "var_31", size: "L", color: "Black", colorCode: "#000000", stock: 25 },
      { id: "var_32", size: "XL", color: "Black", colorCode: "#000000", stock: 15 },
      { id: "var_33", size: "S", color: "Beige", colorCode: "#F5F5DC", stock: 18 },
      { id: "var_34", size: "M", color: "Beige", colorCode: "#F5F5DC", stock: 22 },
      { id: "var_35", size: "L", color: "Beige", colorCode: "#F5F5DC", stock: 22 },
      { id: "var_36", size: "XL", color: "Beige", colorCode: "#F5F5DC", stock: 12 },
    ],
    featured: false,
    rating: 4.6,
    reviews: 92,
    inStock: true,
  },
  {
    id: "prod_6",
    name: "Logo Cap",
    description: "Complete your look with our signature cap featuring embroidered logo details. One size fits most with an adjustable strap.",
    price: 1999,
    category: "accessories",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    variants: [
      { id: "var_37", size: "One Size", color: "Black", colorCode: "#000000", stock: 30 },
      { id: "var_38", size: "One Size", color: "White", colorCode: "#FFFFFF", stock: 25 },
    ],
    featured: false,
    rating: 4.8,
    reviews: 76,
    inStock: true,
  },
];

// Categories for navigation
export const categories = [
  { id: "cat_1", name: "T-Shirts", slug: "t-shirts" },
  { id: "cat_2", name: "Hoodies", slug: "hoodies" },
  { id: "cat_3", name: "Pants", slug: "pants" },
  { id: "cat_4", name: "Shorts", slug: "shorts" },
  { id: "cat_5", name: "Jackets", slug: "jackets" },
  { id: "cat_6", name: "Accessories", slug: "accessories" },
];

// Sample user for testing authentication
export const sampleUser = {
  id: "user_1",
  email: "user@test.com",
  name: "Test User",
  role: "user" as const
};

// Sample admin for testing authentication
export const sampleAdmin = {
  id: "admin_1",
  email: "admin@test.com",
  name: "Admin User",
  role: "admin" as const
};
