import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from './types';
import { normalizeEmail } from './validation';
export const SESSION_KEY = '@kin/session/v1';
export function parseSession(raw: string): User | null {
  try {
    const data = JSON.parse(raw);
    const user = data?.user;
    if (
      data?.version !== 1 ||
      !user ||
      typeof user.id !== 'string' ||
      typeof user.name !== 'string' ||
      typeof user.email !== 'string' ||
      !user.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
      user.id !== user.email ||
      normalizeEmail(user.email) !== user.email
    )
      return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch {
    return null;
  }
}
export async function restoreSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const user = parseSession(raw);
  if (!user) await AsyncStorage.removeItem(SESSION_KEY);
  return user;
}
export async function saveSession(user: User) {
  const { id, name, email } = user;
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ version: 1, user: { id, name, email } }),
  );
}
export const clearSession = () => AsyncStorage.removeItem(SESSION_KEY);
