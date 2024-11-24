import React, { useState, useRef } from 'react';
import AuthHandler from '@/AuthHandler';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/custom/ProfileHeader';
import UploadFilters from '@/components/custom/UploadFilters';
import axios from 'axios';
import ASS from 'assjs';

const HomePage: React.FC = () => {
   const [filters, setFilters] = useState<any>({});
   const API_URL = 'http://localhost:8001';
   const { user, fetchMe } = AuthHandler();
   const [text, setText] = useState<string>('');
   const [folderId, setFolderId] = useState<string | null>(null);
   const [videoUrl, setVideoUrl] = useState<string>('');
   const [loading, setLoading] = useState<boolean>(false);
   const assRef = useRef<ASS | null>(null); // Reference to store the ASS instance

   const generatePreivew = async () => {
      setLoading(true);
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
      setVideoUrl(videoUrl);
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
               onBlur={(event) => {
                  setFolderId(null);
                  setText((event.target as HTMLTextAreaElement).value);
               }}
               placeholder="Type here..."
               className="w-1/2 h-40 p-4 m-4 border border-gray-300 rounded-lg text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800 dark:border-gray-700"
            ></textarea>
            <div id="player" className="relative">
               <video id="video" src={videoUrl} controls></video>
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
            <Button
               onClick={generatePreivew}
               className="m-4 bg-rose-500 hover:bg-rose-600 text-white"
            >
               Generate Brain Rot
            </Button>
            <Button
               onClick={downloadVideo}
               className="m-4 bg-rose-500 hover:bg-rose-600 text-white"
            >
               Download
            </Button>
            {loading && <p className="text-rose-500">Loading...</p>}
         </div>
      </>
   );
};

export default HomePage;
