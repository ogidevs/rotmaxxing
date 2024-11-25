import React, {
   createContext,
   useContext,
   useState,
   ReactNode,
   useEffect,
} from 'react';

// Define available themes
type Theme = 'light' | 'dark';

// Define the context shape
interface ThemeContextProps {
   theme: Theme;
   toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
   children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
   const [theme, setTheme] = useState<Theme>('light');

   useEffect(() => {
      // Get the saved theme from local storage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
         setTheme(savedTheme as Theme);
      }
   }, []);

   const toggleTheme = () => {
      localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {/* Add the theme class to the root */}
         <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
      </ThemeContext.Provider>
   );
};

// Custom hook for accessing theme
export const useTheme = (): ThemeContextProps => {
   const context = useContext(ThemeContext);
   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }
   return context;
};
