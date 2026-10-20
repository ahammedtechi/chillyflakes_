import { z } from 'zod';
import type { VendorCategoryWithAttributes } from '../../../types/categoryAttributes';
import { isValidCategoryString } from '../utils/categoryMatching';

export const wholesaleTierSchema = z.object({
  min_qty: z.number().int().min(2, 'Tier quantity must be at least 2 units.'),
  price_paise: z.number().int().min(1, 'Price per unit must be greater than ₹0.'),
});

export const wholesaleConfigSchema = z
  .object({
    enabled: z.boolean(),
    moq: z.number().int().min(2, 'Minimum order quantity must be at least 2.').optional(),
    tiers: z.array(wholesaleTierSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.enabled) return;

    if (!data.moq || data.moq < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimum order quantity is required when wholesale is enabled (min 2 units).',
        path: ['moq'],
      });
    }

    const tiers = data.tiers || [];
    if (tiers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add at least one wholesale bulk pricing tier.',
        path: ['tiers'],
      });
      return;
    }

    for (let i = 0; i < tiers.length; i++) {
      const current = tiers[i];
      if (i > 0) {
        const prev = tiers[i - 1];
        if (current.min_qty <= prev.min_qty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Tier ${i + 1} quantity (${current.min_qty}) must be strictly greater than tier ${i} quantity (${prev.min_qty}).`,
            path: ['tiers', i, 'min_qty'],
          });
        }
        if (current.price_paise >= prev.price_paise) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Tier ${i + 1} price per unit must be strictly lower than tier ${i} price (bulk discount).`,
            path: ['tiers', i, 'price_paise'],
          });
        }
      }
    }
  });

export const shippingConfigSchema = z.object({
  weight_g: z.number().min(1, 'Product weight must be at least 1 gram.'),
  length_cm: z.number().min(0.5, 'Package length must be at least 0.5 cm.'),
  width_cm: z.number().min(0.5, 'Package width must be at least 0.5 cm.'),
  height_cm: z.number().min(0.5, 'Package height must be at least 0.5 cm.'),
  processing_days: z.number().int().min(1).max(30).optional(),
});

export const productImageItemSchema = z.object({
  id: z.string().optional(),
  upload_id: z.string().min(1, 'Upload ID required'),
  url: z.string().url('Invalid image URL'),
  alt: z.string().max(150, 'Alt text cannot exceed 150 characters').optional(),
  is_primary: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const productSizeItemSchema = z.object({
  label: z.string().min(1, 'Size label is required.'),
  stock: z.number().int().min(0, 'Stock cannot be negative.'),
  sku: z.string().min(2, 'SKU is required (minimum 2 characters).'),
  price_override_paise: z.number().int().min(100).optional(),
});

export const productColorItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Color name is required.').max(50, 'Color name is too long.'),
  hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Valid hex color required.'),
  images: z
    .array(productImageItemSchema)
    .min(1, 'Each color must have at least 1 photo.')
    .max(6, 'Each color can have at most 6 photos.'),
  sizes: z.array(productSizeItemSchema).min(1, 'At least one size / SKU row is required for this color.'),
});

export const draftProductSchema = z.object({
  title: z.string().min(1, 'Product title is required to save a draft.').max(120, 'Title cannot exceed 120 characters.'),
  category_id: z.string().nullable().optional(),
});

