import { http, HttpResponse, delay } from 'msw';
import {
  mockAdminRoles,
  mockAdminStaffUsers,
  mockAdminUsers,
  mockAdminSellers,
  mockAdminAuditLogs,
} from './adminMockData';
import type {
  AdminOverviewResponse,
  AdminUserAccount,
  AdminSellerListItem,
  AuditLogEntry,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '../types/admin';
import type { AdminUser } from '../types/adminProduct';

// Mutable in-memory state
export let currentAdminUser: AdminUser | null = {
  id: 'admin_1',
  email: 'admin@test.com',
  name: 'Platform Super Admin',
  role: 'admin',
  role_id: 'role_super_admin',
  role_name: 'Super Admin',
  permissions: mockAdminRoles[0].permissions as string[],
};

export let activeStaff = [...mockAdminStaffUsers];
export let activeRoles = [...mockAdminRoles];
export let activeUsers = [...mockAdminUsers];
export let activeSellers = [...mockAdminSellers];
export let activeAuditLogs = [...mockAdminAuditLogs];

function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'actor_name' | 'actor_email' | 'actor_role' | 'ip_address'>) {
  const newLog: AuditLogEntry = {
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor_name: currentAdminUser?.name || 'Administrator',
    actor_email: currentAdminUser?.email || 'admin@test.com',
    actor_role: currentAdminUser?.role_name || (currentAdminUser?.role === 'admin' ? 'Super Admin' : 'Staff'),
    ip_address: '103.21.144.12',
    ...entry,
  };
  activeAuditLogs.unshift(newLog);
}

