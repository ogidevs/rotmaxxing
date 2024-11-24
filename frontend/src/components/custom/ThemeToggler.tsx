import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggler() {
   const { theme, toggleTheme } = useTheme();

   return (
      <div>
         <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-300 ease-in-out bg-rose-200 hover:bg-rose-400 outline-none focus:outline-none border-none"
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
