import React, { useEffect, useState } from 'react';
import {
   SubtitleOptions,
   VideoOptions,
   AudioOptions,
} from '@/types/UploadTypes';
import { Input } from '../ui/input';
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from '@/components/ui/drawer';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '../ui/select';
import { Label } from '@radix-ui/react-label';

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
      PrimaryColour: '#FFFFFF',
      SecondaryColour: '#FFFFFF',
      BackColour: '#FFFFFF',
      Bold: 1,
      Italic: 1,
      BorderStyle: 3,
      Outline: 2,
      Shadow: 1,
      Alignment: 'center',
      MarginL: 30,
      MarginR: 30,
      MarginV: 30,
      OutlineColour: '#000000',
      Underline: 0,
      StrikeOut: 0,
      ScaleX: 100,
      ScaleY: 100,
      Spacing: 0,
      Angle: 0,
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

   const handleAudioChange = (
      value: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
   ) => {
      setAudioOptions((prevState) => ({
         ...prevState,
         voice: value,
      }));
   };

   return (
      <div className="flex flex-row justify-center items-center">
         <Drawer aria-hidden="true">
            <DrawerTrigger className="m-4 bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 h-9 rounded-lg">
               Filters
            </DrawerTrigger>
            <DrawerContent className="dark:bg-gray-900 dark:text-white">
               <DrawerHeader className="flex justify-center items-center flex-col space-y-4 overflow-y-auto">
                  <DrawerTitle>Filters</DrawerTitle>
                  <div className="flex md:flex-row md:space-x-4 flex-col space-x-0 md:space-y-4">
                     <div className="flex flex-col">
                        <span className="text-xl font-bold mb-4">
                           Subtitle Options
                        </span>
                        <div className="flex flex-row gap-4">
                           <div className="flex flex-col">
                              <Label>Font</Label>
                              <Input
                                 type="text"
                                 name="Fontname"
                                 placeholder="Font"
                                 value={subtitleOptions.Fontname}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Font Size</Label>
                              <Input
                                 type="number"
                                 name="Fontsize"
                                 placeholder="Font Size"
                                 value={subtitleOptions.Fontsize}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Primary Colour</Label>
                              <Input
                                 type="color"
                                 name="PrimaryColour"
                                 placeholder="Primary Colour"
                                 value={subtitleOptions.PrimaryColour}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Secondary Colour</Label>
                              <Input
                                 type="color"
                                 name="SecondaryColour"
                                 placeholder="Secondary Colour"
                                 value={subtitleOptions.SecondaryColour}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Back Colour</Label>
                              <Input
                                 type="color"
                                 name="BackColour"
                                 placeholder="Back Colour"
                                 value={subtitleOptions.BackColour}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Bold</Label>
                              <Input
                                 type="number"
                                 name="Bold"
                                 placeholder="Bold"
                                 value={subtitleOptions.Bold}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Italic</Label>
                              <Input
                                 type="number"
                                 name="Italic"
                                 placeholder="Italic"
                                 value={subtitleOptions.Italic}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Border Style</Label>
                              <Input
                                 type="text"
                                 name="BorderStyle"
                                 placeholder="Border Style"
                                 value={subtitleOptions.BorderStyle}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                           </div>
                           <div className="flex flex-col">
                              <Label>Outline Color</Label>
                              <Input
                                 type="color"
                                 name="OutlineColour"
                                 placeholder="Outline Colour"
                                 value={subtitleOptions.OutlineColour}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Outline</Label>
                              <Input
                                 type="number"
                                 name="Outline"
                                 placeholder="Outline"
                                 value={subtitleOptions.Outline}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Underline</Label>
                              <Input
                                 type="number"
                                 name="Underline"
                                 placeholder="Underline"
                                 value={subtitleOptions.Underline}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>StrikeOut</Label>
                              <Input
                                 type="number"
                                 name="StrikeOut"
                                 placeholder="StrikeOut"
                                 value={subtitleOptions.StrikeOut}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Scale X</Label>
                              <Input
                                 type="number"
                                 name="ScaleX"
                                 placeholder="Scale X"
                                 value={subtitleOptions.ScaleX}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Scale Y</Label>
                              <Input
                                 type="number"
                                 name="ScaleY"
                                 placeholder="Scale Y"
                                 value={subtitleOptions.ScaleY}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Spacing</Label>
                              <Input
                                 type="number"
                                 name="Spacing"
                                 placeholder="Spacing"
                                 value={subtitleOptions.Spacing}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Angle</Label>
                              <Input
                                 type="number"
                                 name="Angle"
                                 placeholder="Angle"
                                 value={subtitleOptions.Angle}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                           </div>
                           <div className="flex flex-col">
                              <Label>Shadow</Label>
                              <Input
                                 type="number"
                                 name="Shadow"
                                 placeholder="Shadow"
                                 value={subtitleOptions.Shadow}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Alignment</Label>
                              <Select
                                 onValueChange={(value) =>
                                    handleSubtitleChange({
                                       target: { name: 'Alignment', value },
                                    } as React.ChangeEvent<HTMLInputElement>)
                                 }
                                 defaultValue={subtitleOptions.Alignment}
                              >
                                 <SelectTrigger className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2">
                                    <SelectValue placeholder="Alignment" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="bottom-left">
                                       Bottom Left
                                    </SelectItem>
                                    <SelectItem value="bottom-center">
                                       Bottom Center
                                    </SelectItem>
                                    <SelectItem value="bottom-right">
                                       Bottom Right
                                    </SelectItem>
                                    <SelectItem value="middle-left">
                                       Middle Left
                                    </SelectItem>
                                    <SelectItem value="center">
                                       Center
                                    </SelectItem>
                                    <SelectItem value="middle-right">
                                       Middle Right
                                    </SelectItem>
                                    <SelectItem value="top-left">
                                       Top Left
                                    </SelectItem>
                                    <SelectItem value="top-center">
                                       Top Center
                                    </SelectItem>
                                    <SelectItem value="top-right">
                                       Top Right
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <Label>Margin Left</Label>
                              <Input
                                 type="number"
                                 name="MarginL"
                                 placeholder="Margin L"
                                 value={subtitleOptions.MarginL}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Margin Right</Label>
                              <Input
                                 type="number"
                                 name="MarginR"
                                 placeholder="Margin R"
                                 value={subtitleOptions.MarginR}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                              <Label>Margin Vertical</Label>
                              <Input
                                 type="number"
                                 name="MarginV"
                                 placeholder="Margin V"
                                 value={subtitleOptions.MarginV}
                                 onChange={handleSubtitleChange}
                                 className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                              />
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xl font-bold mb-4">
                           Video Options
                        </span>
                        <Label>Audio Fade In</Label>
                        <Input
                           type="number"
                           name="audio_fadein"
                           placeholder="Audio Fade In"
                           value={videoOptions.audio_fadein}
                           onChange={handleVideoChange}
                           className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                        />
                        <Label>Audio Fade Out</Label>
                        <Input
                           type="number"
                           name="audio_fadeout"
                           placeholder="Audio Fade Out"
                           value={videoOptions.audio_fadeout}
                           onChange={handleVideoChange}
                           className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                        />
                        <Label>Video Fade In</Label>
                        <Input
                           type="number"
                           name="video_fadein"
                           placeholder="Video Fade In"
                           value={videoOptions.video_fadein}
                           onChange={handleVideoChange}
                           className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2"
                        />
                        <Label>Video Fade Out</Label>
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
                        <span className="text-xl font-bold mb-4">
                           Audio Options
                        </span>
                        <Label>Voice</Label>
                        <Select
                           onValueChange={handleAudioChange}
                           defaultValue={audioOptions.voice}
                        >
                           <SelectTrigger className="dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-md p-2 rounded-lg mb-2">
                              <SelectValue placeholder="Theme" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="alloy">Alloy</SelectItem>
                              <SelectItem value="echo">Echo</SelectItem>
                              <SelectItem value="fable">Fable</SelectItem>
                              <SelectItem value="onyx">Onyx</SelectItem>
                              <SelectItem value="nova">Nova</SelectItem>
                              <SelectItem value="shimmer">Shimmer</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </DrawerHeader>
               <DrawerFooter>
                  <DrawerClose className="bg-transparent border-0">
                     Close
                  </DrawerClose>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      </div>
   );
};

export default UploadFilters;
