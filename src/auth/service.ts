import type { LoginInput, SignupInput, User } from './types';
import { normalizeEmail, validateLogin, validateSignup } from './validation';

// Assessment mock only: accounts live in memory and reset on a full reload.
export function createAuthService() {
  const accounts = new Map<string, { user: User; password: string }>();
  return {
    async signup(input: SignupInput): Promise<User> {
      const error = Object.values(validateSignup(input))[0];
      if (error) throw new Error(error);
      const email = normalizeEmail(input.email);
      if (accounts.has(email))
        throw new Error(
          'An account with this email already exists. Please log in.',
        );
      const user = { id: email, name: input.name.trim(), email };
      accounts.set(email, { user, password: input.password });
      return { ...user };
    },
    async login(input: LoginInput): Promise<User> {
      const error = Object.values(validateLogin(input))[0];
      if (error) throw new Error(error);
      const account = accounts.get(normalizeEmail(input.email));
      if (!account || account.password !== input.password)
        throw new Error('Email or password is incorrect. Please try again.');
      return { ...account.user };
    },
  };
}
export const authService = createAuthService();
