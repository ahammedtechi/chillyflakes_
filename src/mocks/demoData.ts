/**
 * Demo Mode Data — Self-contained mock data for the ChillyFlakes vendor portal demo.
 *
 * All amounts are in paise (1/100 INR). All dates are ISO strings relative to "today".
 * This file is dynamically imported only when VITE_DEMO_MODE === 'true',
 * so it is tree-shaken from production builds without the flag.
 */

import type { VendorUser } from '../types/auth';
import type {
  DashboardSummary,
  SalesChartPoint,
  RecentOrder,
  LowStockItem,
  RecentReview,
  VendorAlert,
} from '../types/dashboard';
import type { VendorProduct, VendorProductStatusCounts, ProductStatus } from '../types/product';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function isoDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString();
}

/** Deterministic pseudo-random seeded by index */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Generate a simple solid-color SVG data URI */
function colorSvg(hex: string): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='${encodeURIComponent(hex)}'/%3E%3C/svg%3E`;
}

// Category-keyed accent colors for product thumbnails
const CATEGORY_COLORS: Record<string, string> = {
  'natural-products': '#6B8E23',
  'handmade-products': '#CD853F',
  'jewelry': '#DAA520',
  'clothes-fashion': '#8B4513',
  'home-living': '#5F9EA0',
  'retail-products': '#BC8F8F',
  'books': '#4682B4',
  'services': '#708090',
};

// ─────────────────────────────────────────────
// Demo Credentials & Accounts
// ─────────────────────────────────────────────

export const DEMO_PASSWORD = 'Test@123';

export interface DemoAccount {
  email: string;
  mobile: string;
  password: string;
  user: VendorUser;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'approved@test.com',
    mobile: '9876543210',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v1',
      full_name: 'Pooja Hegde',
      email: 'approved@test.com',
      mobile_masked: '+91 98XXXXXX10',
      vendor_status: 'approved',
      store_name: 'Chilly Earth Pottery',
    },
  },
  {
    email: 'new@test.com',
    mobile: '9876543212',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v2',
      full_name: 'Arjun Das',
      email: 'new@test.com',
      mobile_masked: '+91 98XXXXXX12',
      vendor_status: 'onboarding_incomplete',
      store_name: 'Kerala Spice Garden',
    },
  },
  {
    email: 'review@test.com',
    mobile: '9876543213',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v3',
      full_name: 'Lakshmi Menon',
      email: 'review@test.com',
      mobile_masked: '+91 98XXXXXX13',
      vendor_status: 'under_review',
      store_name: 'Handmade Silk & Linen',
    },
  },
  {
    email: 'rejected@test.com',
    mobile: '9876543214',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v4',
      full_name: 'Karthik Raja',
      email: 'rejected@test.com',
      mobile_masked: '+91 98XXXXXX14',
      vendor_status: 'rejected',
      store_name: 'Artisan Wood Craft',
    },
  },
  {
    email: 'suspended@test.com',
    mobile: '9876543215',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v5',
      full_name: 'Ananya Sharma',
      email: 'suspended@test.com',
      mobile_masked: '+91 98XXXXXX15',
      vendor_status: 'suspended',
      store_name: 'Botanical Herbs & Soaps',
    },
  },
  {
    email: 'new-empty@test.com',
    mobile: '9876543299',
    password: DEMO_PASSWORD,
    user: {
      id: 'demo_v6',
      full_name: 'Ravi Kumar',
      email: 'new-empty@test.com',
      mobile_masked: '+91 98XXXXXX99',
      vendor_status: 'approved',
      store_name: 'Kaveri Terracotta Works',
    },
  },
];

export function findDemoAccount(identifier: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(
    (a) => a.email === identifier || a.mobile === identifier
  );
}

// ─────────────────────────────────────────────
// Dashboard Summary
// ─────────────────────────────────────────────

export const DEMO_DASHBOARD_SUMMARY: DashboardSummary = {
  total_sales_paise: 48_750_00, // ₹48,750
  orders_today: 7,
  pending_orders: 3,
  low_stock_count: 4,
  available_balance_paise: 1_23_400_00, // ₹1,23,400
  pending_payout_paise: 37_300_00, // ₹37,300
  changes: {
    total_sales_pct: 12.5,
    orders_today_pct: 40,
    pending_orders_diff: -2,
    available_balance_pct: 8.3,
  },
};

// ─────────────────────────────────────────────
// Sales Chart — 90 Days
// ─────────────────────────────────────────────

function generateSalesChart(): SalesChartPoint[] {
  const points: SalesChartPoint[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = daysAgo(i);
    const dayOfWeek = new Date(date).getDay();
    // Base with upward trend: older days lower, recent days higher
    const trendBase = 3000 + ((90 - i) * 35); // gradual growth
    // Weekday multiplier (Mon–Fri higher, Sat–Sun dip)
    const weekdayMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0;
    // Add some pseudo-random variation (±30%)
    const variation = 0.7 + seededRandom(i * 7 + 13) * 0.6;
    const salesRupees = Math.round(trendBase * weekdayMultiplier * variation);
    const orders = Math.max(1, Math.round(salesRupees / 800 + seededRandom(i) * 3));

    points.push({
      date,
      sales_paise: salesRupees * 100,
      orders,
    });
  }
  return points;
}

export const DEMO_SALES_CHART_90 = generateSalesChart();

// ─────────────────────────────────────────────
// Recent Orders (10)
// ─────────────────────────────────────────────

const ORDER_STATUSES: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = [
  'delivered', 'shipped', 'processing', 'pending', 'delivered',
  'shipped', 'delivered', 'pending', 'cancelled', 'delivered',
];

const CUSTOMER_NAMES = [
  'Ananya', 'Vikram', 'Meera', 'Karthik', 'Diya',
  'Rohit', 'Sneha', 'Arun', 'Priya', 'Deepak',
];

export const DEMO_RECENT_ORDERS: RecentOrder[] = CUSTOMER_NAMES.map((name, i) => ({
  id: `demo_ord_${i + 1}`,
  order_number: `CF-${String(2410001 + i)}`,
  customer_first_name: name,
  amount_paise: Math.round((1200 + seededRandom(i * 3 + 5) * 8800) * 100),
  status: ORDER_STATUSES[i],
  date: isoDate(i),
}));

// ─────────────────────────────────────────────
// Low Stock Items (4)
// ─────────────────────────────────────────────

export const DEMO_LOW_STOCK: LowStockItem[] = [
  {
    id: 'ls_1',
    product_name: 'Terracotta Hanging Planter (Medium)',
    stock_left: 2,
    threshold: 10,
    category: 'Handmade Products',
  },
  {
    id: 'ls_2',
    product_name: 'Block-Print Cotton Tote Bag',
    stock_left: 3,
    threshold: 15,
    category: 'Clothes & Fashion',
  },
  {
    id: 'ls_3',
    product_name: 'Coconut Shell Soy Candle (Set of 3)',
    stock_left: 1,
    threshold: 5,
    category: 'Home & Living',
  },
  {
    id: 'ls_4',
    product_name: 'Brass Diya – Festive Collection',
    stock_left: 4,
    threshold: 10,
    category: 'Home & Living',
  },
];

// ─────────────────────────────────────────────
// Recent Reviews (5)
// ─────────────────────────────────────────────

export const DEMO_RECENT_REVIEWS: RecentReview[] = [
  {
    id: 'rev_1',
    customer_name: 'Shreya Patel',
    rating: 5,
    comment: 'Absolutely love the glaze finish on my terracotta bowl. The packaging was eco-friendly too!',
    product_name: 'Terracotta Serving Bowl (Large)',
    date: isoDate(1),
  },
  {
    id: 'rev_2',
    customer_name: 'Amitabh Verma',
    rating: 4,
    comment: 'Beautiful block-print dupatta. Colours are slightly lighter than the picture but still gorgeous.',
    product_name: 'Indigo Block-Print Dupatta',
    date: isoDate(3),
  },
  {
    id: 'rev_3',
    customer_name: 'Nithya Rao',
    rating: 5,
    comment: 'The forest honey is pure and aromatic. My family loved it. Will order again!',
    product_name: 'Natural Forest Honey 250g',
    date: isoDate(5),
  },
  {
    id: 'rev_4',
    customer_name: 'Kabir Singh',
    rating: 3,
    comment: 'Good quality brass diya but delivery was delayed by 2 days.',
    product_name: 'Brass Diya – Festive Collection',
    date: isoDate(7),
  },
  {
    id: 'rev_5',
    customer_name: 'Divya Menon',
    rating: 4,
    comment: 'Handwoven jute bag is sturdy and stylish. Perfect for daily use.',
    product_name: 'Handwoven Jute Shoulder Bag',
    date: isoDate(9),
  },
];

// ─────────────────────────────────────────────
// Dashboard Alerts (4)
// ─────────────────────────────────────────────

export const DEMO_ALERTS: VendorAlert[] = [
  {
    id: 'dalt_1',
    title: 'Payout Processed',
    message: 'Your weekly payout of ₹37,300 has been initiated to your registered bank account.',
    type: 'success',
    created_at: isoDate(0),
  },
  {
    id: 'dalt_2',
    title: 'New Workshop Booking',
    message: '2 conscious buyers registered for your upcoming Terracotta Pottery Workshop.',
    type: 'info',
    created_at: isoDate(1),
  },
  {
    id: 'dalt_3',
    title: 'Low Stock Warning',
    message: '4 artisan products have fallen below your minimum inventory threshold.',
    type: 'warning',
    created_at: isoDate(2),
  },
  {
    id: 'dalt_4',
    title: 'Product Listing Approved',
    message: "Item 'Natural Forest Honey 250g' has been approved and is now live on ChillyFlakes.",
    type: 'info',
    created_at: isoDate(3),
  },
];

// ─────────────────────────────────────────────
// Products (25)
// ─────────────────────────────────────────────

interface DemoProductSeed {
  title: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price: number; // in rupees
  stock: number;
  status: ProductStatus;
  colors?: Array<{ name: string; hex: string }>;
  wholesale: boolean;
}

const PRODUCT_SEEDS: DemoProductSeed[] = [
  // Handmade Products (5) — pottery focus for Chilly Earth Pottery
  { title: 'Terracotta Serving Bowl (Large)', sku: 'CEP-TB-001', categoryId: 'handmade-products', categoryName: 'Handmade Products', price: 1450, stock: 38, status: 'approved', wholesale: false },
  { title: 'Terracotta Hanging Planter (Medium)', sku: 'CEP-HP-002', categoryId: 'handmade-products', categoryName: 'Handmade Products', price: 890, stock: 2, status: 'approved', wholesale: false },
  { title: 'Hand-Coiled Vase with Drip Glaze', sku: 'CEP-VG-003', categoryId: 'handmade-products', categoryName: 'Handmade Products', price: 2200, stock: 15, status: 'approved', wholesale: true },
  { title: 'Artisan Clay Mug Set (4 Pcs)', sku: 'CEP-MS-004', categoryId: 'handmade-products', categoryName: 'Handmade Products', price: 1680, stock: 22, status: 'pending_review', wholesale: false },
  { title: 'Ceramic Incense Holder – Leaf Shape', sku: 'CEP-IH-005', categoryId: 'handmade-products', categoryName: 'Handmade Products', price: 420, stock: 55, status: 'draft', wholesale: false },

  // Clothes & Fashion (5) — with colors
  { title: 'Indigo Block-Print Dupatta', sku: 'CEP-BD-006', categoryId: 'clothes-fashion', categoryName: 'Clothes & Fashion', price: 1250, stock: 18, status: 'approved', wholesale: false, colors: [{ name: 'Indigo', hex: '#3F51B5' }, { name: 'Natural White', hex: '#FAF0E6' }] },
  { title: 'Hand-Embroidered Chikankari Kurta', sku: 'CEP-CK-007', categoryId: 'clothes-fashion', categoryName: 'Clothes & Fashion', price: 3400, stock: 8, status: 'approved', wholesale: false, colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Sage Green', hex: '#8FBC8F' }, { name: 'Dusty Rose', hex: '#DCAE96' }] },
  { title: 'Block-Print Cotton Tote Bag', sku: 'CEP-TB-008', categoryId: 'clothes-fashion', categoryName: 'Clothes & Fashion', price: 550, stock: 3, status: 'approved', wholesale: true, colors: [{ name: 'Terracotta', hex: '#C67B5C' }, { name: 'Ocean Blue', hex: '#4682B4' }] },
  { title: 'Ajrakh Print Silk Stole', sku: 'CEP-AS-009', categoryId: 'clothes-fashion', categoryName: 'Clothes & Fashion', price: 2800, stock: 12, status: 'pending_review', wholesale: false, colors: [{ name: 'Maroon', hex: '#800000' }, { name: 'Navy', hex: '#000080' }] },
  { title: 'Kalamkari Cotton Dress – A-Line', sku: 'CEP-KD-010', categoryId: 'clothes-fashion', categoryName: 'Clothes & Fashion', price: 2100, stock: 6, status: 'rejected', wholesale: false, colors: [{ name: 'Earth Brown', hex: '#8B7355' }, { name: 'Forest Green', hex: '#228B22' }, { name: 'Brick Red', hex: '#CB4154' }] },

  // Natural Products (4)
  { title: 'Natural Forest Honey 250g', sku: 'CEP-FH-011', categoryId: 'natural-products', categoryName: 'Natural Products', price: 480, stock: 45, status: 'approved', wholesale: true },
  { title: 'Cold-Pressed Virgin Coconut Oil 500ml', sku: 'CEP-CO-012', categoryId: 'natural-products', categoryName: 'Natural Products', price: 620, stock: 32, status: 'approved', wholesale: true },
  { title: 'Herbal Turmeric Face Pack 100g', sku: 'CEP-FP-013', categoryId: 'natural-products', categoryName: 'Natural Products', price: 350, stock: 60, status: 'pending_review', wholesale: false },
  { title: 'Neem & Tulsi Handmade Soap Bar', sku: 'CEP-NS-014', categoryId: 'natural-products', categoryName: 'Natural Products', price: 180, stock: 90, status: 'draft', wholesale: false },

  // Home & Living (4)
  { title: 'Coconut Shell Soy Candle (Set of 3)', sku: 'CEP-SC-015', categoryId: 'home-living', categoryName: 'Home & Living', price: 750, stock: 1, status: 'approved', wholesale: false },
  { title: 'Brass Diya – Festive Collection', sku: 'CEP-BD-016', categoryId: 'home-living', categoryName: 'Home & Living', price: 1100, stock: 4, status: 'approved', wholesale: false },
  { title: 'Macramé Wall Hanging (120cm)', sku: 'CEP-MW-017', categoryId: 'home-living', categoryName: 'Home & Living', price: 1900, stock: 10, status: 'approved', wholesale: false },
  { title: 'Bamboo Cutlery Set (Travel)', sku: 'CEP-BC-018', categoryId: 'home-living', categoryName: 'Home & Living', price: 450, stock: 35, status: 'pending_review', wholesale: true },

  // Jewelry (3)
  { title: 'Oxidised Silver Jhumka Earrings', sku: 'CEP-JE-019', categoryId: 'jewelry', categoryName: 'Jewelry', price: 680, stock: 28, status: 'approved', wholesale: false },
  { title: 'Brass & Resin Statement Ring', sku: 'CEP-BR-020', categoryId: 'jewelry', categoryName: 'Jewelry', price: 520, stock: 42, status: 'approved', wholesale: false },
  { title: 'Dokra Tribal Necklace Set', sku: 'CEP-DN-021', categoryId: 'jewelry', categoryName: 'Jewelry', price: 2400, stock: 7, status: 'rejected', wholesale: false },

  // Books (2)
  { title: 'The Art of Indian Pottery – Illustrated Guide', sku: 'CEP-BK-022', categoryId: 'books', categoryName: 'Books', price: 850, stock: 20, status: 'approved', wholesale: false },
  { title: 'Sustainable Living Handbook', sku: 'CEP-BK-023', categoryId: 'books', categoryName: 'Books', price: 550, stock: 15, status: 'draft', wholesale: false },

  // Retail Products (2)
  { title: 'Jute Gift Hamper Box (Empty)', sku: 'CEP-GH-024', categoryId: 'retail-products', categoryName: 'Retail Products', price: 320, stock: 50, status: 'archived', wholesale: true },
  { title: 'Handwoven Jute Shoulder Bag', sku: 'CEP-JS-025', categoryId: 'retail-products', categoryName: 'Retail Products', price: 780, stock: 14, status: 'archived', wholesale: false },
];

export const DEMO_PRODUCTS: VendorProduct[] = PRODUCT_SEEDS.map((seed, i) => {
  const accent = CATEGORY_COLORS[seed.categoryId] || '#888888';
  return {
    id: `demo_prod_${i + 1}`,
    title: seed.title,
    sku: seed.sku,
    main_image_url: colorSvg(accent),
    category: {
      id: seed.categoryId,
      name: seed.categoryName,
    },
    price_paise: seed.price * 100,
    total_stock: seed.stock,
    colors: seed.colors || [],
    status: seed.status,
    wholesale_enabled: seed.wholesale,
    created_at: isoDate(90 - i * 3),
    updated_at: isoDate(Math.max(0, i - 2)),
  };
});

export const DEMO_PRODUCT_STATUS_COUNTS: VendorProductStatusCounts = {
  all: DEMO_PRODUCTS.length,
  draft: DEMO_PRODUCTS.filter((p) => p.status === 'draft').length,
  pending_review: DEMO_PRODUCTS.filter((p) => p.status === 'pending_review').length,
  approved: DEMO_PRODUCTS.filter((p) => p.status === 'approved').length,
  rejected: DEMO_PRODUCTS.filter((p) => p.status === 'rejected').length,
  unpublished: DEMO_PRODUCTS.filter((p) => p.status === 'unpublished').length,
  archived: DEMO_PRODUCTS.filter((p) => p.status === 'archived').length,
};
