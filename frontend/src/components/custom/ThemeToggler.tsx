import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggler() {
   const { theme, toggleTheme } = useTheme();

   return (
      <div>
         <button
            onClick={toggleTheme}
            className="p-2 text-zinc-50 rounded-full transition-colors duration-300 ease-in-out 
  bg-gradient-to-r from-rose-400 to-rose-500
  hover:from-rose-500 hover:to-rose-600 
  dark:from-rose-600 dark:to-rose-700 
  dark:hover:from-rose-700 dark:hover:to-rose-800 
  outline-none focus:outline-none border-none"
         >
            {theme === 'dark' ? (
               <Sun className="w-6 h-6" />
            ) : (
               <Moon className="w-6 h-6" />
            )}
         </button>
      </div>
   );
}
