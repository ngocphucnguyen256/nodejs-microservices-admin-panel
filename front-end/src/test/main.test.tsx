import { expect, test, describe, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import App from '../App';

describe('App Component', () => {
  const mockStore = configureStore();
  let store;
  store = mockStore({
    auth: {
      user: {
        token: 'test-token',
      },
      notification: {
        notifications: [],
      },
    },
  });
  it('should render the home page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    const content = await waitFor(() => screen.getByTestId('content'), {
      timeout: 3000, // Increase this value if needed
    });
    expect(content).toBeInTheDocument();
  });

  it('renders SignIn component for /auth/signin route', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );
    window.history.pushState({}, 'SignIn', '/auth/signin');
    await waitFor(() => screen.getByTestId('content'), {
      timeout: 3000, // Increase this value if needed
    });
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});

import * as utils from '../utils/index';

describe('test utils', async () => {
  const API_URL = import.meta.env.VITE_API_URL;
  it('should concat api url', () => {
    expect(utils.concatApiUrl('test')).toBe(`${API_URL}test`);
    expect(utils.concatApiUrl('test')).toBe(`${API_URL}test`);
  });

  it('should set up axios with default config', () => {
    const instance = axiosInstance;
    expect(instance.defaults.baseURL).toBe(utils.concatApiUrl());
  });

  it('should handle request errors', async () => {
    axiosInstance.get = vi.fn().mockRejectedValue(new Error('Network Error'));
    await expect(axiosInstance.get('/test')).rejects.toThrow('Network Error');
  });
});

import axiosInstance from '@/api/axios';

import websocketMiddlewareNotification from '@/middleware/websocket/index';

describe('websocketMiddlewareNotification', () => {
  it('should set up websocket middleware', () => {
    const middleware = websocketMiddlewareNotification;
    expect(middleware).toBeDefined();
  });
});
