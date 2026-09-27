import { test, expect } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';

test('context signs up, logs out, rejects bad credentials, and logs back in', async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: AuthProvider,
  });
  const input = {
    name: 'Sam',
    email: 'context@example.com',
    password: 'secret',
  };
  expect(result.current.user).toBeNull();
  await act(async () => {
    await result.current.signup(input);
  });
  expect(result.current.user?.name).toBe('Sam');
  await act(async () => {
    await result.current.logout();
  });
  expect(result.current.user).toBeNull();
  await act(async () => {
    await expect(
      result.current.login({ ...input, password: 'wrong!' }),
    ).rejects.toThrow('incorrect');
  });
  expect(result.current.user).toBeNull();
  expect(result.current.isLoading).toBe(false);
  await act(async () => {
    await result.current.login(input);
  });
  expect(result.current.user?.email).toBe(input.email);
});
