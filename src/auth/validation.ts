import type { FieldErrors, LoginInput, SignupInput } from './types';

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export function validateLogin({ email, password }: LoginInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  else if (password.length < 6) errors.password = 'Use at least 6 characters.';
  return errors;
}
export function validateSignup(input: SignupInput): FieldErrors {
  const errors = validateLogin(input);
  if (!input.name.trim()) errors.name = 'Enter your name.';
  return errors;
}
