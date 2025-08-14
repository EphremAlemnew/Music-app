import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount } from '@/_services/actions/notifications-actions/actions'

export const useNotifications = (params?: {
  is_read?: boolean
  notification_type?: string
  ordering?: string
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  })
}

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationIds?: number[]) => markAllNotificationsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}