import { z } from 'zod';
import type { TFunction } from 'i18next';
import { ALLOWED_CATEGORY_IDS, type CategoryId } from '../../../types/auth';

export const createVendorRegisterSchema = (t: TFunction) =>
  z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, { message: t('validation.nameRequired') }),
      email: z
        .string()
        .trim()
        .min(1, { message: t('validation.emailRequired') })
        .email({ message: t('validation.emailInvalid') }),
      mobile: z
        .string()
        .trim()
        .min(1, { message: t('validation.mobileRequired') })
        .regex(/^[6-9]\d{9}$/, { message: t('validation.mobileInvalid') }),
      businessName: z
        .string()
        .trim()
        .optional(),
      categories: z
        .array(z.enum(ALLOWED_CATEGORY_IDS))
        .min(1, { message: t('validation.categoryRequired') }),
      wholesaleEnabled: z.boolean(),
      state: z
        .string()
        .trim()
        .min(1, { message: t('validation.stateRequired') }),
      city: z
        .string()
        .trim()
        .min(1, { message: t('validation.cityRequired') }),
      password: z
        .string()
        .min(1, { message: t('validation.passwordRequired') })
        .min(8, { message: t('validation.passwordRules') })
        .regex(/[A-Z]/, { message: t('validation.passwordRules') })
        .regex(/[a-z]/, { message: t('validation.passwordRules') })
        .regex(/[0-9]/, { message: t('validation.passwordRules') })
        .regex(/[^A-Za-z0-9]/, { message: t('validation.passwordRules') }),
      confirmPassword: z
        .string()
        .min(1, { message: t('validation.confirmPasswordRequired') }),
      agreeTerms: z.boolean().refine((val) => val === true, {
        message: t('validation.termsRequired'),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsMatch'),
      path: ['confirmPassword'],
    });

export type VendorRegisterFormData = {
  fullName: string;
  email: string;
  mobile: string;
  businessName?: string;
  categories: CategoryId[];
  wholesaleEnabled: boolean;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};
