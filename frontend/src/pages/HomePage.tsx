import React, { useState, useRef } from 'react';
import AuthHandler from '@/AuthHandler';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/custom/ProfileHeader';
import UploadFilters from '@/components/custom/UploadFilters';
import axios from 'axios';
import ASS from 'assjs';
import { Loader } from 'lucide-react';

const HomePage: React.FC = () => {
   const [filters, setFilters] = useState<any>({});
   const API_URL = 'http://localhost:8001';
   const { user, fetchMe } = AuthHandler();
   const [text, setText] = useState<string>('');
   const [folderId, setFolderId] = useState<string | null>(null);
   const [videoUrl, setVideoUrl] = useState<string | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const assRef = useRef<ASS | null>(null); // Reference to store the ASS instance

   const generatePreivew = async () => {
      setLoading(true);
      setVideoUrl(null);

      const result = await fetchVideoWithAudio();
      if (!result) {
         setLoading(false);
         return;
      }
      const [videoBlob, filename] = result;
      if (!videoBlob) {
         setLoading(false);
         return;
      }
      const videoUrl = URL.createObjectURL(videoBlob);

      setVideoUrl(videoUrl);

      const subtitles = await fetchSubtitles(filename);
      if (!subtitles) {
         setLoading(false);
         return;
      }

      const videoElement = document.querySelector('#video') as HTMLVideoElement;
      const assContainer = document.querySelector(
         '#ass-container'
      ) as HTMLElement;
      if (!videoElement || !assContainer) {
         console.error('Video element or ass-container not found');
         setLoading(false);
         return;
      }
      if (assRef.current) {
         assRef.current.destroy();
      }

      try {
         const ass = new ASS(subtitles, videoElement, {
            container: assContainer,
         });
         assRef.current = ass;
         setLoading(false);
      } catch (error) {
         console.error('Error initializing ASS:', error);
         setLoading(false);
      }

      fetchMe();
      setFolderId(filename);
   };

   const fetchVideoWithAudio = async () => {
      const response = await axios.post(
         `${API_URL}/uploads/generateAudio`,
         {
            folder_id: folderId,
            text: text,
            video_options: {
               ...filters.videoOptions,
               video_duration: 20,
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
         console.error('Failed to generate video:', response);
         setLoading(false);
         return;
      }
      const videoBlob = new Blob([response.data], {
         type: 'video/mp4',
      });
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch =
         contentDisposition && contentDisposition.match(/filename="(.+)"/);

      if (!filenameMatch || !filenameMatch[1]) {
         console.error('Failed to extract filename from response headers');
         setLoading(false);
         return;
      }

      return [videoBlob, filenameMatch[1]];
   };

   const fetchSubtitles = async (folder_id: string) => {
      const response = await axios.post(
         `${API_URL}/uploads/generateSubtitles`,
         {
            folder_id: folder_id,
            text: text,
            subtitle_options: {
               ...filters.subtitleOptions,
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
         console.error('Failed to generate subtitles:', response);
         return;
      }
      const subtitlesBlob = new Blob([response.data], {
         type: 'text/plain',
      });
      return subtitlesBlob.text();
   };

   const downloadVideo = async (): Promise<void> => {
      const response = await axios.post(
         `${API_URL}/uploads/generateDownload`,
         {
            folder_id: folderId,
            text: text,
            video_options: {
               ...filters.videoOptions,
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
         console.error('Failed to download video:', response);
         return;
      }
      const videoBlob = new Blob([response.data], {
         type: 'video/mp4',
      });
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'brain-rot.mp4';
      a.click();
   };

   return (
      <div className="bg-zinc-100 dark:bg-zinc-900 h-screen transition-colors duration-100">
         <div className="flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 flex-start">
            {user && (
               <ProfileHeader
                  email={user.email}
                  username={user.username}
                  profilePicture={user.picture}
                  credit={user.credit}
               />
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white m-6">
               Create Your Brain Rot in Couple of Seconds
            </h1>
            <textarea
               onBlur={(event) => {
                  setFolderId(null);
                  setText((event.target as HTMLTextAreaElement).value);
               }}
               aria-label="Type here..."
               placeholder="Type here..."
               className="text-white dark:text-zinc-200 w-1/2 h-32 p-2 border-2 border-rose-500 rounded-xl m-4"
            ></textarea>

            <div className="flex flex-row">
               <UploadFilters filters={filters} setFilters={setFilters} />
               <Button
                  onClick={generatePreivew}
                  className="m-4 bg-rose-500 hover:bg-rose-600 text-white"
               >
                  Generate Brain Rot
               </Button>
               <Button
                  disabled={videoUrl != null ? false : true}
                  onClick={downloadVideo}
                  className="m-4 bg-rose-500 hover:bg-rose-600 text-white"
               >
                  Download
               </Button>
            </div>
            <div
               id="player"
               className={`relative ${!videoUrl ? 'hidden' : ''}`}
            >
               <video id="video" src={videoUrl || undefined} controls></video>
               <div
                  id="ass-container"
                  style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     pointerEvents: 'none',
                  }}
               ></div>
            </div>
            {loading && <Loader className="animate-spin" />}
         </div>
      </div>
   );
};

export default HomePage;
