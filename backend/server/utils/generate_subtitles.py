from pathlib import Path
import whisper

output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"


async def generate_subtitles(folder_id: str, file_path: str):
    model = whisper.load_model("tiny", in_memory=True)
    result = model.transcribe(file_path, word_timestamps=True)
    await save_as_srt(result, output_dest / str(folder_id) / "subtitles.srt")
    return output_dest / str(folder_id) / "subtitles.srt"


async def save_as_srt(transcription, output_dest, max_words=5, max_duration=2.5):
    """
    Save transcription to an SRT file, splitting segments to meet the max_words and max_duration limits.
    """
    with open(output_dest, "w", encoding="utf-8") as f:
        index = 1
        for segment in transcription["segments"]:
            start_time = segment["start"]
            end_time = segment["end"]
            text = segment["text"]

            # Split by word count
            words = text.split()
            current_start_time = start_time

            for i in range(0, len(words), max_words):
                chunk_words = words[i:i + max_words]
                chunk_text = " ".join(chunk_words)

                # Determine the duration of this chunk
                chunk_end_time = min(
                    current_start_time + max_duration, 
                    start_time + ((end_time - start_time) / len(words) * (i + len(chunk_words)))
                )

                # Convert timestamps to SRT format
                start_time_str = f"{int(current_start_time // 3600):02}:{int((current_start_time % 3600) // 60):02}:{int(current_start_time % 60):02},{int((current_start_time * 1000) % 1000):03}"
                end_time_str = f"{int(chunk_end_time // 3600):02}:{int((chunk_end_time % 3600) // 60):02}:{int(chunk_end_time % 60):02},{int((chunk_end_time * 1000) % 1000):03}"

                # Write to file
                f.write(f"{index}\n")
                f.write(f"{start_time_str} --> {end_time_str}\n")
                f.write(f"{chunk_text}\n\n")
                index += 1

                # Update current_start_time for the next chunk
                current_start_time = chunk_end_time