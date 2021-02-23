import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

let location = window.location;

afterEach(() => {
  window.location = location;
});

test('renders greeting', async () => {
  render(<LoginPage />);
  await waitFor(() => screen.getByText(/歡迎登入 DevPtt～/i));
  expect(screen.getByText(/歡迎登入 DevPtt～/i)).toBeInTheDocument();
});

test('invokes login API', async () => {
  render(<LoginPage />);
  await waitFor(() => screen.getByRole('button', { name: '我要登入' }));
  userEvent.type(screen.getByPlaceholderText('Username:'), 'Foo');
  userEvent.type(screen.getByPlaceholderText('Password:'), 'Bar');
  userEvent.click(screen.getByRole('button', { name: '我要登入' }));
  await waitFor(() => screen.getByText('您是忘記密碼了, 還是害怕想起來？～'));
});

test('redirects to register page', async () => {
  Object.defineProperty(window, 'location', {
    value: { href: '' },
    configurable: true,
    enumerable: true,
    writable: true,
  });
  render(<LoginPage />);
  await waitFor(() => screen.getByRole('button', { name: '我想註冊' }));
  userEvent.click(screen.getByRole('button', { name: '我想註冊' }));
  expect(window.location.href).toBe('/register');
});

test('redirects to forget password page', async () => {
  Object.defineProperty(window, 'location', {
    value: { href: '' },
    configurable: true,
    enumerable: true,
    writable: true,
  });
  render(<LoginPage />);
  await waitFor(() => screen.getByRole('button', { name: '我忘記密碼了 Orz' }));
  userEvent.click(screen.getByRole('button', { name: '我忘記密碼了 Orz' }));
  expect(window.location.href).toBe('/forgetPassword');
});
