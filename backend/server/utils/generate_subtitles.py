from pathlib import Path
import whisper

output_dest = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"


def generate_subtitles(folder_id: str, file_path: str, model="small") -> str:
    model = whisper.load_model(model)
    print("A")
    result = model.transcribe(file_path, word_timestamps=True)
    print("B")
    save_as_srt(result, output_dest / str(folder_id) / "subtitles.srt")
    return output_dest / str(folder_id) / "subtitles.srt"


def save_as_srt(transcription, output_dest):
    print(transcription, output_dest)
    with open(output_dest, "w") as f:
        index = 1
        for segment in transcription["segments"]:
            start_time = segment["start"]
            end_time = segment["end"]
            text = segment["text"]

            # Convert timestamps to SRT format (hours:minutes:seconds,milliseconds)
            start_time_str = f"{int(start_time//3600):02}:{int((start_time%3600)//60):02}:{int(start_time%60):02},{int((start_time*1000)%1000):03}"
            end_time_str = f"{int(end_time//3600):02}:{int((end_time%3600)//60):02}:{int(end_time%60):02},{int((end_time*1000)%1000):03}"

            # Write to file in SRT format
            f.write(f"{index}\n")
            f.write(f"{start_time_str} --> {end_time_str}\n")
            f.write(f"{text}\n\n")
            index += 1
