import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { WaveformVisualizer } from "./WaveFormVisualizer";





export function AudioPlayerContent() {
  const handlePlay = (e) => {
    console.log("Audio en lecture");
  };

  return (
    <div>
    <WaveformVisualizer audioUrl="https://storage.googleapis.com/my-audio-file-bucket/musiques/166a1f3b-b713-4b0b-a085-02b07b865e6e.mp3" />
    <AudioPlayer
      src={
        "https://storage.googleapis.com/my-audio-file-bucket/musiques/166a1f3b-b713-4b0b-a085-02b07b865e6e.mp3"
      }
      onPlay={handlePlay}
      showJumpControls={true}
      showSkipControls={true}
    
    />
    </div>
  );
}
