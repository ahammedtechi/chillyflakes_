import { z } from 'zod';
import type { TFunction } from 'i18next';

export const INDIAN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createStep1StoreDetailsSchema = (t: TFunction) =>
  z.object({
    store_name: z
      .string()
      .trim()
      .max(100, { message: t('onboarding.validation.storeNameMax', { defaultValue: 'Store name cannot exceed 100 characters.' }) })
      .optional()
      .or(z.literal('')),
    store_slug: z
      .string()
      .trim()
      .max(50, { message: t('onboarding.validation.slugMax', { defaultValue: 'Slug cannot exceed 50 characters.' }) })
      .refine((val) => !val || (val.length >= 3 && SLUG_REGEX.test(val)), {
        message: t('onboarding.validation.slugInvalid', { defaultValue: 'Slug must be at least 3 characters and contain only lowercase letters, numbers, and single hyphens.' }),
      })
      .optional()
      .or(z.literal('')),
    short_description: z
      .string()
      .trim()
      .max(300, { message: t('onboarding.validation.descMax', { defaultValue: 'Short description cannot exceed 300 characters.' }) })
      .optional()
      .or(z.literal('')),
    seller_story: z
      .string()
      .trim()
      .max(1000, { message: t('onboarding.validation.storyMax', { defaultValue: 'Seller story cannot exceed 1000 characters.' }) })
      .optional()
      .or(z.literal('')),
    logo_document_id: z.string().nullable().optional(),
    banner_document_id: z.string().nullable().optional(),
    languages_spoken: z.array(z.string()).optional().default([]),
    social_links: z
      .object({
        instagram: z.string().trim().optional(),
        facebook: z.string().trim().optional(),
        website: z.string().trim().optional(),
      })
      .optional(),
    seller_type: z.enum(['individual_artisan', 'small_business', 'registered_company']).optional().default('individual_artisan'),
  });

export const addressBlockSchema = (t: TFunction) =>
  z.object({
    contact_person: z
      .string()
      .trim()
      .min(2, { message: t('onboarding.validation.contactPersonRequired', { defaultValue: 'Contact person name is required.' }) })
      .max(100),
    address_line1: z
      .string()
      .trim()
      .min(5, { message: t('onboarding.validation.addressLine1Required', { defaultValue: 'Address line 1 is required (min 5 chars).' }) })
      .max(150),
    address_line2: z.string().trim().max(150).optional(),
    city: z
      .string()
      .trim()
      .min(2, { message: t('onboarding.validation.cityRequired', { defaultValue: 'City is required.' }) })
      .max(100),
    state: z
      .string()
      .trim()
      .min(2, { message: t('onboarding.validation.stateRequired', { defaultValue: 'State is required.' }) })
      .max(100),
    pincode: z
      .string()
      .trim()
      .regex(INDIAN_PINCODE_REGEX, { message: t('onboarding.validation.pincodeInvalid', { defaultValue: 'Enter a valid 6-digit Indian PIN code.' }) }),
    courier_mobile: z
      .string()
      .trim()
      .regex(INDIAN_MOBILE_REGEX, { message: t('onboarding.validation.courierMobileInvalid', { defaultValue: 'Enter a valid 10-digit mobile number for courier dispatch.' }) }),
  });

export const createStep2PickupAddressSchema = (t: TFunction) =>
  z
    .object({
      pickup_address: addressBlockSchema(t),
      same_as_business_address: z.boolean(),
      business_address: z.lazy(() => addressBlockSchema(t).optional()),
    })
    .refine(
      (data) => {
        if (!data.same_as_business_address) {
          return !!data.business_address?.address_line1 && !!data.business_address?.pincode;
        }
        return true;
      },
      {
        message: t('onboarding.validation.businessAddressRequired', { defaultValue: 'Business address is required when different from pickup.' }),
        path: ['business_address', 'address_line1'],
      }
    );

