from pathlib import Path
import whisper

output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"

SUBTITLE_POSITIONS = {
    "bottom-left": 1,
    "bottom-center": 2,
    "bottom-right": 3,
    "middle-left": 4,
    "center": 5,
    "middle-right": 6,
    "top-left": 9,
    "top-center": 8,
    "top-left": 7,
}

async def generate_subtitles(folder_id: str, file_path: str, style: dict):
    model = whisper.load_model("tiny", in_memory=True)
    result = model.transcribe(file_path, word_timestamps=True)
    await save_as_ass(result, output_dest / str(folder_id) / "subtitles.ass", style)
    return output_dest / str(folder_id) / "subtitles.ass"

async def update_subtitles_style(folder_id: str, style : dict):
    ass_file_path = output_dest / str(folder_id) / "subtitles.ass"
    if not ass_file_path.exists():
        raise FileNotFoundError(f"Subtitle file not found at {ass_file_path}")

    with open(ass_file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    style = dict(style)
    style["Alignment"] = SUBTITLE_POSITIONS[style["Alignment"]]
    style["PrimaryColour"] = await convert_subtitle_color(style['PrimaryColour'])
    style["SecondaryColour"] = await convert_subtitle_color(style['SecondaryColour'])
    style["BackColour"] = await convert_subtitle_color(style['BackColour'])
    style_string = f"Style: {style['Name']},{style['Fontname']},{style['Fontsize']},{style['PrimaryColour']},{style['SecondaryColour']},{style['OutlineColour']},{style['BackColour']},{style['Bold']},{style['Italic']},{style['Underline']},{style['StrikeOut']},{style['ScaleX']},{style['ScaleY']},{style['Spacing']},{style['Angle']},{style['BorderStyle']},{style['Outline']},{style['Shadow']},{style['Alignment']},{style['MarginL']},{style['MarginR']},{style['MarginV']},1"
    
    for i, line in enumerate(lines):
        if line.startswith("Style:"):
            lines[i] = style_string + "\n"
            break

    with open(ass_file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    return output_dest / str(folder_id) / "subtitles.ass"

async def save_as_ass(result : str, output_dest : str, style : dict):
    style = dict(style)
    style["Alignment"] = SUBTITLE_POSITIONS[style["Alignment"]]
    style["PrimaryColour"] = await convert_subtitle_color(style['PrimaryColour'])
    style["SecondaryColour"] = await convert_subtitle_color(style['SecondaryColour'])
    style["BackColour"] = await convert_subtitle_color(style['BackColour'])
    style_string = f"Style: {style['Name']},{style['Fontname']},{style['Fontsize']},{style['PrimaryColour']},{style['SecondaryColour']},{style['OutlineColour']},{style['BackColour']},{style['Bold']},{style['Italic']},{style['Underline']},{style['StrikeOut']},{style['ScaleX']},{style['ScaleY']},{style['Spacing']},{style['Angle']},{style['BorderStyle']},{style['Outline']},{style['Shadow']},{style['Alignment']},{style['MarginL']},{style['MarginR']},{style['MarginV']},1"
    ass_content = f"""
    
[Script Info]
Title: Example Transcription
Original Script: OpenAI Whisper
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
{style_string}

[Events]
Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
    """
    last_time = 0
    # Process the transcription result to convert it into .ass format
    for segment in result["segments"]:
        start_time = segment["start"]  # Start time of the segment
        end_time = segment["end"]      # End time of the segment
        text = segment["text"]         # The transcribed text
        
        # Convert start and end time to hours:minutes:seconds:milliseconds format
        start_time_str = f"{int(start_time // 3600):01}:{int((start_time % 3600) // 60):02}:{int(start_time % 60):02}.{int((start_time * 1000) % 1000):03}"
        end_time_str = f"{int(end_time // 3600):01}:{int((end_time % 3600) // 60):02}:{int(end_time % 60):02}.{int((end_time * 1000) % 1000):03}"
        # Append the subtitle event
        ass_content += f"Dialogue: 0,{start_time_str},{end_time_str},Default,,0,0,0,,{text}\n"

    with open(output_dest, "w", encoding="utf-8") as f:
        f.write(ass_content)
    return last_time

async def convert_subtitle_color(hex_color):
    """
    Converts a hex color (#RRGGBB or #AARRGGBB) to the .ass subtitle format (&HAABBGGRR).
    
    :param hex_color: Hex color as a string (e.g., "#RRGGBB" or "#AARRGGBB").
    :return: Color in .ass subtitle format (&HAABBGGRR).
    """
    # Remove leading '#' if present
    hex_color = hex_color.lstrip('#')
    
    # If only RGB is provided, add default alpha (00 for fully opaque)
    if len(hex_color) == 6:
        hex_color = '00' + hex_color
    
    # Parse alpha, red, green, blue
    alpha = hex_color[:2]
    red = hex_color[2:4]
    green = hex_color[4:6]
    blue = hex_color[6:8]
    
    # Reorder to &HAABBGGRR
    ass_color = f"&H{alpha}{blue}{green}{red}"
    
    return ass_color