export type ProductCondition = 'Pre-Owned' | 'Like New' | 'New';

export interface Product {
  id: string;
  name: string;
  category: string;
  condition: ProductCondition;
  conditionDetails: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages?: string[];
  description: string;
  material: string;
  features: string[];
  isFeatured?: boolean;
  isPreOwned?: boolean;
  stock: number;
  isAssured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  i18nKey?: string;
  iconName: string;
  productCount: number;
  image: string;
  description: string;
  subcategories?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
