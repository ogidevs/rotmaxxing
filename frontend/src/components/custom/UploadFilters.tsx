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
      Name: 'Default',
      Fontname: 'Montserrat-VariableFont.ttf',
      Fontsize: 24,
      PrimaryColour: '&HFFFFFF&',
      SecondaryColour: '&HFF0000&',
      BackColour: '&H000000&',
      Bold: 1,
      Italic: 1,
      BorderStyle: 3,
      Outline: 2,
      Shadow: 1,
      Alignment: 'center',
      MarginL: 30,
      MarginR: 30,
      MarginV: 30,
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
               name="Fontname"
               placeholder="Font"
               value={subtitleOptions.Fontname}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="Fontsize"
               placeholder="Font Size"
               value={subtitleOptions.Fontsize}
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
               type="text"
               name="BackColour"
               placeholder="Back Colour"
               value={subtitleOptions.BackColour}
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
               type="text"
               name="BorderStyle"
               placeholder="Border Style"
               value={subtitleOptions.BorderStyle}
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
               type="number"
               name="Shadow"
               placeholder="Shadow"
               value={subtitleOptions.Shadow}
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
            <Input
               type="number"
               name="MarginL"
               placeholder="Margin L"
               value={subtitleOptions.MarginL}
               onChange={handleSubtitleChange}
               className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
            />
            <Input
               type="number"
               name="MarginR"
               placeholder="Margin R"
               value={subtitleOptions.MarginR}
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
