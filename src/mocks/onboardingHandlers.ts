import { http, HttpResponse, delay } from 'msw';
import { activeSellers } from './adminHandlers';
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
  UploadedDocument,
} from '../types/onboarding';
import type { AdminSellerDetail } from '../types/admin';

// In-memory document storage
const mockDocuments = new Map<string, UploadedDocument>();

// In-memory onboarding draft storage keyed by user/seller id
const mockOnboardingDrafts = new Map<string, OnboardingDraftResponse>();

// In-memory status storage keyed by user/seller id
const mockVendorStatuses = new Map<string, VendorStatusResponse>();

// Helper to generate UUIDs
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---------------------------------------------------------------------------
// Pre-seeded accounts and states
// ---------------------------------------------------------------------------
const SEEDED_USERS = {
  new: 'v_new_test_com',
  review: 'v_review_test_com',
  rejected: 'v_rejected_test_com',
  suspended: 'v_suspended_test_com',
  approved: 'v_approved_test_com',
};

// Seed "new@test.com" (empty wizard, onboarding_incomplete)
mockVendorStatuses.set(SEEDED_USERS.new, {
  status: 'onboarding_incomplete',
  submitted_at: null,
  rejection_reason: null,
  flagged_sections: [],
  summary: {
    store_name: 'Kerala Spice Garden',
    seller_type: 'individual_artisan',
  },
});
mockOnboardingDrafts.set(SEEDED_USERS.new, {
  current_step: 1,
  step_1: {
    store_name: 'Kerala Spice Garden',
    store_slug: '',
    short_description: '',
    seller_story: '',
    logo_document_id: null,
    banner_document_id: null,
    languages_spoken: ['Malayalam', 'English'],
    seller_type: 'individual_artisan',
    social_links: { instagram: '', facebook: '', website: '' },
  },
  flagged_sections: [],
  is_completed: false,
});

// Seed "review@test.com" (under_review, completed wizard)
mockVendorStatuses.set(SEEDED_USERS.review, {
  status: 'under_review',
  submitted_at: '2026-10-23T10:30:00Z',
  rejection_reason: null,
  flagged_sections: [],
  summary: {
    store_name: 'Handmade Silk & Linen',
    seller_type: 'small_business',
    pickup_city: 'Thrissur',
    pickup_state: 'Kerala',
    pan_masked: 'AAAPM••••L',
    bank_account_masked: '••••••••4582',
    bank_name: 'State Bank of India',
    submitted_documents_count: 4,
  },
});
mockOnboardingDrafts.set(SEEDED_USERS.review, {
  current_step: 5,
  is_completed: true,
  updated_at: '2026-10-23T10:30:00Z',
  step_1: {
    store_name: 'Handmade Silk & Linen',
    store_slug: 'handmade-silk-linen',
    short_description: 'Authentic pure mulberry silk and handwoven linen fabrics.',
    seller_story: 'Carrying forward three generations of traditional village handloom craftsmanship in Thrissur.',
    languages_spoken: ['English', 'Malayalam'],
    seller_type: 'small_business',
  },
  step_2: {
    pickup_address: {
      contact_person: 'Lakshmi Menon',
      address_line1: '14 Weavers Street, Kurkancheri',
      city: 'Thrissur',
      state: 'Kerala',
      pincode: '680007',
      courier_mobile: '9876543213',
    },
    same_as_business_address: true,
  },
  step_3: {
    pan_number: 'AAAPM1234L',
    pan_number_masked: 'AAAPM••••L',
    pan_document_id: 'doc_seed_pan_review',
    identity_proof_type: 'aadhaar_masked',
    identity_document_id: 'doc_seed_id_review',
    address_document_id: 'doc_seed_addr_review',
  },
  step_4: {
    account_holder_name: 'Lakshmi Menon',
    account_number_masked: '••••••••4582',
    ifsc_code: 'SBIN0001234',
    bank_name: 'State Bank of India',
    branch_name: 'Ernakulam Main',
    account_type: 'savings',
    cheque_document_id: 'doc_seed_cheque_review',
  },
  step_5: {
    accepted_agreement: true,
  },
});

