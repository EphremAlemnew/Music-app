"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface FloatingPlayerSong {
  id: number;
  title: string;
  artist: string;
  duration?: string;
  file_url?: string;
}

interface FloatingPlayerProps {
  song: FloatingPlayerSong | null;
  isVisible: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function FloatingPlayer({
  song,
  isVisible,
  onClose,
  onPrev,
  onNext,
}: FloatingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<string>("0:00");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (song && audioRef.current) {
      // Only update src if it has changed to prevent resetting
      if (song.file_url && 
        audioRef.current.src !==
        `${process.env.NEXT_PUBLIC_API_MEDIA_URL}${song.file_url}`
      ) {
        audioRef.current.src = `${process.env.NEXT_PUBLIC_API_MEDIA_URL}${song.file_url}`;
        audioRef.current.load();
      }
      audioRef.current.volume = volume;
      setIsPlaying(true);
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    // Cleanup on unmount or song change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [song, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime;
      setCurrentTime(formatTime(newTime));
      setProgress((newTime / (audioRef.current.duration || 1)) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  // Handle seeking during drag
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    const newTime = (newProgress / 100) * (audioRef.current.duration || 0);
    if (!isNaN(newTime) && isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(formatTime(newTime));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    }
  };

  if (!isVisible || !song) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-gradient-to-br from-card/95 via-card/90 to-purple-50/20 dark:to-purple-950/20 backdrop-blur-xl border-0 shadow-2xl z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="relative p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
              {song.title}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {song.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            {/* Seekable Progress Bar */}
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 rounded-lg appearance-none bg-muted/50 cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary) ${progress}%, var(--muted) ${progress}%)`,
              }}
            />

            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span className="bg-muted/50 px-2 py-1 rounded-full">
                {currentTime}
              </span>
              <span className="bg-muted/50 px-2 py-1 rounded-full">
                {song.duration || duration}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              className="w-10 h-10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="w-10 h-10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="w-8 h-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume * 100}
              onChange={handleVolumeChange}
              className="flex-1 h-2 rounded-lg appearance-none bg-muted/50 cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 ${volume * 100}%, var(--muted) ${volume * 100}%)`,
              }}
            />
            <span className="text-xs font-medium text-muted-foreground w-8 text-center">
              {Math.round(volume * 100)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
