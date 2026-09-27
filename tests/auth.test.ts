import { test, expect } from '@jest/globals';
import { createAuthService } from '../src/auth/service';
import { validateLogin, validateSignup } from '../src/auth/validation';

const input = {
  name: '  Alex Chen ',
  email: ' Alex@Example.com ',
  password: 'secret',
};
test('validates required fields and password boundary', () => {
  expect(
    Object.keys(validateSignup({ name: ' ', email: '', password: '' })),
  ).toHaveLength(3);
  expect(validateLogin({ email: 'bad@', password: '12345' })).toEqual({
    email: expect.any(String),
    password: expect.any(String),
  });
  expect(validateSignup(input)).toEqual({});
});
test('signup normalizes identity, omits password, and supports subsequent login', async () => {
  const service = createAuthService();
  const user = await service.signup(input);
  expect(user).toEqual({
    id: 'alex@example.com',
    name: 'Alex Chen',
    email: 'alex@example.com',
  });
  expect(
    await service.login({ email: 'ALEX@example.com', password: 'secret' }),
  ).toEqual(user);
});
test('rejects duplicate accounts and incorrect credentials', async () => {
  const service = createAuthService();
  await service.signup(input);
  await expect(service.signup(input)).rejects.toThrow('already exists');
  await expect(
    service.login({ email: input.email, password: 'wrong!' }),
  ).rejects.toThrow('incorrect');
  await expect(
    service.login({ email: 'missing@example.com', password: 'secret' }),
  ).rejects.toThrow('incorrect');
});
test('password whitespace is preserved and service validates callers', async () => {
  const service = createAuthService();
  await service.signup({ ...input, password: ' secret ' });
  await expect(service.login(input)).rejects.toThrow('incorrect');
  await expect(service.signup({ ...input, name: '' })).rejects.toThrow('name');
});
