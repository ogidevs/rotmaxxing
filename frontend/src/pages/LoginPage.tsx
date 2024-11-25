import { useState } from 'react';

import AuthHandler from '@/AuthHandler';

import { useTheme } from '@/contexts/ThemeContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LightLogo from '@/components/ui/logo_images/light_theme_logo.png';
import DarkLogo from '@/components/ui/logo_images/dark_theme_logo.png';
import { GoogleLoginButton } from '@/components/custom/GoogleLoginButton';
import ThemeToggler from '@/components/custom/ThemeToggler';
import { Eye, EyeOff } from 'lucide-react';
import { H1, Lead } from '@/components/custom/Typography';

export default function AuthPage() {
   const { theme } = useTheme();
   const API_URL = 'http://localhost:8001';
   const [isLogin, setIsLogin] = useState(true); // Track whether it's Login or Register mode
   const [email, setEmail] = useState('');
   const [username, setUsername] = useState(''); // For registration
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState(''); // For registration
   const [showPassword, setShowPassword] = useState(false); // For displaying password to a user
   const [error, setError] = useState('');
   const { login, register } = AuthHandler(); // Use login and register functions from AuthHandler

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const handleGoogleLogin = () => {
      window.location.href = `${API_URL}/users/login/google`;
   };

   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLogin) {
         const response = await login(email, password);
         if (response.success) {
            window.location.href = '/';
         } else {
            setError(response.error || 'Failed to login. Try again.');
         }
      } else {
         if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
         }
         const response = await register(
            username,
            email,
            password,
            confirmPassword
         );
         if (response.success) {
            window.location.href = '/';
         } else {
            setError(response.error || 'Failed to register. Try again.');
         }
      }
   };

   return (
      <div
         className={`flex min-h-screen transition-alltext-zinc-900 bg-zinc-50 duration-300 ${theme === 'dark' ? 'dark:bg-zinc-900 dark:text-zinc-50' : ''}`}
      >
         <div className="hidden w-1/2 bg-gradient-to-br rounded-xl from-rose-400 to-rose-500 lg:block dark:bg-gradient-to-br dark:from-rose-600 dark:to-rose-700 m-5">
            <picture className="flex items-center justify-center h-full">
               {/* Light theme image */}
               <source
                  srcSet={LightLogo}
                  media="(prefers-color-scheme: light)"
               />
               {/* Dark theme image */}
               <source srcSet={DarkLogo} media="(prefers-color-scheme: dark)" />
               {/* Fallback for unsupported browsers */}
               <img src={LightLogo} alt="Themed Image" className="rounded-xl" />
            </picture>
         </div>

         <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-md border-2 border-rose-500 rounded-xl py-12 px-8 shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] hover:shadow-[16px_16px_0px_0px_rgba(244,63,94,1)] dark:shadow-[8px_8px_0px_0px_rgba(190,18,60,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(190,18,60,1)] transition-all duration-300 bg-zinc-50 dark:bg-zinc-900">
               <H1 color={'gradient'} className="">
                  {isLogin ? 'Login to Your Account' : 'Create Account'}
               </H1>

               {/* Form */}
               <form className="space-y-6" onSubmit={handleFormSubmit}>
                  {!isLogin && (
                     <div className="space-y-2">
                        <Label
                           htmlFor="username"
                           className="text-zinc-800 dark:text-zinc-200"
                        >
                           Username
                        </Label>
                        <Input
                           id="username"
                           type="text"
                           placeholder="Enter your username"
                           className="w-full"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                        />
                     </div>
                  )}
                  <div className="space-y-2">
                     <Label
                        htmlFor="email"
                        className="text-zinc-800 dark:text-zinc-200"
                     >
                        Email
                     </Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label
                        htmlFor="password"
                        className="text-zinc-800 dark:text-zinc-200"
                     >
                        Password
                     </Label>
                     {/* <div className="relative"> */}
                     <div className="flex items-center border dark:border-zinc-700 rounded-md overflow-hidden dark:bg-zinc-800">
                        <Input
                           id="password"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Enter your password"
                           className="flex-1  border-none dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                           type="button"
                           onClick={togglePasswordVisibility}
                           className="px-4 text-zinc-500 dark:text-zinc-400 bg-transparent border-none outline-none focus:outline-none"
                        >
                           {showPassword ? (
                              <EyeOff className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                           ) : (
                              <Eye className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                           )}
                        </button>
                     </div>
                  </div>
                  {!isLogin && (
                     <div className="space-y-2">
                        <Label
                           htmlFor="confirmPassword"
                           className="text-zinc-800 dark:text-zinc-200"
                        >
                           Confirm Password
                        </Label>
                        <Input
                           id="confirmPassword"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Confirm your password"
                           className="w-full dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                     </div>
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" variant="gradient" className="w-full">
                     {isLogin ? 'Login' : 'Register'}
                  </Button>
                  <GoogleLoginButton onClick={handleGoogleLogin} />
               </form>
               <div className="flex justify-between items-center mt-8 text-center flex-col">
                  <Lead className="mb-2">
                     {isLogin
                        ? "Don't have an account?"
                        : 'Already have an account?'}
                  </Lead>
                  <Button
                     variant="outline"
                     size="icon"
                     onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                     }}
                     className="w-full dark:bg-zinc-800 dark:text-zinc-200"
                  >
                     <strong className="dark:text-zinc-50 text-zinc-900 transition-all duration-300">
                        {isLogin ? 'Register' : 'Login'}
                     </strong>
                  </Button>
               </div>
            </div>
            <div className="absolute top-4 right-4">
               <ThemeToggler />
            </div>
         </div>
      </div>
   );
}
