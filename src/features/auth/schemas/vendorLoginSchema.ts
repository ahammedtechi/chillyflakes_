import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createVendorLoginSchema = (t: TFunction) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, { message: t('login.identifierRequired') })
      .superRefine((val, ctx) => {
        const clean = val.trim();
        // If it contains '@', validate as email
        if (clean.includes('@')) {
          const emailResult = z.string().email().safeParse(clean);
          if (!emailResult.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('validation.emailInvalid'),
            });
          }
          return;
        }

        // Otherwise if digits or looks like phone number
        const digitsOnly = clean.replace(/[\s+-]/g, '');
        // Check for 10-digit Indian phone (starting with 6-9) or +91 prefix
        const mobileMatch = digitsOnly.match(/^(?:91)?([6-9]\d{9})$/);
        if (!mobileMatch) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('login.identifierInvalid'),
          });
        }
      }),
    password: z
      .string()
      .min(1, { message: t('validation.passwordRequired') }),
  });

export type VendorLoginFormData = {
  identifier: string;
  password: string;
};
