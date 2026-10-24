export type SellerType = 'individual_artisan' | 'small_business' | 'registered_company';

export type IdentityProofType = 'voter_id' | 'passport' | 'driving_licence' | 'aadhaar_masked';

export type BankAccountType = 'savings' | 'current';

export type DocumentType =
  | 'store_logo'
  | 'store_banner'
  | 'pan_card'
  | 'gstin_certificate'
  | 'identity_proof'
  | 'address_proof'
  | 'artisan_card'
  | 'cheque_passbook';

export interface UploadedDocument {
  id: string; // UUID
  document_type: DocumentType;
  filename: string;
  size: number;
  type: string;
  status: 'uploaded' | 'verified' | 'rejected';
  created_at?: string;
}

export interface DocumentUploadResponse {
  id: string;
  filename: string;
  size: number;
  type: string;
  status: 'uploaded' | 'verified' | 'rejected';
}

export interface DocumentPreviewResponse {
  id: string;
  url: string;
  expires_at: string;
}

export interface StoreDetailsStepData {
  store_name: string;
  store_slug: string;
  short_description: string;
  seller_story: string;
  logo_document_id?: string | null;
  logo_document?: UploadedDocument | null;
  banner_document_id?: string | null;
  banner_document?: UploadedDocument | null;
  languages_spoken: string[];
  social_links?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  seller_type: SellerType;
}

export interface AddressBlock {
  contact_person: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  courier_mobile: string;
}

export interface PickupAddressStepData {
  pickup_address: AddressBlock;
  same_as_business_address: boolean;
  business_address?: AddressBlock;
}

export interface VerificationStepData {
  pan_number: string;
  pan_number_masked?: string;
  pan_document_id: string;
  pan_document?: UploadedDocument | null;
  gstin?: string;
  identity_proof_type: IdentityProofType;
  identity_document_id: string;
  identity_document?: UploadedDocument | null;
  address_document_id: string;
  address_document?: UploadedDocument | null;
  artisan_card_document_id?: string | null;
  artisan_card_document?: UploadedDocument | null;
}

export interface BankDetailsStepData {
  account_holder_name: string;
  account_number?: string;
  confirm_account_number?: string;
  account_number_masked?: string;
  ifsc_code: string;
  bank_name?: string;
  branch_name?: string;
  account_type: BankAccountType;
  cheque_document_id: string;
  cheque_document?: UploadedDocument | null;
}

export interface ReviewSubmitStepData {
  accepted_agreement: boolean;
}

export interface OnboardingDraftResponse {
  current_step: number;
  step_1?: StoreDetailsStepData;
  step_2?: PickupAddressStepData;
  step_3?: VerificationStepData;
  step_4?: BankDetailsStepData;
  step_5?: ReviewSubmitStepData;
  flagged_sections?: number[];
  is_completed?: boolean;
  updated_at?: string;
}

export interface IfscLookupResponse {
  ifsc: string;
  bank: string;
  branch: string;
  city: string;
  state: string;
}

export interface SlugAvailabilityResponse {
  slug: string;
  available: boolean;
}

export interface VendorStatusSummary {
  store_name?: string;
  seller_type?: SellerType;
  pickup_city?: string;
  pickup_state?: string;
  pan_masked?: string;
  bank_account_masked?: string;
  bank_name?: string;
  submitted_documents_count?: number;
}

export interface VendorStatusResponse {
  status:
    | 'onboarding_incomplete'
    | 'under_review'
    | 'resubmission_requested'
    | 'rejected'
    | 'suspended'
    | 'approved';
  submitted_at?: string | null;
  rejection_reason?: string | null;
  flagged_sections?: number[];
  summary?: VendorStatusSummary;
}

export interface OnboardingSubmitResponse {
  success: boolean;
  status: 'under_review';
  submitted_at: string;
  message: string;
}
