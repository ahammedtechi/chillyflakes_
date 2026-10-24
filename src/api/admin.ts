import { axiosClient } from './client';
import type {
  AdminOverviewResponse,
  AdminUserListResponse,
  AdminUserAccount,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
  AdminSellerListResponse,
  AdminSellerDetail,
  SellerOnboardingStatus,
  AdminRole,
  AdminStaffUser,
  PermissionKey,
  AdminAuditLogResponse,
} from '../types/admin';

/* -------------------------------------------------------------------------- */
/* 1. OVERVIEW                                                                */
/* -------------------------------------------------------------------------- */
export async function getAdminOverview(): Promise<AdminOverviewResponse> {
  const response = await axiosClient.get<AdminOverviewResponse>('/api/v1/admin/overview/');
  return response.data;
}

/* -------------------------------------------------------------------------- */
/* 2. USER / CUSTOMER MANAGEMENT                                              */
/* -------------------------------------------------------------------------- */
export interface AdminUserFilterParams {
  tab?: 'customers' | 'staff_admins' | 'all_accounts' | 'deleted';
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export async function getAdminUsers(params?: AdminUserFilterParams): Promise<AdminUserListResponse> {
  const response = await axiosClient.get<AdminUserListResponse>('/api/v1/admin/users/', { params });
  return response.data;
}

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUserAccount> {
  const response = await axiosClient.post<AdminUserAccount>('/api/v1/admin/users/', payload);
  return response.data;
}

export async function getAdminUserDetail(id: string): Promise<AdminUserAccount> {
  const response = await axiosClient.get<AdminUserAccount>(`/api/v1/admin/users/${id}/`);
  return response.data;
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload): Promise<AdminUserAccount> {
  const response = await axiosClient.patch<AdminUserAccount>(`/api/v1/admin/users/${id}/`, payload);
  return response.data;
}

export async function deactivateAdminUser(id: string): Promise<AdminUserAccount> {
  const response = await axiosClient.post<AdminUserAccount>(`/api/v1/admin/users/${id}/deactivate/`);
  return response.data;
}

export async function activateAdminUser(id: string): Promise<AdminUserAccount> {
  const response = await axiosClient.post<AdminUserAccount>(`/api/v1/admin/users/${id}/activate/`);
  return response.data;
}

export async function forcePasswordReset(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.post<{ success: boolean; message: string }>(
    `/api/v1/admin/users/${id}/force-password-reset/`
  );
  return response.data;
}

export async function signOutAllSessions(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.post<{ success: boolean; message: string }>(
    `/api/v1/admin/users/${id}/sign-out-all/`
  );
  return response.data;
}

export async function softDeleteAdminUser(id: string, reason: string): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/admin/users/${id}/`,
    { data: { reason } }
  );
  return response.data;
}

/* -------------------------------------------------------------------------- */
/* 3. VENDOR & SELLER HUB                                                     */
/* -------------------------------------------------------------------------- */
export interface AdminSellerFilterParams {
  status?: SellerOnboardingStatus | 'all';
  search?: string;
  state?: string;
  business_type?: string;
  page?: number;
  page_size?: number;
}

export async function getAdminSellers(params?: AdminSellerFilterParams): Promise<AdminSellerListResponse> {
  const response = await axiosClient.get<AdminSellerListResponse>('/api/v1/admin/sellers/', { params });
  return response.data;
}

export async function getAdminSellerDetail(id: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.get<AdminSellerDetail>(`/api/v1/admin/sellers/${id}/`);
  return response.data;
}

export async function verifySellerDocument(sellerId: string, docId: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/documents/${docId}/verify/`
  );
  return response.data;
}

export async function rejectSellerDocument(
  sellerId: string,
  docId: string,
  reason: string
): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/documents/${docId}/reject/`,
    { reason }
  );
  return response.data;
}

export async function markSellerUnderReview(sellerId: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/under-review/`
  );
  return response.data;
}

export async function approveSellerMerchant(sellerId: string, reason?: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/approve/`,
    { reason }
  );
  return response.data;
}

export async function requestSellerResubmit(
  sellerId: string,
  reason: string,
  flagged_sections: string[]
): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/request-resubmit/`,
    { reason, flagged_sections }
  );
  return response.data;
}

export async function rejectSellerMerchant(sellerId: string, reason: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/reject/`,
    { reason }
  );
  return response.data;
}

export async function suspendSellerMerchant(sellerId: string, reason: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/suspend/`,
    { reason }
  );
  return response.data;
}

export async function reactivateSellerMerchant(sellerId: string, reason?: string): Promise<AdminSellerDetail> {
  const response = await axiosClient.post<AdminSellerDetail>(
    `/api/v1/admin/sellers/${sellerId}/reactivate/`,
    { reason }
  );
  return response.data;
}

export async function revealSellerSensitiveField(
  sellerId: string,
  field: 'tax_id' | 'pan' | 'bank_account'
): Promise<{ field: string; value: string }> {
  const response = await axiosClient.post<{ field: string; value: string }>(
    `/api/v1/admin/sellers/${sellerId}/reveal/`,
    { field }
  );
  return response.data;
}

/* -------------------------------------------------------------------------- */
/* 4. STAFF & ROLES                                                           */
/* -------------------------------------------------------------------------- */
export async function getAdminRoles(): Promise<AdminRole[]> {
  const response = await axiosClient.get<AdminRole[]>('/api/v1/admin/roles/');
  return response.data;
}

export async function createAdminRole(payload: {
  name: string;
  description: string;
  permissions: PermissionKey[];
}): Promise<AdminRole> {
  const response = await axiosClient.post<AdminRole>('/api/v1/admin/roles/', payload);
  return response.data;
}

export async function updateAdminRole(
  id: string,
  payload: { name?: string; description?: string; permissions?: PermissionKey[] }
): Promise<AdminRole> {
  const response = await axiosClient.patch<AdminRole>(`/api/v1/admin/roles/${id}/`, payload);
  return response.data;
}

export async function deleteAdminRole(id: string): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(`/api/v1/admin/roles/${id}/`);
  return response.data;
}

export async function getAdminStaff(): Promise<AdminStaffUser[]> {
  const response = await axiosClient.get<AdminStaffUser[]>('/api/v1/admin/staff/');
  return response.data;
}

export async function updateStaffRole(staffId: string, role_id: string): Promise<AdminStaffUser> {
  const response = await axiosClient.patch<AdminStaffUser>(`/api/v1/admin/staff/${staffId}/role/`, {
    role_id,
  });
  return response.data;
}

/* -------------------------------------------------------------------------- */
/* 5. AUDIT LOG                                                               */
/* -------------------------------------------------------------------------- */
export interface AdminAuditLogParams {
  search?: string;
  action?: string;
  module?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export async function getAdminAuditLogs(params?: AdminAuditLogParams): Promise<AdminAuditLogResponse> {
  const response = await axiosClient.get<AdminAuditLogResponse>('/api/v1/admin/audit-log/', { params });
  return response.data;
}