export const createStep3VerificationSchema = (t: TFunction, sellerType?: string) =>
  z
    .object({
      pan_number: z
        .string()
        .trim()
        .toUpperCase()
        .regex(PAN_REGEX, { message: t('onboarding.validation.panInvalid', { defaultValue: 'Enter a valid 10-character PAN (e.g. ABCDE1234F).' }) }),
      pan_document_id: z
        .string({ required_error: t('onboarding.validation.panDocRequired', { defaultValue: 'PAN card document upload is required.' }) })
        .min(1, { message: t('onboarding.validation.panDocRequired', { defaultValue: 'PAN card document upload is required.' }) }),
      gstin: z
        .string()
        .trim()
        .toUpperCase()
        .optional()
        .refine(
          (val) => !val || GSTIN_REGEX.test(val),
          { message: t('onboarding.validation.gstinInvalid', { defaultValue: 'Enter a valid 15-character GSTIN.' }) }
        ),
      identity_proof_type: z.enum(['voter_id', 'passport', 'driving_licence', 'aadhaar_masked'], {
        errorMap: () => ({ message: t('onboarding.validation.idTypeRequired', { defaultValue: 'Select an identity proof type.' }) }),
      }),
      identity_document_id: z
        .string({ required_error: t('onboarding.validation.idDocRequired', { defaultValue: 'Identity proof document upload is required.' }) })
        .min(1, { message: t('onboarding.validation.idDocRequired', { defaultValue: 'Identity proof document upload is required.' }) }),
      address_document_id: z
        .string({ required_error: t('onboarding.validation.addressDocRequired', { defaultValue: 'Address proof document upload is required.' }) })
        .min(1, { message: t('onboarding.validation.addressDocRequired', { defaultValue: 'Address proof document upload is required.' }) }),
      artisan_card_document_id: z.string().nullable().optional(),
    })
    .refine(
      (data) => {
        if (sellerType === 'registered_company') {
          return !!data.gstin && GSTIN_REGEX.test(data.gstin);
        }
        return true;
      },
      {
        message: t('onboarding.validation.gstinRequiredForCompany', { defaultValue: 'GSTIN is required for registered companies.' }),
        path: ['gstin'],
      }
    );

export const createStep4BankDetailsSchema = (t: TFunction, hasExistingMasked = false) =>
  z
    .object({
      account_holder_name: z
        .string()
        .trim()
        .min(2, { message: t('onboarding.validation.accHolderRequired', { defaultValue: 'Account holder name is required.' }) })
        .max(100),
      account_number: z.string().trim().optional(),
      confirm_account_number: z.string().trim().optional(),
      ifsc_code: z
        .string()
        .trim()
        .toUpperCase()
        .regex(IFSC_REGEX, { message: t('onboarding.validation.ifscInvalid', { defaultValue: 'Enter a valid 11-character IFSC (e.g. SBIN0001234).' }) }),
      account_type: z.enum(['savings', 'current'], {
        errorMap: () => ({ message: t('onboarding.validation.accTypeRequired', { defaultValue: 'Select an account type.' }) }),
      }),
      cheque_document_id: z
        .string({ required_error: t('onboarding.validation.chequeDocRequired', { defaultValue: 'Cancelled cheque or passbook copy is required.' }) })
        .min(1, { message: t('onboarding.validation.chequeDocRequired', { defaultValue: 'Cancelled cheque or passbook copy is required.' }) }),
    })
    .refine(
      (data) => {
        // If there's already a saved masked account number and user didn't retype a new one, it's valid
        if (hasExistingMasked && (!data.account_number || data.account_number.includes('•'))) {
          return true;
        }
        return !!data.account_number && /^\d{8,20}$/.test(data.account_number);
      },
      {
        message: t('onboarding.validation.accNumberInvalid', { defaultValue: 'Account number must be 8 to 20 numeric digits.' }),
        path: ['account_number'],
      }
    )
    .refine(
      (data) => {
        if (hasExistingMasked && (!data.account_number || data.account_number.includes('•'))) {
          return true;
        }
        return data.account_number === data.confirm_account_number;
      },
      {
        message: t('onboarding.validation.accNumberMismatch', { defaultValue: 'Account numbers do not match.' }),
        path: ['confirm_account_number'],
      }
    );

export const createStep5ReviewSchema = (t: TFunction) =>
  z.object({
    accepted_agreement: z.boolean().refine((val) => val === true, {
      message: t('onboarding.validation.agreementRequired', { defaultValue: 'You must accept the Seller Agreement before submitting.' }),
    }),
  });
