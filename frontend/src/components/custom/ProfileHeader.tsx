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

import ThemeToggler from '@/components/custom/ThemeToggler';

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
      <div className="w-full bg-white p-4 shadow-md transition-colors duration-100 bg-transparent dark:bg-zinc-900">
         <div className="flex items-center justify-between">
            <DropdownMenu>
               <DropdownMenuTrigger className="cursor-pointer border-none outline-none focus:outline-none bg-transparent">
                  <Avatar>
                     <AvatarImage
                        src={profilePicture}
                        className="bg-gray-200 dark:bg-gray-800"
                     />
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
                  <DropdownMenuItem>Credit: {credit}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                     Logout
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggler />
         </div>
      </div>
   );
};

export default ProfileHeader;
