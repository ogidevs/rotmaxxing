export interface SubtitleOptions {
   font: string;
   FontSize: number;
   PrimaryColour: string;
   SecondaryColour: string;
   Outline: number;
   OutlineColour: string;
   Shadow: number;
   ShadowColour: string;
   Bold: number;
   Italic: number;
   MarginV: number;
   Underline: number;
   StrikeOut: number;
   Alignment:
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right'
      | 'middle-left'
      | 'center'
      | 'middle-right'
      | 'top-left'
      | 'top-center'
      | 'top-right';
}

export interface VideoOptions {
   audio_fadein: number;
   audio_fadeout: number;
   video_fadein: number;
   video_fadeout: number;
}

export interface AudioOptions {
   voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}
