export type ProductStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'unpublished'
  | 'archived';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductCategoryRef {
  id: string | null;
  name: string;
  slug?: string;
}

export interface VendorProduct {
  id: string;
  title: string;
  sku: string;
  main_image_url: string;
  category: ProductCategoryRef;
  price_paise: number;
  price_min_paise?: number;
  price_max_paise?: number;
  total_stock: number;
  colors: ProductColor[];
  status: ProductStatus;
  rejection_reason?: string;
  wholesale_enabled: boolean;
  is_custom_category?: boolean;
  requested_category_name?: string | null;
  subcategory_id?: string | null;
  subcategory?: string;
  custom_subcategory?: string;
  requested_subcategory_name?: string | null;
  original_requested_category?: string | null;
  custom_attributes?: { label: string; value: string }[];
  created_at: string;
  updated_at: string;
}

export interface VendorProductStatusCounts {
  all: number;
  draft: number;
  pending_review: number;
  approved: number;
  rejected: number;
  unpublished: number;
  archived: number;
}

export interface VendorProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VendorProduct[];
  status_counts: VendorProductStatusCounts;
}

export type ProductOrdering =
  | 'updated_desc'
  | 'updated_asc'
  | 'price_asc'
  | 'price_desc'
  | 'stock_asc'
  | 'stock_desc';

export interface VendorProductFilterParams {
  status?: string;
  category?: string;
  wholesale?: boolean | string;
  low_stock?: boolean | string;
  search?: string;
  ordering?: ProductOrdering | string;
  page?: number;
  page_size?: number;
}

export interface ProductImageItem {
  id?: string;
  upload_id: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  order: number;
}

export interface ProductSizeItem {
  label: string;
  stock: number;
  sku: string;
  price_override_paise?: number;
}

export interface ProductColorItem {
  id: string;
  name: string;
  hex: string;
  images: ProductImageItem[];
  sizes: ProductSizeItem[];
}

export interface ProductVideoUpload {
  upload_id: string;
  url: string;
  duration_seconds?: number;
}

export interface ProductShippingConfig {
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  processing_days?: number;
}

export interface ProductWholesaleTier {
  min_qty: number;
  price_paise: number;
}

export interface ProductWholesaleConfig {
  enabled: boolean;
  moq?: number;
  tiers?: ProductWholesaleTier[];
}

export interface VendorProductPayload {
  category_id: string | null;
  requested_category_name?: string | null;
  subcategory_id?: string | null;
  subcategory?: string;
  requested_subcategory_name?: string | null;
  is_custom_category?: boolean;
  custom_category_name?: string;
  custom_subcategory?: string;
  title: string;
  description: string;
  brand?: string;
  translations?: Record<string, { title?: string; description?: string }>;
  tags: string[];
  attributes: Record<string, string | number | boolean | string[]>;
  custom_attributes?: { label: string; value: string }[];
  has_colors: boolean;
  colors?: ProductColorItem[];
  images?: ProductImageItem[];
  video_upload?: ProductVideoUpload | null;
  mrp_paise: number;
  price_paise: number;
  gst_rate: number;
  hsn?: string;
  stock?: number;
  shipping: ProductShippingConfig;
  wholesale: ProductWholesaleConfig;
}

export interface VendorProductDetailResponse extends VendorProduct {
  custom_category_name?: string;
  requested_category_name?: string | null;
  subcategory_id?: string | null;
  subcategory?: string;
  custom_subcategory?: string;
  requested_subcategory_name?: string | null;
  is_custom_category?: boolean;
  original_requested_category?: string | null;
  custom_attributes?: { label: string; value: string }[];
  description: string;
  brand?: string;
  translations?: Record<string, { title?: string; description?: string }>;
  tags: string[];
  attributes: Record<string, string | number | boolean | string[]>;
  has_colors: boolean;
  color_items?: ProductColorItem[];
  image_items?: ProductImageItem[];
  video_upload?: ProductVideoUpload | null;
  mrp_paise: number;
  gst_rate: number;
  hsn?: string;
  shipping: ProductShippingConfig;
  wholesale: ProductWholesaleConfig;
}

export interface UploadResponse {
  id: string;
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  size?: number;
  duration?: number;
}

