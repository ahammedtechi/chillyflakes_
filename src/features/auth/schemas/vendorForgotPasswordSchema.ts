import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createPasswordResetRequestSchema = (t: TFunction) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, { message: t('login.identifierRequired') })
      .superRefine((val, ctx) => {
        const clean = val.trim();
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

        const digitsOnly = clean.replace(/[\s+-]/g, '');
        const mobileMatch = digitsOnly.match(/^(?:91)?([6-9]\d{9})$/);
        if (!mobileMatch) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('login.identifierInvalid'),
          });
        }
      }),
  });

export type PasswordResetRequestFormData = {
  identifier: string;
};

export const createPasswordResetConfirmSchema = (t: TFunction) =>
  z
    .object({
      new_password: z
        .string()
        .min(1, { message: t('validation.passwordRequired') })
        .min(8, { message: t('validation.passwordRules') })
        .regex(/[A-Z]/, { message: t('validation.passwordRules') })
        .regex(/[a-z]/, { message: t('validation.passwordRules') })
        .regex(/[0-9]/, { message: t('validation.passwordRules') })
        .regex(/[^A-Za-z0-9]/, { message: t('validation.passwordRules') }),
      confirm_password: z
        .string()
        .min(1, { message: t('validation.confirmPasswordRequired') }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('validation.passwordsMatch'),
      path: ['confirm_password'],
    });

export type PasswordResetConfirmFormData = {
  new_password: string;
  confirm_password: string;
};
