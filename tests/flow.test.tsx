import { test, expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../App';

test('signup validation, registration, logout, rejected login, and successful login', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByRole('button', { name: 'Go to Signup' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Signup' }));
  expect(screen.getByText('Enter your name.')).toBeTruthy();
  expect(screen.getByText('Enter your email address.')).toBeTruthy();
  expect(screen.getByText('Enter your password.')).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText('Name'), 'Taylor Lee');
  await fireEvent.changeText(
    screen.getByLabelText('Email'),
    'taylor@example.com',
  );
  await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
  await fireEvent.press(screen.getByRole('button', { name: 'Signup' }));
  expect(await screen.findByText('You’re home.')).toBeTruthy();
  expect(screen.getByText('taylor@example.com')).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Signup' })).toBeNull();
  await fireEvent.press(screen.getByRole('button', { name: 'Logout' }));
  expect(await screen.findByText('Welcome back.')).toBeTruthy();
  expect(screen.queryByText('You’re home.')).toBeNull();
  await fireEvent.changeText(
    screen.getByLabelText('Email'),
    'taylor@example.com',
  );
  await fireEvent.changeText(screen.getByLabelText('Password'), 'wrong!');
  await fireEvent.press(screen.getByRole('button', { name: 'Login' }));
  expect(
    await screen.findByText(
      'Email or password is incorrect. Please try again.',
    ),
  ).toBeTruthy();
  await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
  await fireEvent.press(screen.getByRole('button', { name: 'Login' }));
  expect(await screen.findByText('You’re home.')).toBeTruthy();
});
