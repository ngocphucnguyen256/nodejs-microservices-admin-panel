import axios from 'axios';
import { concatApiUrl } from '../utils/index';
import { logout } from '@/store/actions/authActions';

const instance = axios.create({
  baseURL: concatApiUrl(),
});

instance.interceptors.request.use(
    config => {
        // Add auth token to headers or other configurations
        const state = localStorage.getItem('state');
        const token = state ? JSON.parse(state).auth.user?.token : null;
        if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
    );

    instance.interceptors.response.use(response => response, error => {
      if (error.response?.status === 401 || error.response?.status === 403 ) { // or check for token presence before sending the request
        // Redirect to login or handle token refresh logic
        window.location.href = '/auth/signin';
      }
      return Promise.reject(error);
});
  



export default instance;