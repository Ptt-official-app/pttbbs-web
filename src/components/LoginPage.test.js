import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import * as api from '../reducers/api';

let location = window.location;

jest.mock('../reducers/api');

beforeEach(() => {
  api.default.mockImplementation(() => {
    return Promise.resolve({
      status: 401,
    });
  });
});

afterEach(() => {
  window.location = location;
});

test('renders greeting', async () => {
  render(<LoginPage />);
  await waitFor(() => screen.getByText(/歡迎登入 DevPtt～/i));
  expect(screen.getByText(/歡迎登入 DevPtt～/i)).toBeInTheDocument();
  expect(api.default).toHaveBeenCalledWith({
    endpoint: '/api/userid',
    method: 'get',
  });
});

test('invokes login API', async () => {
  render(<LoginPage />);
  await waitFor(() => screen.getByRole('button', { name: '我要登入' }));

  userEvent.type(screen.getByPlaceholderText('Username:'), 'Foo');
  userEvent.type(screen.getByPlaceholderText('Password:'), 'Bar');
  userEvent.click(screen.getByRole('button', { name: '我要登入' }));

  await waitFor(() => screen.getByText('您是忘記密碼了, 還是害怕想起來？～'));

  expect(api.default).toHaveBeenCalledWith({
    endpoint: '/api/account/login',
    json: {
      client_id: 'test_client_id',
      client_secret: 'test_client_secret',
      password: 'Bar',
      username: 'Foo',
    },
    method: 'post',
  });
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
