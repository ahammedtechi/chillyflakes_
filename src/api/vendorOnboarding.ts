import axiosClient from './client';
import type {
  OnboardingDraftResponse,
  StoreDetailsStepData,
  PickupAddressStepData,
  VerificationStepData,
  BankDetailsStepData,
  ReviewSubmitStepData,
  DocumentUploadResponse,
  DocumentPreviewResponse,
  SlugAvailabilityResponse,
  IfscLookupResponse,
  VendorStatusResponse,
  OnboardingSubmitResponse,
  DocumentType,
} from '../types/onboarding';

/**
 * Fetches the current onboarding draft for the authenticated vendor.
 */
export async function getOnboardingDraft(): Promise<OnboardingDraftResponse> {
  const response = await axiosClient.get<OnboardingDraftResponse>('/api/v1/vendor/onboarding/');
  return response.data;
}

/**
 * Saves a specific onboarding step draft.
 */
export async function saveOnboardingStep(
  stepNumber: number,
  data:
    | StoreDetailsStepData
    | PickupAddressStepData
    | VerificationStepData
    | BankDetailsStepData
    | ReviewSubmitStepData
): Promise<OnboardingDraftResponse> {
  const response = await axiosClient.put<OnboardingDraftResponse>(
    `/api/v1/vendor/onboarding/steps/${stepNumber}/`,
    data
  );
  return response.data;
}

/**
 * Uploads a verification or store document as multipart form data.
 */
export async function uploadOnboardingDocument(
  file: File,
  documentType: DocumentType
): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);

  const response = await axiosClient.post<DocumentUploadResponse>(
    '/api/v1/vendor/onboarding/documents/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * Deletes an uploaded onboarding document by UUID.
 */
export async function deleteOnboardingDocument(id: string): Promise<{ success: boolean }> {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/api/v1/vendor/onboarding/documents/${id}/`
  );
  return response.data;
}

/**
 * Requests an ephemeral, short-lived preview link for a sensitive document.
 */
export async function getDocumentPreviewLink(id: string): Promise<DocumentPreviewResponse> {
  const response = await axiosClient.get<DocumentPreviewResponse>(
    `/api/v1/vendor/onboarding/documents/${id}/preview-link/`
  );
  return response.data;
}

/**
 * Checks whether a store URL slug is available.
 */
export async function checkSlugAvailability(slug: string): Promise<SlugAvailabilityResponse> {
  const response = await axiosClient.get<SlugAvailabilityResponse>(
    '/api/v1/vendor/onboarding/slug-available/',
    {
      params: { slug },
    }
  );
  return response.data;
}

/**
 * Looks up bank and branch details by IFSC code.
 */
export async function lookupIfsc(code: string): Promise<IfscLookupResponse> {
  const cleanCode = code.trim().toUpperCase();
  const response = await axiosClient.get<IfscLookupResponse>(
    `/api/v1/vendor/ifsc/${cleanCode}/`
  );
  return response.data;
}

/**
 * Submits the complete onboarding application for super admin review.
 */
export async function submitOnboarding(): Promise<OnboardingSubmitResponse> {
  const response = await axiosClient.post<OnboardingSubmitResponse>(
    '/api/v1/vendor/onboarding/submit/'
  );
  return response.data;
}

/**
 * Fetches the real-time application status for the authenticated vendor.
 */
export async function getVendorStatus(): Promise<VendorStatusResponse> {
  const response = await axiosClient.get<VendorStatusResponse>('/api/v1/vendor/status/');
  return response.data;
}
