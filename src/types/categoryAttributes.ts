export type AttributeType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'boolean';

export interface AttributeOption {
  value: string;
  label: string;
}

export interface CategoryAttributeDefinition {
  key: string;
  label: string;
  type: AttributeType;
  required: boolean;
  options?: AttributeOption[];
  unit?: string;
  placeholder?: string;
  helperText?: string;
}

export interface VendorCategoryWithAttributes {
  id: string;
  name: string;
  slug?: string;
  description: string;
  iconName?: string;
  image?: string;
  subcategories: string[];
  sizes_enabled: boolean;
  default_sizes?: string[];
  attributes: CategoryAttributeDefinition[];
  is_active?: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: string[];
  is_active: boolean;
  product_count: number;
  created_at: string;
  created_by?: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  subcategories?: string[];
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  is_active?: boolean;
  subcategories?: string[];
}
