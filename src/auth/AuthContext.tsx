import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { clearSession, restoreSession, saveSession } from './session';
import { authService } from './service';
import type { LoginInput, SignupInput, User } from './types';

type AuthValue = {
  user: User | null;
  isLoading: boolean;
  isRestoring: boolean;
  storageWarning: string;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthValue | undefined>(undefined);
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [storageWarning, setStorageWarning] = useState('');
  const pending = useRef(false);
  useEffect(() => {
    let active = true;
    restoreSession()
      .then((restored) => {
        if (active) setUser(restored);
      })
      .catch(() => {
        if (active)
          setStorageWarning(
            'Your saved session could not be restored. Please log in again.',
          );
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function authenticate(action: () => Promise<User>) {
    if (pending.current || isRestoring) return;
    pending.current = true;
    setIsLoading(true);
    try {
      const nextUser = await action();
      setStorageWarning('');
      try {
        await saveSession(nextUser);
      } catch {
        setStorageWarning(
          'You’re signed in, but your session could not be saved on this device.',
        );
      }
      setUser(nextUser);
    } finally {
      pending.current = false;
      setIsLoading(false);
    }
  }
  async function logout() {
    if (pending.current || isRestoring) return;
    pending.current = true;
    setIsLoading(true);
    try {
      await clearSession();
      setUser(null);
      setStorageWarning('');
    } finally {
      pending.current = false;
      setIsLoading(false);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isRestoring,
        storageWarning,
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