export const submitProductSchema = z
  .object({
    category_id: z.string().nullable().optional(),
    custom_category_name: z.string().optional(),
    requested_category_name: z.string().nullable().optional(),
    is_custom_category: z.boolean().optional(),
    subcategory: z.string().optional(),
    custom_subcategory: z.string().optional(),
    requested_subcategory_name: z.string().nullable().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters.').max(120, 'Title cannot exceed 120 characters.'),
    description: z
      .string()
      .min(50, 'Description must be at least 50 characters of plain text.')
      .refine((val) => !/<[a-z][\s\S]*>/i.test(val), {
        message: 'HTML tags are not allowed in description. Plain text with line breaks only.',
      }),
    brand: z.string().max(80, 'Brand name too long.').optional(),
    tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed.'),
    attributes: z.record(z.any()),
    custom_attributes: z.array(z.object({ label: z.string(), value: z.string() })).max(8).optional(),
    has_colors: z.boolean(),
    colors: z.array(productColorItemSchema).max(12, 'Maximum 12 colors allowed.').optional(),
    images: z.array(productImageItemSchema).max(8, 'Maximum 8 images allowed.').optional(),
    video_upload: z
      .object({
        upload_id: z.string(),
        url: z.string().url(),
        duration_seconds: z.number().max(60, 'Video duration cannot exceed 60 seconds.').optional(),
      })
      .nullable()
      .optional(),
    mrp_paise: z.number().int().min(100, 'Base price (MRP) must be at least ₹1.'),
    price_paise: z.number().int().min(100, 'Selling price must be at least ₹1.'),
    gst_rate: z.number(),
    hsn: z.string().max(20).optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative.').optional(),
    shipping: shippingConfigSchema,
    wholesale: wholesaleConfigSchema,
  })
  .superRefine((data, ctx) => {
    // 0. Custom Category Name validation
    const isOtherCategory = data.category_id === 'other' || data.category_id === null || data.is_custom_category;

    if (!data.category_id && !isOtherCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a sellable category.',
        path: ['category_id'],
      });
    }

    if (isOtherCategory) {
      const catName = (data.custom_category_name || data.requested_category_name || '').trim();
      if (!catName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category name is required (3–50 characters, letters, numbers, spaces, & and -).',
          path: ['custom_category_name'],
        });
      } else if (catName.length < 3 || catName.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category name must be between 3 and 50 characters.',
          path: ['custom_category_name'],
        });
      } else if (!isValidCategoryString(catName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Category name can only contain letters, numbers, spaces, &, and hyphens (-).',
          path: ['custom_category_name'],
        });
      }
    }

    const subName = (data.custom_subcategory || data.requested_subcategory_name || '').trim();
    if (subName) {
      if (subName.length < 3 || subName.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom subcategory must be between 3 and 50 characters.',
          path: ['custom_subcategory'],
        });
      } else if (!isValidCategoryString(subName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom subcategory can only contain letters, numbers, spaces, &, and hyphens (-).',
          path: ['custom_subcategory'],
        });
      }
    }

    // 1. Selling price <= MRP
    if (data.price_paise > data.mrp_paise) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selling price (₹) cannot be greater than Base Price MRP (₹).',
        path: ['price_paise'],
      });
    }

    // 2. Variants vs Standalone Media
    if (data.has_colors) {
      if (!data.colors || data.colors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please add at least one color variant or disable color variants.',
          path: ['colors'],
        });
      } else {
        // Check for duplicate color names (case-insensitive)
        const seenNames = new Set<string>();
        data.colors.forEach((col, idx) => {
          const lower = col.name.trim().toLowerCase();
          if (lower) {
            if (seenNames.has(lower)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplicate color name '${col.name}'. Each color must have a unique name.`,
                path: ['colors', idx, 'name'],
              });
            } else {
              seenNames.add(lower);
            }
          }

          // Check if color has at least 1 image
          if (!col.images || col.images.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Color '${col.name || idx + 1}' must have at least 1 image.`,
              path: ['colors', idx, 'images'],
            });
          }
        });
      }
    } else {
      // Standalone images required
      if (!data.images || data.images.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please upload at least 1 product image.',
          path: ['images'],
        });
      }
    }
  });

export interface FormValidationErrorItem {
  path: string;
  message: string;
  sectionId: string;
}

export function mapFieldToSection(path: string): string {
  if (
    path.startsWith('category_id') ||
    path.startsWith('subcategory') ||
    path.startsWith('custom_category_name') ||
    path.startsWith('custom_subcategory')
  ) {
    return 'section-category';
  }
  if (
    path.startsWith('title') ||
    path.startsWith('description') ||
    path.startsWith('brand') ||
    path.startsWith('tags') ||
    path.startsWith('translations')
  ) {
    return 'section-basic-details';
  }
  if (path.startsWith('attributes')) {
    return 'section-attributes';
  }
  if (path.startsWith('colors') || path.startsWith('has_colors') || path.includes('sizes')) {
    return 'section-variants';
  }
  if (path.startsWith('images') || path.startsWith('video_upload')) {
    return 'section-media';
  }
  if (path.startsWith('price_paise') || path.startsWith('mrp_paise') || path.startsWith('gst_rate') || path.startsWith('hsn') || path.startsWith('stock')) {
    return 'section-pricing';
  }
  if (path.startsWith('shipping')) {
    return 'section-shipping';
  }
  if (path.startsWith('wholesale')) {
    return 'section-wholesale';
  }
  return 'section-basic-details';
}

export function validateProductSubmission(
  values: any,
  categoryDef?: VendorCategoryWithAttributes
): {
  success: boolean;
  fieldErrors: Record<string, string>;
  errorList: FormValidationErrorItem[];
} {
  const fieldErrors: Record<string, string> = {};
  const errorList: FormValidationErrorItem[] = [];

  const result = submitProductSchema.safeParse(values);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const pathStr = issue.path.join('.');
      if (!fieldErrors[pathStr]) {
        fieldErrors[pathStr] = issue.message;
        errorList.push({
          path: pathStr,
          message: issue.message,
          sectionId: mapFieldToSection(pathStr),
        });
      }
    }
  }

  // Validate dynamic category required attributes (only for predefined categories, not custom 'other')
  if (categoryDef && categoryDef.id !== 'other' && categoryDef.attributes) {
    for (const attr of categoryDef.attributes) {
      if (attr.required) {
        const val = values.attributes?.[attr.key];
        const isEmpty =
          val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0);

        if (isEmpty) {
          const pathStr = `attributes.${attr.key}`;
          if (!fieldErrors[pathStr]) {
            const msg = `${attr.label} is required for ${categoryDef.name}.`;
            fieldErrors[pathStr] = msg;
            errorList.push({
              path: pathStr,
              message: msg,
              sectionId: 'section-attributes',
            });
          }
        }
      }
    }
  }

  return {
    success: errorList.length === 0,
    fieldErrors,
    errorList,
  };
}
