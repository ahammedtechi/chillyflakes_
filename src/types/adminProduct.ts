import type { ProductStatus, ProductCategoryRef } from './product';

export type RejectReasonCode =
  | 'poor_image_quality'
  | 'wrong_category'
  | 'incomplete_description'
  | 'prohibited_product'
  | 'price_issue'
  | 'category_not_suitable'
  | 'other';

export interface AdminProductReviewLog {
  id: string;
  reviewed_by: string;
  decision: 'approved' | 'rejected';
  reason_code?: RejectReasonCode;
  reason?: string;
  created_at: string;
}

export interface AdminProductSellerInfo {
  seller_id: string;
  store_name: string;
  seller_name: string;
  email: string;
  mobile_masked: string;
  seller_status: 'approved' | 'under_review' | 'suspended';
}

export interface AdminProductColorGallery {
  color_name: string;
  hex: string;
  images: string[];
}

export interface AdminProductVariant {
  sku: string;
  color_name: string;
  size?: string;
  stock: number;
  price_paise: number;
}

export interface AdminProductDetail {
  id: string;
  title: string;
  title_i18n: {
    en: string;
    ml?: string;
    ta?: string;
    hi?: string;
    kn?: string;
  };
  sku: string;
  main_image_url: string;
  category: ProductCategoryRef;
  price_paise: number;
  mrp_paise: number;
  gst_rate_percent: number;
  total_stock: number;
  status: ProductStatus;
  rejection_reason?: string;
  wholesale_enabled: boolean;
  is_custom_category?: boolean;
  requested_category_name?: string | null;
  subcategory_id?: string | null;
  subcategory?: string;
  requested_subcategory_name?: string | null;
  original_requested_category?: string | null;
  custom_attributes?: { label: string; value: string }[];
  wholesale_tiers?: { min_quantity: number; unit_price_paise: number }[];
  shipping_weight_grams: number;
  shipping_dimensions: { length_cm: number; width_cm: number; height_cm: number };
  attributes: Record<string, string>;
  tags: string[];
  description_i18n: {
    en: string;
    ml?: string;
    ta?: string;
    hi?: string;
    kn?: string;
  };
  color_galleries: AdminProductColorGallery[];
  video_url?: string;
  variants: AdminProductVariant[];
  seller: AdminProductSellerInfo;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  review_history: AdminProductReviewLog[];
}

export interface AdminProductListItem {
  id: string;
  title: string;
  sku: string;
  main_image_url: string;
  category: ProductCategoryRef;
  price_paise: number;
  total_stock: number;
  status: ProductStatus;
  rejection_reason?: string;
  wholesale_enabled: boolean;
  is_custom_category?: boolean;
  requested_category_name?: string | null;
  subcategory_id?: string | null;
  requested_subcategory_name?: string | null;
  original_requested_category?: string | null;
  seller: {
    seller_id: string;
    store_name: string;
  };
  submitted_at: string;
  updated_at: string;
}

export interface AdminApprovePayload {
  category_id?: string | null;
  subcategory_id?: string | null;
  subcategory?: string;
  new_category?: {
    name: string;
    slug: string;
    subcategories?: string[];
  };
  new_subcategory?: {
    name: string;
  };
}

export interface AdminProductStatusCounts {
  all: number;
  pending_review: number;
  approved: number;
  rejected: number;
}

export interface AdminProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminProductListItem[];
  status_counts: AdminProductStatusCounts;
}

export interface AdminProductFilterParams {
  status?: string;
  category?: string;
  seller?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | string;
  role_id?: string;
  role_name?: string;
  permissions?: string[];
}
