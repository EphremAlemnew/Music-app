import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSongs, getSong, createSong, updateSong, deleteSong } from '@/_services/actions/songs-actions/actions'
import type { CreateSongData } from '@/_services/actions/songs-actions/actions'

export const useSongs = (params?: {
  search?: string
  genre?: string
  artist?: string
  ordering?: string
}) => {
  return useQuery({
    queryKey: ['songs', params],
    queryFn: () => getSongs(params),
  })
}

export const useSong = (id: number) => {
  return useQuery({
    queryKey: ['song', id],
    queryFn: () => getSong(id),
    enabled: !!id,
  })
}

export const useCreateSongMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSongData) => createSong(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      toast.success('Song uploaded successfully!')
    },
    onError: () => {
      toast.error('Failed to upload song. Please try again.')
    },
  })
}

export const useUpdateSongMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSongData> }) => updateSong(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      toast.success('Song updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update song. Please try again.')
    },
  })
}

export const useDeleteSongMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      toast.success('Song deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete song. Please try again.')
    },
  })
}