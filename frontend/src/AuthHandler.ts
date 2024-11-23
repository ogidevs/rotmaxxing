import axios from 'axios';
import { useEffect, useState } from 'react';

// Replace with your API URL
const API_URL = 'http://localhost:8001';

const useAuthHandler = () => {
   const [user, setUser] = useState<any>(null);
   const [token, setToken] = useState<string | null>(null);
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
      syncCookiesToLocalStorage();
      initializeAuth();
   }, []);

   // Synchronizes cookies with localStorage
   const syncCookiesToLocalStorage = () => {
      const cookies = document.cookie.split('; ');

      cookies.forEach((cookie) => {
         // Find the first occurrence of "=" to split the key and value
         const indexOfEqual = cookie.indexOf('=');
         if (indexOfEqual === -1) return; // Skip if "=" is not found in the cookie string

         const key = cookie.substring(0, indexOfEqual);
         const value = cookie.substring(indexOfEqual + 1);
         const decodedValue = decodeURIComponent(value);

         // Handle the JWT cookie
         if (key === 'jwt') {
            localStorage.setItem('jwt', decodedValue.replace(/\"/g, ''));
         }

         // Handle the userInfo cookie
         if (key === 'userInfo') {
            try {
               const cleanedValue = decodedValue.replace(/\\054/g, ',');
               const parsedValue = JSON.parse(cleanedValue);
               localStorage.setItem('userInfo', parsedValue);
               console.log('Parsed userInfo cookie:', parsedValue);
            } catch (err) {
               console.error('Failed to parse userInfo cookie:', err);
               console.error('Decoded userInfo cookie:', decodedValue); // Log the original decoded value for debugging
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
         if (response.data?.token) {
            // Update the token and userInfo if verification is successful
            setUser(response.data);
            setToken(response.data.token);
            localStorage.setItem('jwt', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return true;
         }

         return false;
      } catch (error) {
         console.error('Error during token verification:', error);
         return false;
      }
   };

   // Registers a new user
   const register = async (
      username: string,
      email: string,
      password: string,
      passwordConfirm: string
   ): Promise<{ success: boolean; error?: any }> => {
      try {
         const response = await axios.post(`${API_URL}/users/register`, {
            username,
            email,
            password,
            confirm_password: passwordConfirm,
         });

         if (response.data?.token) {
            localStorage.setItem('jwt', response.data.token);
            const isVerified = await verifyToken();
            if (isVerified) {
               return { success: true, error: null };
            }
         }
         console.error('Failed to register:', response.data);
         return { success: false, error: 'Failed to register' };
      } catch (error) {
         console.error('Registration error:', error);
         const errorMessage =
            (error as any).response?.data?.detail || 'Unknown error';
         return { success: false, error: errorMessage };
      }
   };

   // Logs in the user
   const login = async (
      email: string,
      password: string
   ): Promise<{ success: boolean; error?: any }> => {
      try {
         const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password,
         });

         if (response.data?.token) {
            localStorage.setItem('jwt', response.data.token);
            const isVerified = await verifyToken();
            if (isVerified) {
               return { success: true, error: null };
            }
         }
         console.error('Invalid credentials:', response.data);
         return { success: false, error: 'Invalid credentials' };
      } catch (error) {
         console.error('Login error:', error);
         const errorMessage =
            (error as any).response?.data?.detail || 'Unknown error';
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
      return (
         !!localStorage.getItem('jwt') && !!localStorage.getItem('userInfo')
      );
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
      user,
      token,
      isAuthenticated,
      getAuthHeaders,
   };
};

export default useAuthHandler;
