import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GoogleButton from 'react-google-button';
import { GoogleLoginButton } from './components/custom/GoogleLoginButton';

export default function LoginPage() {
   const [darkMode, setDarkMode] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleGoogleLogin = () => {
      window.location.href = '/users/login/google';
   };

   const toggleDarkMode = () => {
      setDarkMode(!darkMode);
   };

   return (
      <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
         <div className="hidden w-1/2 bg-gradient-to-br rounded-xl from-rose-400 to-rose-500 lg:block"></div>

         <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white dark:bg-zinc-900 transition-colors duration-300">
            <div className="w-full max-w-md">
               <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-rose-400 to-rose-500 text-transparent bg-clip-text">
                  Create Account
               </h1>

               {/* Form */}
               <form className="space-y-6">
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
                     />
                  </div>
                  <div className="space-y-2">
                     <Label
                        htmlFor="password"
                        className="text-zinc-800 dark:text-zinc-200"
                     >
                        Password
                     </Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="w-full dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label
                        htmlFor="confirm-password"
                        className="text-zinc-800 dark:text-zinc-200"
                     >
                        Confirm Password
                     </Label>
                     <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="w-full dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                     />
                  </div>
                  <Button type="submit" variant={'login'}>
                     Create Account
                  </Button>

                  <GoogleLoginButton
                     onClick={() => handleGoogleLogin()}
                     isLoading={isLoading}
                  />
                  {/* TODO Google Auth button*/}
               </form>

               <div className="flex justify-center mt-8">
                  <Button
                     variant="outline"
                     size="icon"
                     onClick={toggleDarkMode}
                     className="w-full dark:bg-zinc-800 dark:text-zinc-200"
                  >
                     {darkMode ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                     ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                     )}
                     <span className="sr-only">Toggle dark mode</span>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
