// authHandler.ts
import axios from 'axios';

const API_URL = "http://localhost:8000"; // Replace with your API URL

const AuthHandler = () => {
  const syncCookiesToLocalStorage = () => {
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
  
      if (key === 'jwt') {
        localStorage.setItem('jwt', decodeURIComponent(value.replace(/\"/g, ''))); // Remove extraneous quotes
      }
  
      if (key === 'userInfo') {
        try {
          // Decode URI component and parse JSON
          const userInfo = JSON.parse(decodeURIComponent(value.replace(/\\054/g, ',')));
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (err) {
          console.error('Failed to parse userInfo cookie', err);
        }
      }
    });
  };
  
  const register = async (email: string, password: string, passwordConfirm: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        email,
        password,
        passwordConfirm,
      });
  
      if (response.data && response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo');
    document.cookie = 'jwt=; Max-Age=0; path=/';
    document.cookie = 'userInfo=; Max-Age=0; path=/';
    window.location.href = '/'; // Redirect to login page
  };

  const isAuthenticated = () => {
    syncCookiesToLocalStorage();
    return localStorage.getItem('jwt') !== null && localStorage.getItem('userInfo') !== null;
  };

  const getAuthHeaders = () => {
    syncCookiesToLocalStorage();
    return localStorage.getItem('jwt') ? { Authorization: `Bearer ${localStorage.getItem('jwt')}` } : {};
  };

  return {
    register,
    login,
    logout,
    isAuthenticated,
    getAuthHeaders,
  };
};

export default AuthHandler;
