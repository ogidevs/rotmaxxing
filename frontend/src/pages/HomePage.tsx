import React, { useState } from 'react';
import AuthHandler from '@/AuthHandler'; // Import AuthHandler for authentication logic
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/custom/ProfileHeader';
import UploadFilters from '@/components/custom/UploadFilters';
import axios from 'axios';

const HomePage: React.FC = () => {
   const [filters, setFilters] = useState<any>({});
   const API_URL = 'http://localhost:8001';
   const { user, verifyToken } = AuthHandler(); // Get the logout function from AuthHandler
   const [text, setText] = useState<string>('');
   const [videoUrl, setVideoUrl] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(false);

   const handleClick = async () => {
      setLoading(true);
      const response = await axios.post(
         `${API_URL}/uploads/generateBrainRot`,
         {
            text: text,
            title: 'Your Title',
            subtitle_options: {
               ...filters.subtitleOptions,
            },
            video_options: {
               ...filters.videoOptions,
            },
            audio_options: {
               ...filters.audioOptions,
            },
         },
         {
            headers: {
               'Content-Type': 'application/json',
            },
            responseType: 'blob',
            withCredentials: true,
         }
      );
      if (response.status !== 200) {
         console.error('Failed to generate brain rot:', response);
         setLoading(false);
         return;
      }
      verifyToken();
      const blob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      setVideoUrl(videoUrl);
      setLoading(false);
   };

   return (
      <>
         {user && (
            <ProfileHeader
               email={user.email}
               username={user.username}
               profilePicture={user.picture}
               credit={user.credit}
            />
         )}
         <div className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-zinc-900 min-h-screen transition-colors duration-100">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
               Create Your Brain Rot in Couple of Seconds
            </h1>
            <UploadFilters filters={filters} setFilters={setFilters} />
            <textarea
               onBlur={(event) =>
                  setText((event.target as HTMLTextAreaElement).value)
               }
               placeholder="Type here..."
               className="w-1/2 h-40 p-4 m-4 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800 dark:border-gray-700"
            ></textarea>
            {videoUrl && (
               <iframe
                  src={videoUrl}
                  width="560"
                  height="315"
                  allowFullScreen
                  className="my-4 border-2 border-rose-500 rounded-lg"
               ></iframe>
            )}
            <Button
               onClick={handleClick}
               className="m-4 bg-rose-500 hover:bg-rose-600 text-white"
               disabled={loading}
            >
               Generate Brain Rot
            </Button>
            {loading && <p className="text-rose-500">Loading...</p>}
         </div>
      </>
   );
};

export default HomePage;
