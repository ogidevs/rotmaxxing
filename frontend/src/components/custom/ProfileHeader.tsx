import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import 'tailwindcss/tailwind.css';
import { Button } from '../ui/button';
import AuthHandler from '../../AuthHandler';

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
      <div className="flex items-center flex-wrap justify-center md:justify-start md:space-x-4 p-4">
         <Avatar>
            <AvatarImage src={profilePicture} />
            <AvatarFallback>
               <img
                  src={`https://ui-avatars.com/api/?name=${username}`}
                  alt="User PFP"
               />
            </AvatarFallback>
         </Avatar>
         <div className="m-4">
            <h2 className="text-xl font-semibold">{username}</h2>
            <p className="text-gray-600">{email}</p>
            <p className="text-gray-600">Credit: {credit}</p>
         </div>
         <Button onClick={logout} className="m-4">
            Logout
         </Button>
      </div>
   );
};

export default ProfileHeader;