// Seed "rejected@test.com" (rejected / resubmission_requested with flagged sections)
mockVendorStatuses.set(SEEDED_USERS.rejected, {
  status: 'resubmission_requested',
  submitted_at: '2026-10-22T08:00:00Z',
  rejection_reason:
    'PAN card copy is blurry and illegible. In addition, please expand your store description with specific craft techniques used.',
  flagged_sections: [1, 3],
  summary: {
    store_name: 'Artisan Wood Craft',
    seller_type: 'individual_artisan',
    pickup_city: 'Kochi',
    pickup_state: 'Kerala',
    pan_masked: 'ABCDE••••F',
    bank_account_masked: '••••••••8891',
    bank_name: 'Canara Bank',
    submitted_documents_count: 4,
  },
});
mockOnboardingDrafts.set(SEEDED_USERS.rejected, {
  current_step: 1,
  flagged_sections: [1, 3],
  is_completed: false,
  step_1: {
    store_name: 'Artisan Wood Craft',
    store_slug: 'artisan-wood-craft',
    short_description: 'Handcrafted teak and rosewood kitchenware.',
    seller_story: 'Master woodworker creating eco-friendly functional sculptures and tableware.',
    languages_spoken: ['Malayalam', 'English', 'Tamil'],
    seller_type: 'individual_artisan',
  },
  step_2: {
    pickup_address: {
      contact_person: 'Karthik Raja',
      address_line1: '88 River Road, Aluva',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '683101',
      courier_mobile: '9876543214',
    },
    same_as_business_address: true,
  },
  step_3: {
    pan_number: 'ABCDE1234F',
    pan_number_masked: 'ABCDE••••F',
    pan_document_id: 'doc_seed_pan_rej',
    identity_proof_type: 'voter_id',
    identity_document_id: 'doc_seed_id_rej',
    address_document_id: 'doc_seed_addr_rej',
  },
  step_4: {
    account_holder_name: 'Karthik Raja',
    account_number_masked: '••••••••8891',
    ifsc_code: 'CNRB0001234',
    bank_name: 'Canara Bank',
    branch_name: 'Aluva Branch',
    account_type: 'savings',
    cheque_document_id: 'doc_seed_cheque_rej',
  },
  step_5: {
    accepted_agreement: false,
  },
});

// Seed "suspended@test.com"
mockVendorStatuses.set(SEEDED_USERS.suspended, {
  status: 'suspended',
  submitted_at: '2026-10-15T09:00:00Z',
  rejection_reason:
    'Seller account suspended following a routine compliance check on registered bank payout details.',
  flagged_sections: [],
  summary: {
    store_name: 'Botanical Herbs & Soaps',
    seller_type: 'small_business',
  },
});

// Seed "approved@test.com"
mockVendorStatuses.set(SEEDED_USERS.approved, {
  status: 'approved',
  submitted_at: '2026-10-10T09:00:00Z',
  rejection_reason: null,
  flagged_sections: [],
  summary: {
    store_name: 'Chilly Earth Pottery',
    seller_type: 'individual_artisan',
  },
});

// Helper to resolve the active vendor ID
function resolveVendorId(request: Request): string {
  // Check auth header or cookie if present
  const authHeader = request.headers.get('Authorization') || '';
  const match = authHeader.match(/Bearer\s+v_([a-zA-Z0-9_]+)/);
  if (match) return `v_${match[1]}`;

  // If URL has user context or in development session, fallback to active session
  if (typeof window !== 'undefined') {
    const rawAuth = localStorage.getItem('auth_token') || '';
    if (rawAuth && rawAuth.startsWith('v_')) return rawAuth;
  }

  // Default to the first incomplete seller or a generic ID
  return SEEDED_USERS.new;
}

