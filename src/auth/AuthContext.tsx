import {
  createContext,
  useContext,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { authService } from './service';
import type { LoginInput, SignupInput, User } from './types';

type AuthValue = {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pending = useRef(false);
  async function authenticate(action: () => Promise<User>) {
    if (pending.current) return;
    pending.current = true;
    setIsLoading(true);
    try {
      setUser(await action());
    } finally {
      pending.current = false;
      setIsLoading(false);
    }
  }
  async function logout() {
    if (pending.current) return;
    setUser(null);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: (input) => authenticate(() => authService.login(input)),
        signup: (input) => authenticate(() => authService.signup(input)),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
