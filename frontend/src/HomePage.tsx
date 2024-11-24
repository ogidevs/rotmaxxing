import React, { useState } from 'react';
import AuthHandler from './AuthHandler'; // Import AuthHandler for authentication logic
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/custom/ProfileHeader';
import axios from 'axios';

const HomePage: React.FC = () => {
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
               color: 'white',
               duration: 1,
               font: 'Montserrat-VariableFont.ttf',
               font_size: 40,
               horizontal_align: 'center',
               interline: 2,
               method: 'caption',
               stroke_color: 'black',
               stroke_width: 5,
               text_align: 'center',
               transparent: true,
               vertical_align: 'center',
            },
            video_options: {
               audio_fadein: 3,
               audio_fadeout: 3,
               subtitles_position: 'center',
               video_fadein: 3,
               video_fadeout: 3,
            },
            audio_options: {
               voice: 'alloy',
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
      <div className="flex flex-col items-center justify-center h-screen text-center">
         {user && (
            <ProfileHeader
               email={user.email}
               username={user.username}
               profilePicture={user.picture}
               credit={user.credit}
            />
         )}
         <h1>Create Your Brain Rot in Couple of Seconds</h1>
         <textarea
            onBlur={(event) =>
               setText((event.target as HTMLTextAreaElement).value)
            }
            placeholder="Type here..."
            className="w-1/2 h-1/2 p-4 m-4 border border-gray-300 rounded-lg text-white bg-gray-800"
         ></textarea>
         {videoUrl && (
            <iframe
               src={videoUrl}
               width="560"
               height="315"
               allowFullScreen
            ></iframe>
         )}
         <Button onClick={handleClick} className="m-4" disabled={loading}>
            Generate Brain Rot
         </Button>
         {loading && <p>Loading...</p>}
      </div>
   );
};

export default HomePage;
