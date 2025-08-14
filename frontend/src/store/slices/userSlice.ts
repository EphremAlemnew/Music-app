import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_admin: boolean
  user_type: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  refreshToken: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  token: null,
  refreshToken: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
    },
  },
})

export const { setAuth, setUser, setToken, clearAuth } = userSlice.actions
export default userSlice.reducer