import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import type { UserType } from '@/types/UserType';

// Replace with your API URL
const API_URL = 'http://localhost:8001';

const useAuthHandler = () => {
   const [user, setUser] = useState<UserType | null>(null);
   const [authed, setAuthed] = useState<boolean | null>(null);
   const isInitialized = useRef(false);
   const isVerifying = useRef(false);
   const isRefreshing = useRef(false);
   const isLoggingOut = useRef(false);

   axios.interceptors.response.use(
      (response) => response,
      async (error) => {
         if (error.response?.status === 403) {
            if (isLoggingOut.current) return false;
            const refreshed = await refreshAccessToken();
            if (!refreshed) logout();
            window.location.href = '/';
         }
         return Promise.reject(error);
      }
   );

   useEffect(() => {
      if (isInitialized.current) return;
      const initializeAuth = async () => {
         if (!hasAuthCookie()) {
            setAuthed(false);
            return;
         }
         isInitialized.current = true;

         await verifyToken();
      };

      initializeAuth();
   }, []);

   const refreshAccessToken = async (): Promise<boolean> => {
      if (isRefreshing.current) return false;
      isRefreshing.current = true;

      try {
         const response = await axios.post(
            `${API_URL}/users/refresh`,
            {},
            { withCredentials: true }
         );
         if (response.data.status === 'success' && response.status === 201) {
            console.log('New token received');
            return true;
         }
         console.error('No new token received during refresh');
         return false;
      } catch (error) {
         console.error('Failed to refresh access token:', error);
         return false;
      } finally {
         isRefreshing.current = false; // Reset flag
      }
   };

   const verifyToken = async (): Promise<boolean> => {
      if (isVerifying.current) return false; // Prevent multiple simultaneous verify calls
      isVerifying.current = true;

      try {
         const response = await axios.get(`${API_URL}/users/verify`, {
            withCredentials: true,
         });

         if (response.data) {
            setUser(response.data);
            setAuthed(true);
            return true;
         }
         return false;
      } catch (error) {
         console.error('Error during token verification:', error);
         return false;
      } finally {
         isVerifying.current = false; // Reset flag
      }
   };

   const fetchMe = async () => {
      try {
         const response = await axios.get(`${API_URL}/users/me`, {
            withCredentials: true,
         });
         setUser(response.data);
      } catch (error) {
         console.error('Failed to fetch user data:', error);
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
         const response = await axios.post(
            `${API_URL}/users/register`,
            {
               username,
               email,
               password,
               confirm_password: passwordConfirm,
            },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
               withCredentials: true,
            }
         );

         const isVerified = await verifyToken();
         if (isVerified) {
            return { success: true, error: null };
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
         const response = await axios.post(
            `${API_URL}/users/login`,
            {
               email,
               password,
            },
            {
               headers: {
                  'Content-Type': 'application/json',
               },
               withCredentials: true,
            }
         );

         const isVerified = await verifyToken();
         if (isVerified) {
            return { success: true, error: null };
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

   const logout = async () => {
      isLoggingOut.current = true;
      try {
         axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
         window.location.href = '/';
         return;
      } catch (error) {
         console.error('Failed to logout:', error);
      }
   };

   const hasAuthCookie = () => {
      return document.cookie.includes('jwt');
   };

   return {
      logout,
      login,
      register,
      fetchMe,
      user,
      authed,
   };
};

export default useAuthHandler;
