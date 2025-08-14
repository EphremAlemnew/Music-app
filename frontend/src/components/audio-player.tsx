'use client'

import { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogSongPlayMutation } from '@/_services/query/play-logs-query/playLogsQuery'

interface AudioPlayerProps {
  src: string
  title: string
  artist: string
  songId: number
}

export function AudioPlayer({ src, title, artist, songId }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasLogged, setHasLogged] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const logPlayMutation = useLogSongPlayMutation()

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      // Log play when song starts (only once per session)
      if (!hasLogged) {
        logPlayMutation.mutate(songId)
        setHasLogged(true)
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setHasLogged(false) // Reset for next play
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={togglePlay}
        className="w-8 h-8 p-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <audio
        ref={audioRef}
        src={src}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="none"
      />
    </div>
  )
}