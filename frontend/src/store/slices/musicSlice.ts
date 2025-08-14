import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Song {
  id: number
  title: string
  artist: string
  duration?: string
  file_url?: string
}

interface MusicState {
  currentSong: Song | null
  isPlaying: boolean
  isPlayerVisible: boolean
  queue: Song[]
  currentIndex: number
}

const initialState: MusicState = {
  currentSong: null,
  isPlaying: false,
  isPlayerVisible: false,
  queue: [],
  currentIndex: 0,
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload
      state.isPlaying = true
      state.isPlayerVisible = true
    },
    pauseSong: (state) => {
      state.isPlaying = false
    },
    resumeSong: (state) => {
      state.isPlaying = true
    },
    stopSong: (state) => {
      state.currentSong = null
      state.isPlaying = false
      state.isPlayerVisible = false
    },
    setPlayerVisible: (state, action: PayloadAction<boolean>) => {
      state.isPlayerVisible = action.payload
    },
    setQueue: (state, action: PayloadAction<Song[]>) => {
      state.queue = action.payload
      state.currentIndex = 0
    },
    playPlaylist: (state, action: PayloadAction<Song[]>) => {
      if (action.payload.length > 0) {
        state.queue = action.payload
        state.currentIndex = 0
        state.currentSong = action.payload[0]
        state.isPlaying = true
        state.isPlayerVisible = true
      }
    },
    nextSong: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1
        state.currentSong = state.queue[state.currentIndex]
      }
    },
    previousSong: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1
        state.currentSong = state.queue[state.currentIndex]
      }
    },
  },
})

export const {
  playSong,
  pauseSong,
  resumeSong,
  stopSong,
  setPlayerVisible,
  setQueue,
  playPlaylist,
  nextSong,
  previousSong,
} = musicSlice.actions
export default musicSlice.reducer