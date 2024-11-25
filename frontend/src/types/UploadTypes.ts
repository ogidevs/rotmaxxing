export interface SubtitleOptions {
   Name: string;
   Fontname: string;
   Fontsize: number;
   PrimaryColour: string;
   SecondaryColour: string;
   BackColour: string;
   Bold: number;
   Italic: number;
   BorderStyle: number;
   Outline: number;
   Shadow: number;
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
   MarginL: number;
   MarginR: number;
   MarginV: number;
   OutlineColour: string;
   Underline: number;
   StrikeOut: number;
   ScaleX: number;
   ScaleY: number;
   Spacing: number;
   Angle: number;
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