// ---------------------------------------------------------------------------
// MSW Handlers
// ---------------------------------------------------------------------------
export const onboardingHandlers = [
  // 1. GET /api/v1/vendor/onboarding/
  http.get('*/api/v1/vendor/onboarding/', async ({ request }) => {
    await delay(700);
    const vendorId = resolveVendorId(request);

    let draft = mockOnboardingDrafts.get(vendorId);
    if (!draft) {
      draft = {
        current_step: 1,
        step_1: {
          store_name: '',
          store_slug: '',
          short_description: '',
          seller_story: '',
          languages_spoken: ['English'],
          seller_type: 'individual_artisan',
        },
        flagged_sections: [],
        is_completed: false,
        updated_at: new Date().toISOString(),
      };
      mockOnboardingDrafts.set(vendorId, draft);
    }

    return HttpResponse.json(draft, { status: 200 });
  }),

  // 2. PUT /api/v1/vendor/onboarding/steps/:stepNumber/
  http.put('*/api/v1/vendor/onboarding/steps/:stepNumber/', async ({ params, request }) => {
    await delay(700);
    const vendorId = resolveVendorId(request);
    const stepNumber = parseInt(params.stepNumber as string, 10);
    const body = await request.json();

    let draft = mockOnboardingDrafts.get(vendorId) || {
      current_step: 1,
      flagged_sections: [],
      is_completed: false,
    };

    if (stepNumber === 1) {
      draft.step_1 = body as StoreDetailsStepData;
      if (draft.current_step < 2) draft.current_step = 2;
    } else if (stepNumber === 2) {
      draft.step_2 = body as PickupAddressStepData;
      if (draft.current_step < 3) draft.current_step = 3;
    } else if (stepNumber === 3) {
      const data = body as VerificationStepData;
      if (data.pan_number) {
        data.pan_number_masked = `${data.pan_number.slice(0, 5)}••••${data.pan_number.slice(-1)}`;
      }
      draft.step_3 = data;
      if (draft.current_step < 4) draft.current_step = 4;
    } else if (stepNumber === 4) {
      const data = body as BankDetailsStepData;
      if (data.account_number && !data.account_number.includes('•')) {
        data.account_number_masked = `••••••••${data.account_number.slice(-4)}`;
        delete data.account_number;
        delete data.confirm_account_number;
      }
      draft.step_4 = data;
      if (draft.current_step < 5) draft.current_step = 5;
    } else if (stepNumber === 5) {
      draft.step_5 = body as ReviewSubmitStepData;
    }

    draft.updated_at = new Date().toISOString();
    mockOnboardingDrafts.set(vendorId, draft);

    return HttpResponse.json(draft, { status: 200 });
  }),

  // 3. POST /api/v1/vendor/onboarding/documents/ (Multipart)
  http.post('*/api/v1/vendor/onboarding/documents/', async ({ request }) => {
    await delay(700);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('document_type') as string;

    if (!file) {
      return HttpResponse.json(
        { code: 'file_missing', message: 'No document file was uploaded in request.' },
        { status: 400 }
      );
    }

    // Server-side type and size validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isImageDoc = documentType === 'store_logo' || documentType === 'store_banner';
    const allowed = isImageDoc ? ['jpg', 'jpeg', 'png', 'webp'] : ['jpg', 'jpeg', 'png', 'pdf'];
    const maxMb = documentType === 'store_logo' ? 2 : documentType === 'store_banner' ? 3 : 5;

    if (!ext || !allowed.includes(ext)) {
      return HttpResponse.json(
        {
          code: 'invalid_type',
          message: `Only ${allowed.join(', ').toUpperCase()} formats are supported for this document slot.`,
        },
        { status: 400 }
      );
    }

    if (file.size > maxMb * 1024 * 1024) {
      return HttpResponse.json(
        { code: 'file_too_large', message: `File size exceeds the server limit of ${maxMb} MB.` },
        { status: 400 }
      );
    }

    const docId = `doc_${generateUuid()}`;
    const uploadedDoc: UploadedDocument = {
      id: docId,
      document_type: documentType as any,
      filename: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      status: 'uploaded',
      created_at: new Date().toISOString(),
    };

    mockDocuments.set(docId, uploadedDoc);

    const response: DocumentUploadResponse = {
      id: docId,
      filename: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  // 4. DELETE /api/v1/vendor/onboarding/documents/:id/
  http.delete('*/api/v1/vendor/onboarding/documents/:id/', async ({ params }) => {
    await delay(400);
    const id = params.id as string;
    mockDocuments.delete(id);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // 5. GET /api/v1/vendor/onboarding/documents/:id/preview-link/
  http.get('*/api/v1/vendor/onboarding/documents/:id/preview-link/', async ({ params }) => {
    await delay(300);
    const id = params.id as string;

    const preview: DocumentPreviewResponse = {
      id,
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      expires_at: new Date(Date.now() + 600000).toISOString(), // 10 minutes
    };

    return HttpResponse.json(preview, { status: 200 });
  }),

  // 6. GET /api/v1/vendor/onboarding/slug-available/?slug=
  http.get('*/api/v1/vendor/onboarding/slug-available/', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const slug = (url.searchParams.get('slug') || '').trim().toLowerCase();

    // Mock taken slug
    if (slug === 'chilly-earth-pottery' || slug === 'dravida-loom-crafts') {
      const resp: SlugAvailabilityResponse = { slug, available: false };
      return HttpResponse.json(resp, { status: 200 });
    }

    const resp: SlugAvailabilityResponse = { slug, available: true };
    return HttpResponse.json(resp, { status: 200 });
  }),

  // 7. GET /api/v1/vendor/ifsc/:code/
  http.get('*/api/v1/vendor/ifsc/:code/', async ({ params }) => {
    await delay(500);
    const rawCode = ((params.code as string) || '').trim().toUpperCase();

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(rawCode)) {
      return HttpResponse.json(
        { code: 'invalid_ifsc', message: 'Invalid IFSC format. Must be 11 alphanumeric characters.' },
        { status: 400 }
      );
    }

    if (rawCode === 'SBIN0001234') {
      const resp: IfscLookupResponse = {
        ifsc: 'SBIN0001234',
        bank: 'State Bank of India',
        branch: 'Ernakulam Main',
        city: 'Kochi',
        state: 'Kerala',
      };
      return HttpResponse.json(resp, { status: 200 });
    }

    // Realistic fallback mock based on 4-letter prefix
    const prefix = rawCode.slice(0, 4);
    const bankNames: Record<string, string> = {
      HDFC: 'HDFC Bank',
      ICIC: 'ICICI Bank',
      KKBK: 'Kotak Mahindra Bank',
      BARB: 'Bank of Baroda',
      PUNB: 'Punjab National Bank',
      CNRB: 'Canara Bank',
      UTIB: 'Axis Bank',
    };

    const resp: IfscLookupResponse = {
      ifsc: rawCode,
      bank: bankNames[prefix] || 'Commercial Bank of India',
      branch: 'Main City Branch',
      city: 'Thrissur',
      state: 'Kerala',
    };

    return HttpResponse.json(resp, { status: 200 });
  }),

  // 8. POST /api/v1/vendor/onboarding/submit/
  http.post('*/api/v1/vendor/onboarding/submit/', async ({ request }) => {
    await delay(700);
    const vendorId = resolveVendorId(request);
    const draft = mockOnboardingDrafts.get(vendorId);

    // Validate mandatory compliance steps (pickup address, KYC verification, bank account)
    if (!draft?.step_2 || !draft?.step_3 || !draft?.step_4) {
      return HttpResponse.json(
        {
          code: 'incomplete_submission',
          message: 'All mandatory onboarding steps (Pickup Address, KYC, and Bank Details) must be completed before submission.',
        },
        { status: 400 }
      );
    }

    const step1Data = draft.step_1 || {
      store_name: 'Artisan Store',
      store_slug: `artisan-${vendorId.slice(-4)}`,
      seller_type: 'individual_artisan',
      languages_spoken: ['English'],
      short_description: 'Authentic handcrafted creations and artisan goods.',
      seller_story: '',
      logo_document_id: null,
      banner_document_id: null,
      social_links: {},
    };

    const submittedAt = new Date().toISOString();

    // 1. Update vendor status
    const statusResp: VendorStatusResponse = {
      status: 'under_review',
      submitted_at: submittedAt,
      rejection_reason: null,
      flagged_sections: [],
      summary: {
        store_name: step1Data.store_name,
        seller_type: step1Data.seller_type,
        pickup_city: draft.step_2.pickup_address.city,
        pickup_state: draft.step_2.pickup_address.state,
        pan_masked: draft.step_3.pan_number_masked || 'ABCDE••••F',
        bank_account_masked: draft.step_4.account_number_masked || '••••••••1234',
        bank_name: draft.step_4.bank_name || 'Verified Bank',
        submitted_documents_count: 4,
      },
    };
    mockVendorStatuses.set(vendorId, statusResp);

    draft.is_completed = true;
    mockOnboardingDrafts.set(vendorId, draft);

    // 2. Add or update seller in activeSellers for the Super Admin Seller Hub queue!
    const existingIndex = activeSellers.findIndex((s) => s.id === vendorId || s.store_slug === step1Data.store_slug);
    const adminSellerItem: AdminSellerDetail = {
      id: vendorId,
      legal_name: step1Data.store_name,
      store_name: step1Data.store_name,
      store_slug: step1Data.store_slug || 'artisan-store',
      business_type: step1Data.seller_type === 'registered_company' ? 'registered_company' : 'individual',
      tax_id_masked: draft.step_3.gstin ? '••••••••' + draft.step_3.gstin.slice(-4) : 'N/A',
      full_tax_id: draft.step_3.gstin || undefined,
      pan_masked: draft.step_3.pan_number_masked || 'ABCDE••••F',
      full_pan: draft.step_3.pan_number,
      contact_person: draft.step_2.pickup_address.contact_person,
      email: `${vendorId}@chillyflakes.in`,
      phone: draft.step_2.pickup_address.courier_mobile,
      pickup_address: {
        line1: draft.step_2.pickup_address.address_line1,
        line2: draft.step_2.pickup_address.address_line2,
        city: draft.step_2.pickup_address.city,
        state: draft.step_2.pickup_address.state,
        pincode: draft.step_2.pickup_address.pincode,
        country: 'India',
      },
      declared_categories: ['Handmade Products', 'Natural Products'],
      wholesale_enabled: true,
      status: 'under_review',
      assigned_reviewer: 'Curation Staff',
      review_started_at: submittedAt,
      days_in_current_status: 1,
      documents: [
        {
          id: draft.step_3.pan_document_id || 'doc_pan',
          type: 'pan_card',
          title: 'PAN Document',
          file_name: 'pan_card.pdf',
          file_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
          file_size_bytes: 450000,
          mime_type: 'application/pdf',
          status: 'pending',
          uploaded_at: submittedAt,
          is_sensitive: true,
        },
        {
          id: draft.step_3.identity_document_id || 'doc_id',
          type: 'identity_proof',
          title: 'Identity Proof',
          file_name: 'identity_proof.pdf',
          file_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          file_size_bytes: 520000,
          mime_type: 'application/pdf',
          status: 'pending',
          uploaded_at: submittedAt,
          is_sensitive: true,
        },
      ],
      bank_info: {
        account_holder_name: draft.step_4.account_holder_name,
        bank_name: draft.step_4.bank_name || 'State Bank of India',
        branch: draft.step_4.branch_name || 'Main Branch',
        ifsc_code: draft.step_4.ifsc_code,
        account_number_masked: draft.step_4.account_number_masked || '••••••••1234',
        holder_matches_pan: true,
      },
      review_history: [
        {
          id: `rev_${generateUuid()}`,
          reviewer_name: 'System Automation',
          action: 'under_review',
          notes: 'Application submitted by seller; entered queue for KYC verification.',
          created_at: submittedAt,
        },
      ],
      created_at: submittedAt,
      updated_at: submittedAt,
    };

    if (existingIndex >= 0) {
      activeSellers[existingIndex] = adminSellerItem;
    } else {
      activeSellers.unshift(adminSellerItem);
    }

    const response: OnboardingSubmitResponse = {
      success: true,
      status: 'under_review',
      submitted_at: submittedAt,
      message: 'Onboarding application submitted for super admin verification.',
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  // 9. GET /api/v1/vendor/status/
  http.get('*/api/v1/vendor/status/', async ({ request }) => {
    await delay(400);
    const vendorId = resolveVendorId(request);

    // Cross-check if the admin changed the seller status in activeSellers!
    const adminSeller = activeSellers.find((s) => s.id === vendorId);
    let currentStatus = mockVendorStatuses.get(vendorId);

    if (adminSeller) {
      if (!currentStatus) {
        currentStatus = {
          status: adminSeller.status as any,
          submitted_at: adminSeller.created_at || null,
          rejection_reason: null,
          flagged_sections: [],
          summary: {
            store_name: adminSeller.store_name,
            pickup_city: adminSeller.pickup_address.city,
            pickup_state: adminSeller.pickup_address.state,
            pan_masked: adminSeller.pan_masked,
            bank_account_masked: adminSeller.bank_info?.account_number_masked,
            bank_name: adminSeller.bank_info?.bank_name,
          },
        };
      } else {
        // Sync status from admin decisions
        currentStatus.status = adminSeller.status as any;
        if (adminSeller.status === 'resubmission_requested' || adminSeller.status === 'rejected') {
          const lastRejectLog = adminSeller.review_history
            ?.slice()
            .reverse()
            .find((l) => l.action === 'rejected' || l.action === 'resubmission_requested');
          if (lastRejectLog?.notes) {
            currentStatus.rejection_reason = lastRejectLog.notes;
          }
          if (lastRejectLog?.flagged_sections && lastRejectLog.flagged_sections.length > 0) {
            currentStatus.flagged_sections = lastRejectLog.flagged_sections.map((s) =>
              s.includes('1') || s.includes('store') ? 1 : 3
            );
          }
        }
      }
    }

    if (!currentStatus) {
      currentStatus = {
        status: 'onboarding_incomplete',
        submitted_at: null,
        rejection_reason: null,
        flagged_sections: [],
      };
      mockVendorStatuses.set(vendorId, currentStatus);
    }

    return HttpResponse.json(currentStatus, { status: 200 });
  }),
];
