import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import musicReducer from './slices/musicSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    music: musicReducer,
  },
})

// Save state to localStorage (client-side only)
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState()
    localStorage.setItem('userState', JSON.stringify(state.user))
  })
}

// Initialize user state from localStorage
export const initializeUserState = () => {
  if (typeof window !== 'undefined') {
    const savedUserState = localStorage.getItem('userState')
    if (savedUserState) {
      try {
        const userState = JSON.parse(savedUserState)
        if (userState.isAuthenticated && userState.token) {
          store.dispatch({ type: 'user/setAuth', payload: {
            user: userState.user,
            token: userState.token,
            refreshToken: userState.refreshToken
          }})
        }
      } catch (error) {
        localStorage.removeItem('userState')
      }
    }
  }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch