'use client'

import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CurrentSong {
  id: string
  title: string
  artist: string
  duration: string
}

export function FloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong] = useState<CurrentSong>({
    id: '1',
    title: 'Sample Song',
    artist: 'Sample Artist',
    duration: '3:45'
  })
  const [isVisible, setIsVisible] = useState(true)
  const [currentTime, setCurrentTime] = useState('1:23')
  const [progress, setProgress] = useState(37)

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 right-4 w-80 bg-card/95 backdrop-blur-md border shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="sm">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-1">
            <Progress value={progress} className="h-1" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentTime}</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}