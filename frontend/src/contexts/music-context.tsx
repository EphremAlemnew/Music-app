'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Song {
  id: number
  title: string
  artist: string
  file_url?: string
  duration?: number
}

interface MusicContextType {
  currentSong: Song | null
  isPlaying: boolean
  setCurrentSong: (song: Song) => void
  setIsPlaying: (playing: boolean) => void
  playSong: (song: Song) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      setCurrentSong,
      setIsPlaying,
      playSong
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}