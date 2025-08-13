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
    <Card className="fixed bottom-4 right-4 w-80 bg-gradient-to-br from-card/95 via-card/90 to-purple-50/20 dark:to-purple-950/20 backdrop-blur-xl border-0 shadow-2xl z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      <div className="relative p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-600 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-muted/50" />
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span className="bg-muted/50 px-2 py-1 rounded-full">{currentTime}</span>
              <span className="bg-muted/50 px-2 py-1 rounded-full">{currentSong.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}