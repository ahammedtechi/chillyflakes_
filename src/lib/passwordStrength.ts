export interface PasswordCriteria {
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordAnalysis {
  criteria: PasswordCriteria;
  score: number; // 0 to 5
  level: PasswordStrengthLevel;
  percent: number; // 0 to 100
}

export function evaluatePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      criteria: {
        hasMinLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
      },
      score: 0,
      level: 'empty',
      percent: 0,
    };
  }

  const criteria: PasswordCriteria = {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;

  let level: PasswordStrengthLevel = 'weak';
  if (score <= 2) {
    level = 'weak';
  } else if (score === 3) {
    level = 'fair';
  } else if (score === 4) {
    level = 'good';
  } else if (score === 5) {
    level = 'strong';
  }

  const percent = Math.min(100, Math.round((score / 5) * 100));

  return {
    criteria,
    score,
    level,
    percent,
  };
}
