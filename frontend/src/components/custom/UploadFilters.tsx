import React, { useEffect, useState } from 'react';
import {
   SubtitleOptions,
   VideoOptions,
   AudioOptions,
} from '@/types/UploadTypes';
import { Input } from '../ui/input';

interface UploadFiltersProps {
   filters: {
      subtitleOptions: SubtitleOptions;
      videoOptions: VideoOptions;
      audioOptions: AudioOptions;
   };
   setFilters: React.Dispatch<
      React.SetStateAction<{
         subtitleOptions: SubtitleOptions;
         videoOptions: VideoOptions;
         audioOptions: AudioOptions;
      }>
   >;
}

const UploadFilters: React.FC<UploadFiltersProps> = ({ setFilters }) => {
   const [subtitleOptions, setSubtitleOptions] = useState<SubtitleOptions>({
      font: 'Montserrat-VariableFont.ttf',
      FontSize: 24,
      PrimaryColour: '&HFFFFFF&',
      SecondaryColour: '&HFF0000&',
      Outline: 2,
      OutlineColour: '&H000000&',
      Shadow: 1,
      ShadowColour: '&H000000&',
      Bold: 1,
      Italic: 1,
      MarginV: 10,
      Underline: 1,
      StrikeOut: 0,
      Alignment: 'center',
   });

   const [videoOptions, setVideoOptions] = useState<VideoOptions>({
      audio_fadein: 3,
      audio_fadeout: 3,
      video_fadein: 3,
      video_fadeout: 3,
   });

   const [audioOptions, setAudioOptions] = useState<AudioOptions>({
      voice: 'echo',
   });

   useEffect(() => {
      setFilters({
         subtitleOptions,
         videoOptions,
         audioOptions,
      });
   }, [subtitleOptions, videoOptions, audioOptions]);

   const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSubtitleOptions((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setVideoOptions((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAudioOptions((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   return (
      <div className="flex flex-row gap-4">
         <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Subtitle Options</h2>
            <Input
               type="text"
               name="font"
               placeholder="Font"
               value={subtitleOptions.font}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="FontSize"
               placeholder="Font Size"
               value={subtitleOptions.FontSize}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="text"
               name="PrimaryColour"
               placeholder="Primary Colour"
               value={subtitleOptions.PrimaryColour}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="text"
               name="SecondaryColour"
               placeholder="Secondary Colour"
               value={subtitleOptions.SecondaryColour}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Outline"
               placeholder="Outline"
               value={subtitleOptions.Outline}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="text"
               name="OutlineColour"
               placeholder="Outline Colour"
               value={subtitleOptions.OutlineColour}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Shadow"
               placeholder="Shadow"
               value={subtitleOptions.Shadow}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="text"
               name="ShadowColour"
               placeholder="Shadow Colour"
               value={subtitleOptions.ShadowColour}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Bold"
               placeholder="Bold"
               value={subtitleOptions.Bold}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Italic"
               placeholder="Italic"
               value={subtitleOptions.Italic}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="MarginV"
               placeholder="Margin V"
               value={subtitleOptions.MarginV}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Underline"
               placeholder="Underline"
               value={subtitleOptions.Underline}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="StrikeOut"
               placeholder="Strike Out"
               value={subtitleOptions.StrikeOut}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="text"
               name="Alignment"
               placeholder="Alignment"
               value={subtitleOptions.Alignment}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
         </div>

         <div className="flex flex-col">
            <h2 className="text-xl font-bold mt-6 mb-4">Video Options</h2>
            <Input
               type="number"
               name="audio_fadein"
               placeholder="Audio Fade In"
               value={videoOptions.audio_fadein}
               onChange={handleVideoChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="audio_fadeout"
               placeholder="Audio Fade Out"
               value={videoOptions.audio_fadeout}
               onChange={handleVideoChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="video_fadein"
               placeholder="Video Fade In"
               value={videoOptions.video_fadein}
               onChange={handleVideoChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="video_fadeout"
               placeholder="Video Fade Out"
               value={videoOptions.video_fadeout}
               onChange={handleVideoChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
         </div>

         <div className="flex flex-col">
            <h2 className="text-xl font-bold mt-6 mb-4">Audio Options</h2>
            <Input
               type="text"
               name="voice"
               placeholder="Voice"
               value={audioOptions.voice}
               onChange={handleAudioChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
         </div>
      </div>
   );
};

export default UploadFilters;
