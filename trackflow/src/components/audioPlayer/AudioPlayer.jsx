"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "../ui/button"
import * as Slider from "@radix-ui/react-slider"

/**
 * An interactive audio player component for a specific version.
 * It provides controls for play/pause, volume, and progress seeking.
 * The entire player becomes disabled and visually inactive if no `versionAudioUrl` is provided.
 *
 * @param {object} props - The component props.
 * @param {string | null} props.versionAudioUrl - The full URL of the audio file to be played.
 * @param {string} props.versionName - The name of the version being played.
 * @param {string} props.branchName - The name of the branch this version belongs to.
 * @param {Function} props.onTimeUpdate - A callback function that fires with the current playback time.
 * @returns {JSX.Element} The rendered audio player component.
 */
export default function AudioPlayer({ versionAudioUrl, versionName, branchName, onTimeUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  const isPlayerDisabled = !versionAudioUrl;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [versionAudioUrl])

  const togglePlayPause = () => {
    if (isPlayerDisabled || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value) => {
    if (isPlayerDisabled) return;
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
    if (isMuted && value[0] > 0) {
      setIsMuted(false)
      if(audioRef.current) audioRef.current.muted = false;
    }
  }

  const toggleMute = () => {
    if (isPlayerDisabled || !audioRef.current) return;
    const newMutedState = !isMuted
    audioRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  const handleProgressClick = (e) => {
    if (isPlayerDisabled || !audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickRatio = clickX / rect.width
    const newTime = clickRatio * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    if (onTimeUpdate) {
      onTimeUpdate(newTime)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getVersionNumber = (name) => {
    if (!name) return null;
    const match = name.match(/\d+(\.\d+)*/);
    return match ? match[0] : name;
  };

  const versionNumber = getVersionNumber(versionName);

  return (
    <div className="w-full mx-auto">
      <div className={`bg-zinc-800 rounded-2xl shadow-lg border border-zinc-700 p-6 transition-opacity duration-300 ${isPlayerDisabled ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 mt-1">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isPlaying && !isPlayerDisabled ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" : "bg-zinc-600 shadow-sm"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-100 truncate mb-1">
              VERSION : {isPlayerDisabled ? "Aucune" : (versionNumber || "Sans titre")}
            </h2>
            <p className="text-sm text-zinc-400 truncate">
              BRANCHE : {isPlayerDisabled ? "Aucune sélectionnée" : (branchName || "Branche inconnue")}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <div
            className={`w-full bg-zinc-700 rounded-full h-2 transition-colors duration-200 ${isPlayerDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-600'}`}
            onClick={handleProgressClick}
          >
            <div
              className="bg-gray-300 h-full rounded-full"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm text-zinc-400 mb-6">
          <span className="font-mono">{isPlayerDisabled ? "--:--" : formatTime(currentTime)}</span>
          <span className="font-mono">{isPlayerDisabled ? "--:--" : formatTime(duration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={togglePlayPause}
            disabled={isPlayerDisabled}
            size="lg"
            className={`w-12 h-12 rounded-full bg-gray-300 text-zinc-800 border-0 shadow-md transition-all duration-200 ${
              isPlayerDisabled ? 'cursor-not-allowed' : 'hover:bg-gray-400 hover:shadow-lg hover:scale-105 active:scale-95'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </Button>
          <div className={`flex items-center gap-3 w-32 transition-opacity duration-300 ${isPlayerDisabled ? 'opacity-50' : ''}`}>
            <Button
              onClick={toggleMute}
              disabled={isPlayerDisabled}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isMuted || volume[0] === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={isMuted ? [0] : volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              disabled={isPlayerDisabled}
            >
              <Slider.Track className="bg-zinc-700 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-gray-300 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-4 h-4 bg-gray-300 shadow-md rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed"
                aria-label="Volume"
              />
            </Slider.Root>
          </div>
        </div>
        <audio
          ref={audioRef}
          src={versionAudioUrl || null}
          onTimeUpdate={() => {
            if (audioRef.current) {
              const newTime = audioRef.current.currentTime;
              setCurrentTime(newTime);
              if (onTimeUpdate) {
                onTimeUpdate(newTime);
              }
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  )
}