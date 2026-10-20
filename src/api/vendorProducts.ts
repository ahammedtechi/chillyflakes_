import { axiosClient } from './client';
import type {
  VendorProduct,
  VendorProductListResponse,
  VendorProductFilterParams,
  VendorProductPayload,
  VendorProductDetailResponse,
  UploadResponse,
} from '../types/product';
import type { VendorCategoryWithAttributes } from '../types/categoryAttributes';

/**
 * GET /api/v1/vendor/categories/
 */
export async function getVendorCategories(): Promise<VendorCategoryWithAttributes[]> {
  const response = await axiosClient.get<VendorCategoryWithAttributes[]>(
    '/api/v1/vendor/categories/'
  );
  return response.data;
}

/**
 * GET /api/v1/vendor/products/
 */
export async function getVendorProducts(
  params?: VendorProductFilterParams
): Promise<VendorProductListResponse> {
  const response = await axiosClient.get<VendorProductListResponse>(
    '/api/v1/vendor/products/',
    { params }
  );
  return response.data;
}

/**
 * GET /api/v1/vendor/products/{id}/
 */
export async function getVendorProductDetail(
  id: string
): Promise<VendorProductDetailResponse> {
  const response = await axiosClient.get<VendorProductDetailResponse>(
    `/api/v1/vendor/products/${id}/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/
 * Creates a draft product
 */
export async function createProductDraft(
  payload: Partial<VendorProductPayload>
): Promise<VendorProductDetailResponse> {
  const response = await axiosClient.post<VendorProductDetailResponse>(
    '/api/v1/vendor/products/',
    payload
  );
  return response.data;
}

/**
 * PATCH /api/v1/vendor/products/{id}/
 * Updates an existing product
 */
export async function updateProduct(
  id: string,
  payload: Partial<VendorProductPayload>
): Promise<VendorProductDetailResponse> {
  const response = await axiosClient.patch<VendorProductDetailResponse>(
    `/api/v1/vendor/products/${id}/`,
    payload
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/submit/
 * Validates and submits product for platform super admin review
 */
export async function submitProductForReview(
  id: string
): Promise<VendorProductDetailResponse> {
  const response = await axiosClient.post<VendorProductDetailResponse>(
    `/api/v1/vendor/products/${id}/submit/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/uploads/images/
 */
export async function uploadProductImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post<UploadResponse>(
    '/api/v1/vendor/uploads/images/',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      },
    }
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/uploads/video/
 */
export async function uploadProductVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient.post<UploadResponse>(
    '/api/v1/vendor/uploads/video/',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(pct);
        }
      },
    }
  );
  return response.data;
}

/**
 * DELETE /api/v1/vendor/uploads/{id}/
 */
export async function deleteUpload(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/vendor/uploads/${id}/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/duplicate/
 */
export async function duplicateProduct(id: string): Promise<VendorProduct> {
  const response = await axiosClient.post<VendorProduct>(
    `/api/v1/vendor/products/${id}/duplicate/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/withdraw/
 * Moves a pending_review product back to draft
 */
export async function withdrawProduct(id: string): Promise<VendorProduct> {
  const response = await axiosClient.post<VendorProduct>(
    `/api/v1/vendor/products/${id}/withdraw/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/unpublish/
 */
export async function unpublishProduct(id: string): Promise<VendorProduct> {
  const response = await axiosClient.post<VendorProduct>(
    `/api/v1/vendor/products/${id}/unpublish/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/republish/
 */
export async function republishProduct(id: string): Promise<VendorProduct> {
  const response = await axiosClient.post<VendorProduct>(
    `/api/v1/vendor/products/${id}/republish/`
  );
  return response.data;
}

/**
 * POST /api/v1/vendor/products/{id}/archive/
 */
export async function archiveProduct(id: string): Promise<VendorProduct> {
  const response = await axiosClient.post<VendorProduct>(
    `/api/v1/vendor/products/${id}/archive/`
  );
  return response.data;
}

/**
 * DELETE /api/v1/vendor/products/{id}/
 * Drafts only; others return 409 not_deletable
 */
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await axiosClient.delete<{ success: boolean; message: string }>(
    `/api/v1/vendor/products/${id}/`
  );
  return response.data;
}

