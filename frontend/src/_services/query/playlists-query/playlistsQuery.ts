import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  getPlaylists, 
  getPlaylist, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '@/_services/actions/playlists-actions/actions'
import type { CreatePlaylistData } from '@/_services/actions/playlists-actions/actions'

export const usePlaylists = (params?: {
  search?: string
  is_public?: boolean
  ordering?: string
}) => {
  return useQuery({
    queryKey: ['playlists', params],
    queryFn: () => getPlaylists(params),
  })
}

export const usePlaylist = (id: number) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylist(id),
    enabled: !!id,
  })
}

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlaylistData) => createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      toast.success('Playlist created successfully!')
    },
    onError: () => {
      toast.error('Failed to create playlist. Please try again.')
    },
  })
}

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePlaylistData> }) => updatePlaylist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      toast.success('Playlist updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update playlist. Please try again.')
    },
  })
}

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      toast.success('Playlist deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete playlist. Please try again.')
    },
  })
}