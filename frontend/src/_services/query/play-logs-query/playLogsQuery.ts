import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { logSongPlay, getPlayLogs } from '@/_services/actions/play-logs-actions/actions'

export const usePlayLogs = (params?: {
  song?: number
  user?: number
  ordering?: string
}) => {
  return useQuery({
    queryKey: ['play-logs', params],
    queryFn: () => getPlayLogs(params),
  })
}

export const useLogSongPlayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (songId: number) => logSongPlay(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['play-logs'] })
    },
  })
}