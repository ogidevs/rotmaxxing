import React from 'react';
import AuthHandler from '@/AuthHandler';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import LightLogo from '@/components/ui/logo_images/light_theme_logo.png';
import DarkLogo from '@/components/ui/logo_images/dark_theme_logo.png';

import ThemeToggler from '@/components/custom/ThemeToggler';
import { Button } from '../ui/button';

interface ProfileHeaderProps {
   email: string;
   username: string;
   profilePicture: string;
   credit: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
   email,
   username,
   profilePicture,
   credit,
}) => {
   const { logout } = AuthHandler();
   return (
      <div className="w-full bg-white p-4 shadow-md transition-colors duration-100 bg-zinc-100 dark:bg-transparent">
         <div className="flex items-center justify-between">
            <Dialog>
               <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer border-none outline-none focus:outline-none bg-transparent p-0 m-0 hover:opacity-80">
                     <Avatar>
                        <AvatarImage src={profilePicture} />
                        <AvatarFallback>
                           <img
                              src={`https://ui-avatars.com/api/?name=${username}`}
                              alt="User PFP"
                           />
                        </AvatarFallback>
                     </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem disabled>{username}</DropdownMenuItem>
                     <DropdownMenuItem disabled>{email}</DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <DialogTrigger asChild className="cursor-pointer">
                           <span>Credit: {credit} (Refill)</span>
                        </DialogTrigger>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={logout}
                     >
                        Logout
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Refill credits</DialogTitle>
                     <DialogDescription>
                        <span className="flex flex-col space-y-4">
                           <span>Select the amount of credits to refill:</span>
                           <span className="flex flex-col space-y-2">
                              <Button variant="outline">
                                 100 credits ($10)
                              </Button>
                              <Button
                                 variant="outline"
                                 className="highlight bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white"
                              >
                                 500 credits ($50) - Best Buy
                              </Button>
                              <Button variant="outline">
                                 1000 credits ($100)
                              </Button>
                           </span>
                           <span className="mx-auto">
                              Note: 5 credits are equivalent to 1 query. 1$ = 10
                              credits.
                           </span>
                        </span>
                     </DialogDescription>
                  </DialogHeader>
               </DialogContent>
            </Dialog>

            <picture className="">
               {/* Light theme image */}
               <source
                  srcSet={LightLogo}
                  media="(prefers-color-scheme: light)"
                  width="200"
                  height="200"
               />
               {/* Dark theme image */}
               <source
                  srcSet={DarkLogo}
                  media="(prefers-color-scheme: dark)"
                  width="200"
                  height="200"
               ></source>
               {/* Fallback for unsupported browsers */}
               <img src={LightLogo} alt="Themed Image" className="rounded-xl" />
            </picture>
            <ThemeToggler />
         </div>
      </div>
   );
};

export default ProfileHeader;
