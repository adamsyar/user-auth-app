import { expect, jest, test } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react-native';
import App from '../App';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import {
  parseSession,
  restoreSession,
  saveSession,
  SESSION_KEY,
} from '../src/auth/session';
const user = {
  id: 'saved@example.com',
  name: 'Saved User',
  email: 'saved@example.com',
};

test('stores only profile fields and restores a versioned session', async () => {
  await saveSession({ ...user, password: 'must not persist' } as typeof user);
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  expect(stored).not.toContain('password');
  expect(await restoreSession()).toEqual(user);
});
test.each([
  'broken json',
  'null',
  '{}',
  JSON.stringify({ version: 1, user: { ...user, email: 'invalid' } }),
])('discards malformed session: %s', async (raw) => {
  await AsyncStorage.setItem(SESSION_KEY, raw);
  expect(await restoreSession()).toBeNull();
  expect(await AsyncStorage.getItem(SESSION_KEY)).toBeNull();
});
test('strips unexpected properties from a restored profile', () => {
  expect(
    parseSession(
      JSON.stringify({ version: 1, user: { ...user, password: 'ignored' } }),
    ),
  ).toEqual(user);
});
test('cold start opens Home; logout clears session and subsequent start shows Login', async () => {
  await saveSession(user);
  const app = await render(<App />);
  expect(await screen.findByText('You’re home.')).toBeTruthy();
  expect(screen.queryByText('Welcome back.')).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Logout' }));
  expect(await screen.findByText('Welcome back.')).toBeTruthy();
  expect(await AsyncStorage.getItem(SESSION_KEY)).toBeNull();
  await app.unmount();
  await render(<App />);
  expect(await screen.findByText('Welcome back.')).toBeTruthy();
});
test('storage read failure recovers to signed-out state', async () => {
  jest
    .mocked(AsyncStorage.getItem)
    .mockRejectedValueOnce(new Error('unavailable'));
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  await waitFor(() => expect(result.current.isRestoring).toBe(false));
  expect(result.current.user).toBeNull();
  expect(result.current.storageWarning).toContain('could not be restored');
});
test('failed session save allows signup; failed logout is retryable', async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  await waitFor(() => expect(result.current.isRestoring).toBe(false));
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('disk full'));
  await act(async () => {
    await result.current.signup({
      name: 'Disk',
      email: 'disk@example.com',
      password: 'secret',
    });
  });
  expect(result.current.user?.name).toBe('Disk');
  expect(result.current.storageWarning).toContain('could not be saved');
  jest
    .mocked(AsyncStorage.removeItem)
    .mockRejectedValueOnce(new Error('unavailable'));
  await act(async () => {
    await expect(result.current.logout()).rejects.toThrow('unavailable');
  });
  expect(result.current.user?.name).toBe('Disk');
  expect(result.current.isLoading).toBe(false);
  await act(async () => {
    await result.current.logout();
  });
  expect(result.current.user).toBeNull();
});
test('password visibility can be toggled on Login and Signup', async () => {
  await render(<App />);
  await screen.findByText('Welcome back.');
  await fireEvent.changeText(screen.getByLabelText('Password'), 'retained123');
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText('Password').props.value).toBe('retained123');
  await fireEvent.press(screen.getByRole('button', { name: 'Hide password' }));
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  await fireEvent.press(screen.getByRole('button', { name: 'Go to Signup' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
});
