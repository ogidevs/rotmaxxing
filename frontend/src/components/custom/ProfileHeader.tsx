import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import 'tailwindcss/tailwind.css';

interface ProfileHeaderProps {
   email: string;
   username: string;
   profilePicture: string;
   credits: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
   email,
   username,
   profilePicture,
   credits,
}) => {
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
            <p className="text-gray-600">Credits: {credits}</p>
         </div>
      </div>
   );
};

export default ProfileHeader;