export const adminHandlers = [
  /* ------------------------------------------------------------------------ */
  /* ADMIN AUTHENTICATION                                                     */
  /* ------------------------------------------------------------------------ */
  http.post('*/api/v1/admin/auth/login/', async ({ request }) => {
    await delay(700);
    const body = (await request.json()) as { email?: string; password?: string };
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // Match against any seeded staff account with password 'Test@123'
    const staffMatch = activeStaff.find((s) => s.email.toLowerCase() === email);

    if (staffMatch && password === 'Test@123') {
      currentAdminUser = {
        id: staffMatch.id,
        email: staffMatch.email,
        name: staffMatch.name,
        role: staffMatch.role_name === 'Super Admin' ? 'admin' : 'staff',
        role_id: staffMatch.role_id,
        role_name: staffMatch.role_name,
        permissions: staffMatch.permissions as string[],
      };

      recordAuditLog({
        action: 'ADMIN_LOGIN',
        module: 'overview',
        target_id: staffMatch.id,
        target_name: staffMatch.name,
        reason: 'Staff authenticated successfully into Super Admin Console.',
      });

      return HttpResponse.json(
        { message: 'Admin login successful', user: currentAdminUser },
        { status: 200 }
      );
    }

    // Default fallback check
    if (email === 'admin@test.com' && password === 'Test@123') {
      currentAdminUser = {
        id: 'admin_1',
        email: 'admin@test.com',
        name: 'Platform Super Admin',
        role: 'admin',
        role_id: 'role_super_admin',
        role_name: 'Super Admin',
        permissions: mockAdminRoles[0].permissions as string[],
      };
      return HttpResponse.json(
        { message: 'Admin login successful', user: currentAdminUser },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { code: 'invalid_credentials', message: 'Invalid admin email or password.' },
      { status: 401 }
    );
  }),

  http.post('*/api/v1/admin/auth/logout/', async () => {
    await delay(300);
    currentAdminUser = null;
    return HttpResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  }),

  http.get('*/api/v1/admin/auth/me/', async () => {
    await delay(300);
    if (!currentAdminUser) {
      return HttpResponse.json(
        { code: 'not_authenticated', message: 'Admin authentication required.' },
        { status: 401 }
      );
    }
    return HttpResponse.json(currentAdminUser, { status: 200 });
  }),

  /* ------------------------------------------------------------------------ */
  /* 1. MARKETPLACE OVERVIEW                                                  */
  /* ------------------------------------------------------------------------ */
  http.get('*/api/v1/admin/overview/', async () => {
    await delay(700);

    const approvedVendorsCount = activeSellers.filter((s) => s.status === 'approved').length;
    const pendingVendorsCount = activeSellers.filter((s) => s.status === 'under_review').length;
    const activeCustomersCount = activeUsers.filter((u) => !u.is_deleted && u.status === 'active').length;

    // Delayed review calculations
    const delayedSellers = activeSellers.filter((s) => s.status === 'under_review' && s.days_in_current_status > 3);
    const suspendedSellers = activeSellers.filter((s) => s.status === 'suspended');

    const alerts = [];

    if (delayedSellers.length > 0) {
      alerts.push({
        id: 'alert_sellers_delayed',
        type: 'seller_docs_delayed' as const,
        severity: 'danger' as const,
        title: 'Delayed Merchant KYC Reviews',
        description: `${delayedSellers.length} merchant application has been awaiting document verification for more than 3 days.`,
        count: delayedSellers.length,
        target_url: '/admin/people/sellers?status=under_review',
        created_at: new Date().toISOString(),
      });
    }

    if (suspendedSellers.length > 0) {
      alerts.push({
        id: 'alert_sellers_suspended',
        type: 'seller_suspended' as const,
        severity: 'warning' as const,
        title: 'Suspended Merchants Under Investigation',
        description: `${suspendedSellers.length} store accounts are currently suspended due to compliance or IP violations.`,
        count: suspendedSellers.length,
        target_url: '/admin/people/sellers?status=suspended',
        created_at: new Date().toISOString(),
      });
    }

    alerts.push({
      id: 'alert_products_delayed',
      type: 'product_review_delayed' as const,
      severity: 'warning' as const,
      title: 'Products Awaiting Review > 2 Days',
      description: '2 artisan items submitted over 48 hours ago require inspection before going live.',
      count: 2,
      target_url: '/admin/product-reviews',
      created_at: new Date().toISOString(),
    });

    const response: AdminOverviewResponse = {
      metrics: {
        registered_vendors: {
          approved: approvedVendorsCount,
          pending_review: pendingVendorsCount,
          total: activeSellers.length,
        },
        active_customers: activeCustomersCount,
        catalog_products: {
          live: 28,
          pending_review: 2,
          total: 30,
        },
        products_awaiting_review: 2,
        sellers_awaiting_review: pendingVendorsCount,
        net_platform_revenue_paise: 8450000, // ₹84,500
        orders: {
          total: 142,
          pending_dispatch: 8,
        },
        refund_return_requests: {
          pending: 3,
          total: 7,
        },
        disbursed_payouts_paise: 42100000, // ₹4,21,000
        held_payments_paise: null, // "Not yet available"
      },
      alerts,
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  /* ------------------------------------------------------------------------ */
  /* 2. CUSTOMER / USER DIRECTORY                                             */
  /* ------------------------------------------------------------------------ */
  http.get('*/api/v1/admin/users/', async ({ request }) => {
    await delay(700);
    const url = new URL(request.url);
    const tab = url.searchParams.get('tab') || 'customers';
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const roleFilter = url.searchParams.get('role');
    const statusFilter = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '25', 10);

    let filtered = [...activeUsers];

    // Tab filter
    if (tab === 'customers') {
      filtered = filtered.filter((u) => !u.is_deleted && u.role === 'customer');
    } else if (tab === 'staff_admins') {
      filtered = filtered.filter((u) => !u.is_deleted && (u.role === 'staff' || u.role === 'admin'));
    } else if (tab === 'deleted') {
      filtered = filtered.filter((u) => u.is_deleted);
    } else {
      // all_accounts
      filtered = filtered.filter((u) => !u.is_deleted);
    }

    // Role filter
    if (roleFilter && roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    // Search
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.phone.includes(search)
      );
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json(
      {
        count: totalCount,
        next: startIndex + pageSize < totalCount ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results: paginated,
        tab_counts: {
          customers: activeUsers.filter((u) => !u.is_deleted && u.role === 'customer').length,
          staff_admins: activeUsers.filter((u) => !u.is_deleted && (u.role === 'staff' || u.role === 'admin')).length,
          all_accounts: activeUsers.filter((u) => !u.is_deleted).length,
          deleted: activeUsers.filter((u) => u.is_deleted).length,
        },
      },
      { status: 200 }
    );
  }),

  // Create / Invite User
  http.post('*/api/v1/admin/users/', async ({ request }) => {
    await delay(700);
    const body = (await request.json()) as CreateAdminUserPayload;

    if (!body.name || !body.email) {
      return HttpResponse.json({ code: 'missing_fields', message: 'Name and email are required.' }, { status: 400 });
    }

    // Check email uniqueness
    if (activeUsers.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
      return HttpResponse.json(
        { code: 'email_exists', message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const newUser: AdminUserAccount = {
      id: `usr_${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      email_masked: `${body.email.slice(0, 2)}••••••@${body.email.split('@')[1]}`,
      phone: body.phone.trim(),
      role: body.role || 'customer',
      role_name: body.role === 'admin' ? 'Super Admin' : body.role === 'staff' ? 'Staff' : undefined,
      status: 'active',
      email_verified: false,
      phone_verified: false,
      orders_count: 0,
      is_deleted: false,
      created_at: new Date().toISOString(),
    };

    activeUsers.unshift(newUser);

    recordAuditLog({
      action: 'USER_INVITED',
      module: 'customers',
      target_id: newUser.id,
      target_name: newUser.name,
      reason: `Dispatched setup invitation link for role: ${newUser.role}.`,
    });

    return HttpResponse.json(newUser, { status: 201 });
  }),

  // Update User
  http.patch('*/api/v1/admin/users/:id/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User account not found.' }, { status: 404 });
    }

    const body = (await request.json()) as UpdateAdminUserPayload;

    // Safety rule: Cannot demote self
    if (user.id === currentAdminUser?.id && body.role && body.role !== 'admin') {
      return HttpResponse.json(
        { code: 'cannot_demote_self', message: 'Administrators cannot demote their own account role.' },
        { status: 403 }
      );
    }

    // Safety rule: Last remaining Super Admin cannot be demoted
    if (user.role === 'admin' && body.role && body.role !== 'admin') {
      const superAdminCount = activeUsers.filter((u) => !u.is_deleted && u.role === 'admin').length;
      if (superAdminCount <= 1) {
        return HttpResponse.json(
          { code: 'cannot_remove_last_admin', message: 'The last remaining Super Admin cannot be demoted.' },
          { status: 403 }
        );
      }
    }

    if (body.name) user.name = body.name.trim();
    if (body.phone) user.phone = body.phone.trim();
    if (body.role) {
      user.role = body.role;
      user.role_name = body.role === 'admin' ? 'Super Admin' : body.role === 'staff' ? 'Staff' : undefined;
    }

    recordAuditLog({
      action: 'USER_UPDATED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason: 'Modified account profile and privileges.',
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  // Deactivate User
  http.post('*/api/v1/admin/users/:id/deactivate/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User not found.' }, { status: 404 });
    }

    // Safety rule: Cannot deactivate self
    if (user.id === currentAdminUser?.id || user.email === currentAdminUser?.email) {
      return HttpResponse.json(
        { code: 'cannot_deactivate_self', message: 'You cannot deactivate your own administrator account.' },
        { status: 403 }
      );
    }

    // Safety rule: Cannot deactivate last super admin
    if (user.role === 'admin') {
      const activeAdmins = activeUsers.filter((u) => !u.is_deleted && u.role === 'admin' && u.status === 'active').length;
      if (activeAdmins <= 1) {
        return HttpResponse.json(
          { code: 'cannot_deactivate_last_admin', message: 'The last active Super Admin cannot be deactivated.' },
          { status: 403 }
        );
      }
    }

    user.status = 'deactivated';

    recordAuditLog({
      action: 'USER_DEACTIVATED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason: 'Administrative deactivation.',
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  // Activate User
  http.post('*/api/v1/admin/users/:id/activate/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User not found.' }, { status: 404 });
    }

    user.status = 'active';

    recordAuditLog({
      action: 'USER_ACTIVATED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason: 'Administrative reactivation.',
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  // Force Password Reset
  http.post('*/api/v1/admin/users/:id/force-password-reset/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User not found.' }, { status: 404 });
    }

    recordAuditLog({
      action: 'PASSWORD_RESET_FORCED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason: `Dispatched secure reset link to ${user.email}.`,
    });

    return HttpResponse.json(
      { success: true, message: `Password reset dispatched to ${user.email}.` },
      { status: 200 }
    );
  }),

  // Sign out all sessions
  http.post('*/api/v1/admin/users/:id/sign-out-all/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User not found.' }, { status: 404 });
    }

    recordAuditLog({
      action: 'SESSIONS_TERMINATED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason: 'Revoked all active refresh tokens and browser sessions.',
    });

    return HttpResponse.json(
      { success: true, message: `All active sessions revoked for ${user.name}.` },
      { status: 200 }
    );
  }),

  // Soft Delete User
  http.delete('*/api/v1/admin/users/:id/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const user = activeUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ code: 'not_found', message: 'User not found.' }, { status: 404 });
    }

    // Safety rule: Cannot delete self
    if (user.id === currentAdminUser?.id || user.email === currentAdminUser?.email) {
      return HttpResponse.json(
        { code: 'cannot_delete_self', message: 'Administrators cannot delete their own account.' },
        { status: 403 }
      );
    }

    // Safety rule: Cannot delete last super admin
    if (user.role === 'admin') {
      const adminCount = activeUsers.filter((u) => !u.is_deleted && u.role === 'admin').length;
      if (adminCount <= 1) {
        return HttpResponse.json(
          { code: 'cannot_delete_last_admin', message: 'The last remaining Super Admin cannot be deleted.' },
          { status: 403 }
        );
      }
    }

    let reason = 'Administrative soft deletion.';
    try {
      const body = (await request.json()) as { reason?: string };
      if (body.reason) reason = body.reason.trim();
    } catch {
      // ignore
    }

    user.is_deleted = true;
    user.status = 'deleted';
    user.deleted_at = new Date().toISOString();
    user.delete_reason = reason;

    recordAuditLog({
      action: 'USER_SOFT_DELETED',
      module: 'customers',
      target_id: user.id,
      target_name: user.name,
      reason,
    });

    return HttpResponse.json(
      { success: true, message: 'Account soft-deleted successfully.' },
      { status: 200 }
    );
  }),

  /* ------------------------------------------------------------------------ */
  /* 3. VENDOR & SELLER HUB                                                   */
  /* ------------------------------------------------------------------------ */
  http.get('*/api/v1/admin/sellers/', async ({ request }) => {
    await delay(700);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const bType = url.searchParams.get('business_type');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '25', 10);

    let filtered = [...activeSellers];

    if (status && status !== 'all') {
      filtered = filtered.filter((s) => s.status === status);
    }

    if (bType && bType !== 'all') {
      filtered = filtered.filter((s) => s.business_type === bType);
    }

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.store_name.toLowerCase().includes(search) ||
          s.legal_name.toLowerCase().includes(search) ||
          s.pan_masked.toLowerCase().includes(search) ||
          s.store_slug.toLowerCase().includes(search)
      );
    }

    // Sort: under_review oldest first (highest days_in_current_status)
    if (status === 'under_review') {
      filtered.sort((a, b) => b.days_in_current_status - a.days_in_current_status);
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    const listItems: AdminSellerListItem[] = paginated.map((s) => ({
      id: s.id,
      legal_name: s.legal_name,
      store_name: s.store_name,
      store_slug: s.store_slug,
      business_type: s.business_type,
      jurisdiction: s.pickup_address.state || 'India',
      tax_id_masked: s.tax_id_masked,
      pan_masked: s.pan_masked,
      status: s.status,
      verified_docs_count: s.documents.filter((d) => d.status === 'verified').length,
      total_required_docs_count: s.documents.length,
      created_at: s.created_at,
      assigned_reviewer: s.assigned_reviewer,
      days_in_current_status: s.days_in_current_status,
    }));

    return HttpResponse.json(
      {
        count: totalCount,
        next: startIndex + pageSize < totalCount ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results: listItems,
        tab_counts: {
          under_review: activeSellers.filter((s) => s.status === 'under_review').length,
          resubmission_requested: activeSellers.filter((s) => s.status === 'resubmission_requested').length,
          approved: activeSellers.filter((s) => s.status === 'approved').length,
          rejected: activeSellers.filter((s) => s.status === 'rejected').length,
          suspended: activeSellers.filter((s) => s.status === 'suspended').length,
          all: activeSellers.length,
        },
      },
      { status: 200 }
    );
  }),

  // Get Seller Detail
  http.get('*/api/v1/admin/sellers/:id/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller application not found.' }, { status: 404 });
    }

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Verify Document
  http.post('*/api/v1/admin/sellers/:sellerId/documents/:docId/verify/', async ({ params }) => {
    await delay(700);
    const sellerId = params.sellerId as string;
    const docId = params.docId as string;
    const seller = activeSellers.find((s) => s.id === sellerId);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const doc = seller.documents.find((d) => d.id === docId);
    if (!doc) {
      return HttpResponse.json({ code: 'not_found', message: 'Document not found.' }, { status: 404 });
    }

    doc.status = 'verified';
    doc.verified_at = new Date().toISOString();
    doc.verified_by = currentAdminUser?.name || 'Administrator';
    doc.rejection_reason = undefined;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'document_verified',
      notes: `Verified ${doc.title}.`,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'DOCUMENT_VERIFIED',
      module: 'sellers',
      target_id: doc.id,
      target_name: `${seller.store_name} - ${doc.title}`,
      reason: 'Verified document matches statutory registry records.',
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Reject Document
  http.post('*/api/v1/admin/sellers/:sellerId/documents/:docId/reject/', async ({ params, request }) => {
    await delay(700);
    const sellerId = params.sellerId as string;
    const docId = params.docId as string;
    const seller = activeSellers.find((s) => s.id === sellerId);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const doc = seller.documents.find((d) => d.id === docId);
    if (!doc) {
      return HttpResponse.json({ code: 'not_found', message: 'Document not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { reason: string };
    const reason = (body.reason || '').trim();

    if (!reason) {
      return HttpResponse.json({ code: 'reason_required', message: 'Rejection reason is required.' }, { status: 400 });
    }

    doc.status = 'rejected';
    doc.rejection_reason = reason;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'document_rejected',
      notes: `Rejected ${doc.title}: ${reason}`,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'DOCUMENT_REJECTED',
      module: 'sellers',
      target_id: doc.id,
      target_name: `${seller.store_name} - ${doc.title}`,
      reason,
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Mark Under Review
  http.post('*/api/v1/admin/sellers/:id/under-review/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    seller.status = 'under_review';
    seller.assigned_reviewer = currentAdminUser?.name || 'Administrator';
    seller.review_started_at = new Date().toISOString();

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'under_review',
      notes: `Review initiated by ${currentAdminUser?.name || 'Administrator'}.`,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_UNDER_REVIEW',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason: 'Initiated merchant review.',
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Approve Seller (Enforces: ALL required docs must be verified)
  http.post('*/api/v1/admin/sellers/:id/approve/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    // Check all required documents
    const unverifiedDocs = seller.documents.filter((d) => d.status !== 'verified');
    if (seller.documents.length === 0 || unverifiedDocs.length > 0) {
      return HttpResponse.json(
        {
          code: 'documents_not_verified',
          message: 'All required documents must be verified before approval.',
          missing: unverifiedDocs.map((d) => d.title),
        },
        { status: 400 }
      );
    }

    let notes = 'Approved for marketplace operations.';
    try {
      const body = (await request.json()) as { reason?: string };
      if (body.reason) notes = body.reason.trim();
    } catch {
      // ignore
    }

    seller.status = 'approved';
    seller.days_in_current_status = 0;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'approved',
      notes,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_APPROVED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason: notes,
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Request Resubmit
  http.post('*/api/v1/admin/sellers/:id/request-resubmit/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { reason: string; flagged_sections: string[] };
    const reason = (body.reason || '').trim();

    if (!reason || reason.length < 10) {
      return HttpResponse.json(
        { code: 'invalid_reason', message: 'Resubmission reason must be at least 10 characters.' },
        { status: 400 }
      );
    }

    seller.status = 'resubmission_requested';
    seller.days_in_current_status = 0;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'resubmission_requested',
      notes: reason,
      flagged_sections: body.flagged_sections || [],
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_RESUBMIT_REQUESTED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason,
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Reject Seller
  http.post('*/api/v1/admin/sellers/:id/reject/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { reason: string };
    const reason = (body.reason || '').trim();

    if (!reason) {
      return HttpResponse.json({ code: 'reason_required', message: 'Rejection reason is required.' }, { status: 400 });
    }

    seller.status = 'rejected';
    seller.days_in_current_status = 0;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'rejected',
      notes: reason,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_REJECTED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason,
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Suspend Seller
  http.post('*/api/v1/admin/sellers/:id/suspend/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { reason: string };
    const reason = (body.reason || '').trim();

    if (!reason) {
      return HttpResponse.json({ code: 'reason_required', message: 'Suspension reason is required.' }, { status: 400 });
    }

    seller.status = 'suspended';
    seller.days_in_current_status = 0;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'suspended',
      notes: reason,
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_SUSPENDED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason,
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Reactivate Seller
  http.post('*/api/v1/admin/sellers/:id/reactivate/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    seller.status = 'approved';
    seller.days_in_current_status = 0;

    seller.review_history.push({
      id: `rev_${Date.now()}`,
      reviewer_name: currentAdminUser?.name || 'Administrator',
      action: 'approved',
      notes: 'Store access restored.',
      created_at: new Date().toISOString(),
    });

    recordAuditLog({
      action: 'SELLER_REACTIVATED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason: 'Administrative reactivation.',
    });

    return HttpResponse.json(seller, { status: 200 });
  }),

  // Reveal Sensitive Field
  http.post('*/api/v1/admin/sellers/:id/reveal/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const seller = activeSellers.find((s) => s.id === id);

    if (!seller) {
      return HttpResponse.json({ code: 'not_found', message: 'Seller not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { field: 'tax_id' | 'pan' | 'bank_account' };
    const field = body.field;

    let value = '';
    if (field === 'tax_id') {
      value = seller.full_tax_id || '33AABCD1234F1Z5';
    } else if (field === 'pan') {
      value = seller.full_pan || 'AABCD1234F';
    } else if (field === 'bank_account') {
      value = seller.bank_info.full_account_number || '502000458924892';
    }

    recordAuditLog({
      action: 'SENSITIVE_DATA_REVEALED',
      module: 'sellers',
      target_id: seller.id,
      target_name: seller.store_name,
      reason: `Decrypted and viewed sensitive field: ${field}.`,
    });

    return HttpResponse.json({ field, value }, { status: 200 });
  }),

  /* ------------------------------------------------------------------------ */
  /* 4. ROLES & STAFF MANAGEMENT                                              */
  /* ------------------------------------------------------------------------ */
  http.get('*/api/v1/admin/roles/', async () => {
    await delay(700);
    return HttpResponse.json(activeRoles, { status: 200 });
  }),

  http.post('*/api/v1/admin/roles/', async ({ request }) => {
    await delay(700);
    const body = (await request.json()) as { name: string; description: string; permissions: any[] };

    const newRole = {
      id: `role_${Date.now()}`,
      name: body.name.trim(),
      description: body.description.trim(),
      is_system: false,
      user_count: 0,
      permissions: body.permissions || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    activeRoles.push(newRole);

    recordAuditLog({
      action: 'ROLE_CREATED',
      module: 'staff_roles',
      target_id: newRole.id,
      target_name: newRole.name,
      reason: 'Created new custom role.',
    });

    return HttpResponse.json(newRole, { status: 201 });
  }),

  http.patch('*/api/v1/admin/roles/:id/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const role = activeRoles.find((r) => r.id === id);

    if (!role) {
      return HttpResponse.json({ code: 'not_found', message: 'Role not found.' }, { status: 404 });
    }

    if (role.is_system && role.id === 'role_super_admin') {
      return HttpResponse.json(
        { code: 'system_role_locked', message: 'The Super Admin system role cannot be edited.' },
        { status: 403 }
      );
    }

    const body = (await request.json()) as { name?: string; description?: string; permissions?: any[] };
    if (body.name) role.name = body.name.trim();
    if (body.description) role.description = body.description.trim();
    if (body.permissions) role.permissions = body.permissions;
    role.updated_at = new Date().toISOString();

    recordAuditLog({
      action: 'ROLE_MODIFIED',
      module: 'staff_roles',
      target_id: role.id,
      target_name: role.name,
      reason: 'Modified role permissions.',
    });

    return HttpResponse.json(role, { status: 200 });
  }),

  http.delete('*/api/v1/admin/roles/:id/', async ({ params }) => {
    await delay(700);
    const id = params.id as string;
    const role = activeRoles.find((r) => r.id === id);

    if (!role) {
      return HttpResponse.json({ code: 'not_found', message: 'Role not found.' }, { status: 404 });
    }

    if (role.is_system) {
      return HttpResponse.json(
        { code: 'system_role_locked', message: 'System-defined roles cannot be deleted.' },
        { status: 403 }
      );
    }

    if (role.user_count > 0) {
      return HttpResponse.json(
        {
          code: 'role_in_use',
          message: `Cannot delete role with ${role.user_count} assigned staff members. Reassign them first.`,
        },
        { status: 400 }
      );
    }

    activeRoles = activeRoles.filter((r) => r.id !== id);

    recordAuditLog({
      action: 'ROLE_DELETED',
      module: 'staff_roles',
      target_id: role.id,
      target_name: role.name,
      reason: 'Deleted custom role.',
    });

    return HttpResponse.json({ success: true, message: 'Role deleted.' }, { status: 200 });
  }),

  http.get('*/api/v1/admin/staff/', async () => {
    await delay(700);
    return HttpResponse.json(activeStaff, { status: 200 });
  }),

  http.patch('*/api/v1/admin/staff/:id/role/', async ({ params, request }) => {
    await delay(700);
    const id = params.id as string;
    const staff = activeStaff.find((s) => s.id === id);

    if (!staff) {
      return HttpResponse.json({ code: 'not_found', message: 'Staff user not found.' }, { status: 404 });
    }

    const body = (await request.json()) as { role_id: string };
    const newRole = activeRoles.find((r) => r.id === body.role_id);

    if (!newRole) {
      return HttpResponse.json({ code: 'not_found', message: 'Selected role not found.' }, { status: 404 });
    }

    // Safety rule: Cannot change own role if super admin
    if (staff.id === currentAdminUser?.id && newRole.id !== 'role_super_admin') {
      return HttpResponse.json(
        { code: 'cannot_demote_self', message: 'You cannot alter your own administrative role.' },
        { status: 403 }
      );
    }

    staff.role_id = newRole.id;
    staff.role_name = newRole.name;
    staff.permissions = newRole.permissions;

    recordAuditLog({
      action: 'STAFF_ROLE_ASSIGNED',
      module: 'staff_roles',
      target_id: staff.id,
      target_name: staff.name,
      reason: `Assigned new role: ${newRole.name}.`,
    });

    return HttpResponse.json(staff, { status: 200 });
  }),

  /* ------------------------------------------------------------------------ */
  /* 5. AUDIT LOG                                                             */
  /* ------------------------------------------------------------------------ */
  http.get('*/api/v1/admin/audit-log/', async ({ request }) => {
    await delay(700);
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const action = url.searchParams.get('action');
    const moduleParam = url.searchParams.get('module');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('page_size') || '25', 10);

    let filtered = [...activeAuditLogs];

    if (action && action !== 'all') {
      filtered = filtered.filter((log) => log.action.toLowerCase().includes(action.toLowerCase()));
    }

    if (moduleParam && moduleParam !== 'all') {
      filtered = filtered.filter((log) => log.module === moduleParam);
    }

    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.actor_name.toLowerCase().includes(search) ||
          log.actor_email.toLowerCase().includes(search) ||
          log.target_name.toLowerCase().includes(search) ||
          log.action.toLowerCase().includes(search) ||
          (log.reason && log.reason.toLowerCase().includes(search))
      );
    }

    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json(
      {
        count: totalCount,
        next: startIndex + pageSize < totalCount ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results: paginated,
      },
      { status: 200 }
    );
  }),
];
