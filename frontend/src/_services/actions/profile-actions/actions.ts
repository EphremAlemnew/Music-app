import axiosInstance from '../axiosInstance'
import { store } from '@/store'
import { setUser } from '@/store/slices/userSlice'

export interface UpdateProfileData {
  first_name: string
  last_name: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
  confirm_password: string
}

export const updateProfile = async (data: UpdateProfileData) => {
  const response = await axiosInstance.patch('auth/profile/', data)
  
  // Update Redux store with new user data
  const currentState = store.getState()
  if (currentState.user.user) {
    store.dispatch(setUser({
      ...currentState.user.user,
      first_name: response.data.first_name,
      last_name: response.data.last_name
    }))
  }
  
  return response.data
}

export const changePassword = async (data: ChangePasswordData) => {
  const response = await axiosInstance.post('auth/change-password/', data)
  return response.data
}