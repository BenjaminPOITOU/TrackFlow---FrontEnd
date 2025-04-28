import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

export function AudioPlayerContent({versionAudioUrl}) {
 

  const waveformRef = useRef(null);
  const audioRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialiser WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#99a1af",
        progressColor: "#383351",
        url: versionAudioUrl,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 80,
        responsive: true,
      });

      ws.on("ready", () => {
        setWavesurfer(ws);
        setDuration(ws.getDuration());
        setIsLoaded(true);
      });

      ws.on("play", () => {
        setIsPlaying(true);
      });

      ws.on("pause", () => {
        setIsPlaying(false);
      });

      ws.on("audioprocess", () => {
        setCurrentTime(ws.getCurrentTime());
      });

      ws.on("seek", () => {
        setCurrentTime(ws.getCurrentTime());
      });

      return () => {
        ws.destroy();
      };
    }
  }, [waveformRef]);

  // Fonctions de contrôle
  const togglePlay = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  const seekTo = (position) => {
    if (wavesurfer) {
      wavesurfer.seekTo(position / duration);
      setCurrentTime(position);
    }
  };

  const skip = (seconds) => {
    if (wavesurfer) {
      const newTime = Math.max(0, Math.min(wavesurfer.getCurrentTime() + seconds, duration));
      wavesurfer.seekTo(newTime / duration);
    }
  };

  const toggleMute = () => {
    if (wavesurfer) {
      if (isMuted) {
        wavesurfer.setVolume(volume);
      } else {
        wavesurfer.setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const adjustVolume = (newVolume) => {
    if (wavesurfer) {
      wavesurfer.setVolume(newVolume);
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  // Formater le temps (mm:ss)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full mx-auto rounded overflow-hidden bg-neutral-700 shadow-lg p-6 border border-gray-300">
      {/* Visualiseur d'onde */}
      <div 
        ref={waveformRef} 
        className="mb-4 rounded-md overflow-hidden"
        style={{ minHeight: "80px" }}
      ></div>
      
      {/* Barre de lecture personnalisée */}
      <div className="mt-6">
        {/* Barre de progression et temps */}
        <div className="flex items-center mb-2 text-gray-300">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <div className="mx-2 flex-grow">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #d1d5dc 0%, #d1d5dc ${
                  (currentTime / duration) * 100
                }%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
              }}
            />
          </div>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
        
        {/* Contrôles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => skip(-10)} 
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 bg-neutral-500 hover:bg-gray-500 rounded-full text-white focus:outline-none cursor-pointer"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            
            <button 
              onClick={() => skip(10)} 
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Contrôle du volume */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute} 
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => adjustVolume(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #d1d5dc 0%, #d1d5dc ${
                  (isMuted ? 0 : volume) * 100
                }%, #4B5563 ${(isMuted ? 0 : volume) * 100}%, #4B5563 100%)`
              }}
            />
          </div>
        </div>
      </div>
      
      {/* État de chargement */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="text-white">Chargement de l'audio...</div>
        </div>
      )}
    </div>
  );
}