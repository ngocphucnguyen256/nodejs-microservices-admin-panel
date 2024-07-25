import { expect, test, describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import App from '../App'


describe('App Component', () => {
  const mockStore = configureStore();
  let store;
  store = mockStore({
    auth: {
      user: {
        token: 'test-token'
      },
      notification: {
        notifications: []
      }
    }
  })
  it('should render the home page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    // await waitFor(() => expect(screen.getByTestId('content')).toBeInTheDocument());
  });

});

import * as utils from '../utils/index'


test('test utils', async () => {
  const API_URL = import.meta.env.VITE_API_URL
  expect(utils.concatApiUrl('test')).toBe(`${API_URL}test`)
})


import  axiosInstance  from '@/api/axios'

describe('Axios setup', () => {
  it('should set up axios with default config', () => {
    const instance = axiosInstance;
    expect(instance.defaults.baseURL).toBe(utils.concatApiUrl());
  });

  it('should handle request errors', async () => {
    axiosInstance.get = vi.fn().mockRejectedValue(new Error('Network Error'));
    await expect(axiosInstance.get('/test')).rejects.toThrow('Network Error');
  });

  // Add more tests to cover lines 12-18, 20-21, 25-30
});