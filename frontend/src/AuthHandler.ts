import axios from 'axios';
import { useEffect } from 'react';

// Replace with your API URL
const API_URL = "http://localhost:8001";

const useAuthHandler = () => {
  // Effect to verify token and sync cookies when the component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        const isVerified = await verifyToken();
        if (!isVerified) {
          console.warn('Token verification failed. Logging out...');
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  // Synchronizes cookies with localStorage
  const syncCookiesToLocalStorage = () => {
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      const decodedValue = decodeURIComponent(value);

      if (key === 'jwt') {
        localStorage.setItem('jwt', decodedValue.replace(/\"/g, ''));
      }

      if (key === 'userInfo') {
        try {
          const userInfo = JSON.parse(decodedValue.replace(/\\054/g, ',')); // Handle escaped commas
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (err) {
          console.error('Failed to parse userInfo cookie:', err);
        }
      }
    });
  };

  // Verifies the token with the server
  const verifyToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return false;

      const response = await axios.get(`${API_URL}/users/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Token verification response:', response.data);
      if (response.data?.token) {
        // Update the token and userInfo if verification is successful
        localStorage.setItem('jwt', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during token verification:', error);
      return false;
    }
  };

  // Registers a new user
  const register = async (username: string, email: string, password: string, passwordConfirm: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
        "confirm_password": passwordConfirm,
      });

      if (response.data?.token) {
        localStorage.setItem('jwt', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return { success: true, error: null };
      }
      console.error('Failed to register:', response.data);
      return { success: false, error: 'Failed to register' };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = (error as any).response?.data?.detail || 'Unknown error';
      return { success: false, error: errorMessage };
    }
  };

  // Logs in the user
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem('jwt', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return { success: true, error: null };
      }
      console.error('Invalid credentials:', response.data);
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = (error as any).response?.data?.detail || 'Unknown error';
      return { success: false, error: errorMessage };
    }
  };

  // Logs out the user
  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
    document.cookie = 'jwt=; Max-Age=0; path=/';
    document.cookie = 'userInfo=; Max-Age=0; path=/';
    window.location.href = '/'; // Redirect to the login page
  };

  // Checks if the user is authenticated
  const isAuthenticated = (): boolean => {
    syncCookiesToLocalStorage();
    return !!localStorage.getItem('jwt') && !!localStorage.getItem('userInfo');
  };

  // Provides authorization headers for API requests
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    register,
    login,
    logout,
    isAuthenticated,
    getAuthHeaders,
  };
};

export default useAuthHandler;
