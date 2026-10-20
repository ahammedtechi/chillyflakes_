import { axiosClient } from './client';
import type {
  AdminProductDetail,
  AdminProductListResponse,
  AdminProductFilterParams,
  RejectReasonCode,
  AdminApprovePayload,
  AdminUser,
} from '../types/adminProduct';

/**
 * Admin Authentication
 */
export async function adminLogin(payload: {
  email: string;
  password: string;
}): Promise<{ message: string; user: AdminUser }> {
  const response = await axiosClient.post<{ message: string; user: AdminUser }>(
    '/api/v1/admin/auth/login/',
    payload
  );
  return response.data;
}

export async function adminLogout(): Promise<{ message: string }> {
  const response = await axiosClient.post<{ message: string }>(
    '/api/v1/admin/auth/logout/'
  );
  return response.data;
}

export async function getAdminMe(): Promise<AdminUser> {
  const response = await axiosClient.get<AdminUser>('/api/v1/admin/auth/me/');
  return response.data;
}

/**
 * Admin Products Management
 */
export async function getAdminProducts(
  params?: AdminProductFilterParams
): Promise<AdminProductListResponse> {
  const response = await axiosClient.get<AdminProductListResponse>(
    '/api/v1/admin/products/',
    { params }
  );
  return response.data;
}

export async function getAdminProductDetail(id: string): Promise<AdminProductDetail> {
  const response = await axiosClient.get<AdminProductDetail>(
    `/api/v1/admin/products/${id}/`
  );
  return response.data;
}

export async function approveAdminProduct(
  id: string,
  payload?: AdminApprovePayload
): Promise<AdminProductDetail> {
  const response = await axiosClient.post<AdminProductDetail>(
    `/api/v1/admin/products/${id}/approve/`,
    payload
  );
  return response.data;
}

export async function rejectAdminProduct(
  id: string,
  payload: { reason_code: RejectReasonCode; reason: string }
): Promise<AdminProductDetail> {
  const response = await axiosClient.post<AdminProductDetail>(
    `/api/v1/admin/products/${id}/reject/`,
    payload
  );
  return response.data;
}
