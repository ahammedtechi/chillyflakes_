/**
 * Demo Mode MSW Handlers — Self-contained handlers for VITE_DEMO_MODE.
 *
 * These handlers answer ALL vendor endpoints using the demo data from demoData.ts.
 * No real network calls are made. The entire session lives in memory.
 *
 * Dynamically imported only when VITE_DEMO_MODE === 'true'.
 */

import { http, HttpResponse, delay } from 'msw';
import {
  findDemoAccount,
  DEMO_DASHBOARD_SUMMARY,
  DEMO_SALES_CHART_90,
  DEMO_RECENT_ORDERS,
  DEMO_LOW_STOCK,
  DEMO_RECENT_REVIEWS,
  DEMO_ALERTS,
  DEMO_PRODUCTS,
  DEMO_PRODUCT_STATUS_COUNTS,
} from './demoData';
import type { VendorUser } from '../types/auth';
import type { SalesChartRange } from '../types/dashboard';

// ── In-memory session state ──
let demoCurrentUser: VendorUser | null = null;
let demoCsrfToken = 'demo-csrf-token-' + Date.now();

function rotateCsrf(): string {
  demoCsrfToken = 'demo-csrf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  return demoCsrfToken;
}

function csrfHeaders(): Record<string, string> {
  return {
    'X-CSRFToken': demoCsrfToken,
    'Access-Control-Expose-Headers': 'X-CSRFToken',
  };
}

// ── In-memory products (mutable copy for demo edits) ──
let demoProducts = [...DEMO_PRODUCTS];

// Import onboarding handlers so they work in demo mode too
import { onboardingHandlers } from './onboardingHandlers';

