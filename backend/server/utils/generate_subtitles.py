import asyncio
from pathlib import Path
from faster_whisper import WhisperModel
from pydub import AudioSegment

output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"
num_workers=4
model = WhisperModel('tiny', device="cpu", cpu_threads=2, compute_type="float32", num_workers=num_workers)

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
    chunks = await split_audio(file_path, chunk_length_ms=30000)
    
    output_dir_chunks = Path(output_dest) / str(folder_id) / "chunks"
    output_dir_chunks.mkdir(parents=True, exist_ok=True)
    
    # Save the chunks to files
    chunk_files = []
    for i, chunk in enumerate(chunks):
        chunk_path = output_dir_chunks / f"chunk_{i * 30}.wav"
        chunk.export(chunk_path, format="wav")
        chunk_files.append(chunk_path)
        
    segments = await process_chunks_with_executor(chunk_files)

    await save_as_ass(segments, output_dest / str(folder_id) / "subtitles.ass", style)
    for chunk_file in output_dir_chunks.iterdir():
        chunk_file.unlink()
    output_dir_chunks.rmdir()
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

async def save_as_ass(segments, output_dest, style, max_chars_per_line=25):
    """
    Saves all transcription segments as a single ASS subtitle file, splitting up segments into smaller chunks.

    :param segments: All transcription segments from all chunks.
    :param output_dest: Path to save the subtitle file.
    :param style: Dictionary containing subtitle styling options.
    :param max_chars_per_line: Maximum number of characters per subtitle line.
    :return: None
    """
    # Style setup
    style = dict(style)
    style["Alignment"] = SUBTITLE_POSITIONS[style["Alignment"]]
    style["PrimaryColour"] = await convert_subtitle_color(style['PrimaryColour'])
    style["SecondaryColour"] = await convert_subtitle_color(style['SecondaryColour'])
    style["BackColour"] = await convert_subtitle_color(style['BackColour'])
    style_string = f"Style: {style['Name']},{style['Fontname']},{style['Fontsize']},{style['PrimaryColour']},{style['SecondaryColour']},{style['OutlineColour']},{style['BackColour']},{style['Bold']},{style['Italic']},{style['Underline']},{style['StrikeOut']},{style['ScaleX']},{style['ScaleY']},{style['Spacing']},{style['Angle']},{style['BorderStyle']},{style['Outline']},{style['Shadow']},{style['Alignment']},{style['MarginL']},{style['MarginR']},{style['MarginV']},1"

    # ASS subtitle file content
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

    for segment in segments:
        start_time = segment.start
        end_time = segment.end
        text = segment.text.strip()

        # Split text into smaller chunks
        text_chunks = []
        current_chunk = ""
        for word in text.split():
            if len(current_chunk) + len(word) + 1 > max_chars_per_line:
                text_chunks.append(current_chunk.strip())
                current_chunk = ""
            current_chunk += word + " "
        if current_chunk:
            text_chunks.append(current_chunk.strip())

        # Calculate duration per chunk
        total_duration = end_time - start_time
        chunk_duration = total_duration / len(text_chunks)

        # Add each chunk as a separate subtitle line
        for i, chunk in enumerate(text_chunks):
            chunk_start_time = start_time + (i * chunk_duration)
            chunk_end_time = start_time + ((i + 1) * chunk_duration)

            start_time_str = f"{int(chunk_start_time // 3600):01}:{int((chunk_start_time % 3600) // 60):02}:{int(chunk_start_time % 60):02}.{int((chunk_start_time * 1000) % 1000):03}"
            end_time_str = f"{int(chunk_end_time // 3600):01}:{int((chunk_end_time % 3600) // 60):02}:{int(chunk_end_time % 60):02}.{int((chunk_end_time * 1000) % 1000):03}"

            ass_content += f"Dialogue: 0,{start_time_str},{end_time_str},Default,,0,0,0,,{chunk}\n"

    # Save final ASS file
    with open(output_dest, "w", encoding="utf-8") as f:
        f.write(ass_content)


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

def transcribe_chunk(chunk_file: str):
    segments, info = model.transcribe(chunk_file, beam_size=8,word_timestamps=True)
    start_time = str(chunk_file).split('_')[1].split('.')[0]
    segments = list(segments)
    for segment in segments:
        segment.start += int(start_time)
        segment.end += int(start_time)
    return segments

async def process_chunks_with_executor(chunk_files):
    tasks = [asyncio.to_thread(transcribe_chunk, chunk_file) for chunk_file in chunk_files]
    results = await asyncio.gather(*tasks)
    
    all_segments = []
    for path, segments in zip(chunk_files, results):
        print(
            "Transcription for %s:%s"
            % (path, "".join(segment.text for segment in segments))
        )
        all_segments.extend(segments)
    return all_segments

async def split_audio(file_path: str, chunk_length_ms: int = 30000):
    # Load the audio file
    audio = AudioSegment.from_file(file_path)
    
    # Determine the total length of the audio in milliseconds
    audio_length_ms = len(audio)
    
    # Split the audio into fixed-size chunks
    chunks = [
        audio[i:i+chunk_length_ms]
        for i in range(0, audio_length_ms, chunk_length_ms)
    ]
    
    return chunks

if __name__ == "__main__":
    asyncio.run(generate_subtitles("611d0e7d-c896-4ca2-996b-f559044921fa", r"C:\Users\ogi\Desktop\rotmaxxing\backend\static\uploads\611d0e7d-c896-4ca2-996b-f559044921fa\speech.wav", {
        "Name": "Default",
        "Fontname": "Montserrat-VariableFont.ttf",
        "Fontsize": 24,
        "PrimaryColour": "#FFFFFF",
        "SecondaryColour": "#FFFFFF",
        "BackColour": "#FFFFFF",
        "Bold": 1,
        "Italic": 1,
        "BorderStyle": 3,
        "Outline": 2,
        "Shadow": 1,
        "Alignment": "center",
        "MarginL": 30,
        "MarginR": 30,
        "MarginV": 30,
        "OutlineColour": "#000000",
        "Underline": 0,
        "StrikeOut": 0,
        "ScaleX": 100,
        "ScaleY": 100,
        "Spacing": 0,
        "Angle": 0
    }))