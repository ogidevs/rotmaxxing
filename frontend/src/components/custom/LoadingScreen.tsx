import React from 'react';
import { Loader } from 'lucide-react';
import LightLogo from '@/components/ui/logo_images/light_theme_logo.png';
import DarkLogo from '@/components/ui/logo_images/dark_theme_logo.png';

const LoadingScreen: React.FC = () => {
   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <div className="flex flex-col items-center">
            <Loader className="animate-spin text-rose-500 w-12 h-12" />
            <picture className="flex items-center justify-center h-full">
               {/* Light theme image */}
               <source
                  srcSet={LightLogo}
                  media="(prefers-color-scheme: light)"
               />
               {/* Dark theme image */}
               <source
                  srcSet={DarkLogo}
                  media="(prefers-color-scheme: dark)"
                  width="200"
                  height="200"
               />
               {/* Fallback for unsupported browsers */}
               <img
                  src={LightLogo}
                  alt="Themed Image"
                  className="rounded-xl"
                  width="200"
                  height="200"
               />
            </picture>
         </div>
      </div>
   );
};

export default LoadingScreen;