export const demoHandlers = [
  // ──────────────────────────────────────────
  // CSRF
  // ──────────────────────────────────────────
  http.get('*/api/v1/csrf/', async () => {
    await delay(80);
    return HttpResponse.json(
      { detail: 'CSRF cookie set' },
      { headers: csrfHeaders() }
    );
  }),

  // ──────────────────────────────────────────
  // Auth: Login
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/login/', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { identifier?: string; password?: string };
    const { identifier, password } = body;

    if (!identifier || !password) {
      return HttpResponse.json(
        { code: 'validation_error', message: 'Email/mobile and password are required.' },
        { status: 400, headers: csrfHeaders() }
      );
    }

    const account = findDemoAccount(identifier.trim());

    if (!account || account.password !== password) {
      return HttpResponse.json(
        { code: 'invalid_credentials', message: 'Invalid email/mobile or password.' },
        { status: 401, headers: csrfHeaders() }
      );
    }

    demoCurrentUser = account.user;
    rotateCsrf();

    return HttpResponse.json(
      {
        message: 'Login successful',
        vendor_status: account.user.vendor_status,
        user: account.user,
      },
      { headers: csrfHeaders() }
    );
  }),

  // ──────────────────────────────────────────
  // Auth: Me
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/auth/me/', async () => {
    await delay(100);
    if (!demoCurrentUser) {
      return HttpResponse.json(
        { code: 'not_authenticated', detail: 'Authentication credentials were not provided.' },
        { status: 401, headers: csrfHeaders() }
      );
    }
    return HttpResponse.json(demoCurrentUser, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Auth: Logout
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/logout/', async () => {
    await delay(150);
    demoCurrentUser = null;
    rotateCsrf();
    return HttpResponse.json(
      { message: 'Logged out successfully.' },
      { headers: csrfHeaders() }
    );
  }),

  // ──────────────────────────────────────────
  // Auth: Register (stub — returns pending_verification)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/register/', async () => {
    await delay(300);
    return HttpResponse.json(
      {
        message: 'Registration successful. Please verify your email and mobile.',
        masked_email: 'de***@test.com',
        masked_mobile: '+91 98XXXXXX00',
      },
      { headers: csrfHeaders() }
    );
  }),

  // ──────────────────────────────────────────
  // Auth: Check availability (stub)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/check-availability/', async () => {
    await delay(100);
    return HttpResponse.json({ available: true }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Auth: Verification status (stub)
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/auth/verification-status/', async () => {
    await delay(100);
    return HttpResponse.json({
      mobile: { masked: '+91 98XXXXXX00', verified: true, resend_available_in: 0 },
      email: { masked: 'de***@test.com', verified: true, resend_available_in: 0 },
      all_verified: true,
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Auth: Verify OTP (stub)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/verify-otp/', async () => {
    await delay(200);
    return HttpResponse.json(
      { channel: 'email', verified: true, all_verified: true },
      { headers: csrfHeaders() }
    );
  }),

  // ──────────────────────────────────────────
  // Auth: Resend OTP (stub)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/resend-otp/', async () => {
    await delay(200);
    return HttpResponse.json({ resend_available_in: 30 }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Auth: Password reset stubs
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/auth/password-reset/request/', async () => {
    await delay(200);
    return HttpResponse.json({ masked: 'de***@test.com', resend_available_in: 30 }, { headers: csrfHeaders() });
  }),
  http.post('*/api/v1/vendor/auth/password-reset/verify/', async () => {
    await delay(200);
    return HttpResponse.json({ verified: true }, { headers: csrfHeaders() });
  }),
  http.post('*/api/v1/vendor/auth/password-reset/resend/', async () => {
    await delay(200);
    return HttpResponse.json({ resend_available_in: 30 }, { headers: csrfHeaders() });
  }),
  http.post('*/api/v1/vendor/auth/password-reset/confirm/', async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Password updated successfully.' }, { headers: csrfHeaders() });
  }),
  http.get('*/api/v1/vendor/auth/password-reset/status/', async () => {
    await delay(100);
    return HttpResponse.json({ step: 'none' }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Summary
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/summary/', async () => {
    await delay(200);
    // For new-empty account, return zeroed summary
    if (demoCurrentUser?.email === 'new-empty@test.com') {
      return HttpResponse.json({
        total_sales_paise: 0,
        orders_today: 0,
        pending_orders: 0,
        low_stock_count: 0,
        available_balance_paise: 0,
        pending_payout_paise: 0,
        changes: { total_sales_pct: 0, orders_today_pct: 0, pending_orders_diff: 0, available_balance_pct: 0 },
      }, { headers: csrfHeaders() });
    }
    return HttpResponse.json(DEMO_DASHBOARD_SUMMARY, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Sales Chart
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/sales-chart/', async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const range = (url.searchParams.get('range') || '30') as SalesChartRange;
    const days = parseInt(range, 10) || 30;
    const points = DEMO_SALES_CHART_90.slice(-days);

    if (demoCurrentUser?.email === 'new-empty@test.com') {
      return HttpResponse.json({ range, points: [] }, { headers: csrfHeaders() });
    }

    return HttpResponse.json({ range, points }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Recent Orders
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/recent-orders/', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '5', 10);

    if (demoCurrentUser?.email === 'new-empty@test.com') {
      return HttpResponse.json({ count: 0, next: null, previous: null, results: [] }, { headers: csrfHeaders() });
    }

    const start = (page - 1) * pageSize;
    const results = DEMO_RECENT_ORDERS.slice(start, start + pageSize);
    return HttpResponse.json({
      count: DEMO_RECENT_ORDERS.length,
      next: start + pageSize < DEMO_RECENT_ORDERS.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results,
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Low Stock
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/low-stock/', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '5', 10);
    const start = (page - 1) * pageSize;
    const results = DEMO_LOW_STOCK.slice(start, start + pageSize);
    return HttpResponse.json({
      count: DEMO_LOW_STOCK.length,
      next: null,
      previous: null,
      results,
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Recent Reviews
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/recent-reviews/', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const fail = url.searchParams.get('fail');
    if (fail === 'reviews') {
      return HttpResponse.json(
        { code: 'server_error', message: 'Simulated review fetch failure.' },
        { status: 500, headers: csrfHeaders() }
      );
    }
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '5', 10);
    const start = (page - 1) * pageSize;
    const results = DEMO_RECENT_REVIEWS.slice(start, start + pageSize);
    return HttpResponse.json({
      count: DEMO_RECENT_REVIEWS.length,
      next: null,
      previous: null,
      results,
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Dashboard: Alerts
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/dashboard/alerts/', async () => {
    await delay(150);
    return HttpResponse.json(DEMO_ALERTS, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: List
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/products/', async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const category = url.searchParams.get('category') || '';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '12', 10);

    let filtered = [...demoProducts];

    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (category) {
      filtered = filtered.filter((p) => p.category.id === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      count: filtered.length,
      next: start + pageSize < filtered.length ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results,
      status_counts: DEMO_PRODUCT_STATUS_COUNTS,
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Detail
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/products/:id/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const product = demoProducts.find((p) => p.id === id);
    if (!product) {
      return HttpResponse.json(
        { code: 'not_found', message: 'Product not found.' },
        { status: 404, headers: csrfHeaders() }
      );
    }
    return HttpResponse.json({
      ...product,
      description: `Handcrafted ${product.title} by Chilly Earth Pottery. Made with love in India.`,
      tags: ['handmade', 'eco-friendly', 'artisan'],
      attributes: {},
      has_colors: product.colors.length > 0,
      mrp_paise: Math.round(product.price_paise * 1.2),
      gst_rate: 5,
      shipping: { weight_g: 500, length_cm: 20, width_cm: 15, height_cm: 10 },
      wholesale: { enabled: product.wholesale_enabled, moq: product.wholesale_enabled ? 10 : undefined, tiers: [] },
    }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Create (draft)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;
    const newProduct = {
      id: `demo_prod_new_${Date.now()}`,
      title: (body.title as string) || 'Untitled Product',
      sku: `CEP-NEW-${Date.now().toString(36).toUpperCase()}`,
      main_image_url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23CD853F'/%3E%3C/svg%3E`,
      category: { id: (body.category_id as string) || null, name: 'Handmade Products' },
      price_paise: (body.price_paise as number) || 100000,
      total_stock: (body.stock as number) || 0,
      colors: [] as Array<{ name: string; hex: string }>,
      status: 'draft' as const,
      wholesale_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    demoProducts.unshift(newProduct);
    return HttpResponse.json(newProduct, { status: 201, headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Update
  // ──────────────────────────────────────────
  http.patch('*/api/v1/vendor/products/:id/', async ({ params, request }) => {
    await delay(250);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) {
      return HttpResponse.json({ code: 'not_found', message: 'Product not found.' }, { status: 404, headers: csrfHeaders() });
    }
    const body = (await request.json()) as Record<string, unknown>;
    demoProducts[idx] = { ...demoProducts[idx], ...body, updated_at: new Date().toISOString() } as typeof demoProducts[number];
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Submit for review
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/submit/', async ({ params }) => {
    await delay(250);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    demoProducts[idx] = { ...demoProducts[idx], status: 'pending_review', updated_at: new Date().toISOString() };
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Duplicate
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/duplicate/', async ({ params }) => {
    await delay(250);
    const id = params.id as string;
    const original = demoProducts.find((p) => p.id === id);
    if (!original) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    const dup = { ...original, id: `demo_prod_dup_${Date.now()}`, title: `${original.title} (Copy)`, status: 'draft' as const, sku: `${original.sku}-COPY`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    demoProducts.unshift(dup);
    return HttpResponse.json(dup, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Withdraw
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/withdraw/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    demoProducts[idx] = { ...demoProducts[idx], status: 'draft', updated_at: new Date().toISOString() };
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Unpublish
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/unpublish/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    demoProducts[idx] = { ...demoProducts[idx], status: 'unpublished' as const, updated_at: new Date().toISOString() };
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Republish
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/republish/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    demoProducts[idx] = { ...demoProducts[idx], status: 'approved', updated_at: new Date().toISOString() };
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Archive
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/products/:id/archive/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    demoProducts[idx] = { ...demoProducts[idx], status: 'archived', updated_at: new Date().toISOString() };
    return HttpResponse.json(demoProducts[idx], { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Products: Delete (drafts only)
  // ──────────────────────────────────────────
  http.delete('*/api/v1/vendor/products/:id/', async ({ params }) => {
    await delay(200);
    const id = params.id as string;
    const idx = demoProducts.findIndex((p) => p.id === id);
    if (idx === -1) return HttpResponse.json({ code: 'not_found' }, { status: 404, headers: csrfHeaders() });
    if (demoProducts[idx].status !== 'draft') {
      return HttpResponse.json({ code: 'not_deletable', message: 'Only draft products can be deleted.' }, { status: 409, headers: csrfHeaders() });
    }
    demoProducts.splice(idx, 1);
    return HttpResponse.json({ success: true, message: 'Product deleted.' }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Categories
  // ──────────────────────────────────────────
  http.get('*/api/v1/vendor/categories/', async () => {
    await delay(150);
    // Re-use the existing vendorCategoriesWithAttributes
    const { vendorCategoriesWithAttributes } = await import('../data/categoryAttributes');
    return HttpResponse.json(vendorCategoriesWithAttributes, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Uploads (stubs)
  // ──────────────────────────────────────────
  http.post('*/api/v1/vendor/uploads/images/', async () => {
    await delay(400);
    const id = `upload_${Date.now()}`;
    return HttpResponse.json({
      id,
      url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23CD853F'/%3E%3Ctext x='200' y='210' text-anchor='middle' fill='white' font-size='24'%3EDemo%3C/text%3E%3C/svg%3E`,
      thumbnail_url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23CD853F'/%3E%3C/svg%3E`,
      width: 400,
      height: 400,
      size: 1024,
    }, { status: 201, headers: csrfHeaders() });
  }),

  http.post('*/api/v1/vendor/uploads/video/', async () => {
    await delay(600);
    return HttpResponse.json({
      id: `vid_${Date.now()}`,
      url: '',
      duration: 30,
    }, { status: 201, headers: csrfHeaders() });
  }),

  http.delete('*/api/v1/vendor/uploads/:id/', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Upload deleted.' }, { headers: csrfHeaders() });
  }),

  // ──────────────────────────────────────────
  // Onboarding handlers (re-use existing)
  // ──────────────────────────────────────────
  ...onboardingHandlers,
];
