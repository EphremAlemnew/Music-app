import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import musicReducer from './slices/musicSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    music: musicReducer,
  },
})

// Save only user data to localStorage (not tokens)
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState()
    if (state.user.user) {
      localStorage.setItem('userData', JSON.stringify(state.user.user))
    } else {
      localStorage.removeItem('userData')
    }
  })
}

// Initialize user state from localStorage
export const initializeUserState = () => {
  if (typeof window !== 'undefined') {
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData)
        // Only set user data, don't attempt refresh on initialization
        store.dispatch({ type: 'user/setUser', payload: userData })
      } catch (error) {
        localStorage.removeItem('userData')
      }
    }
  }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch