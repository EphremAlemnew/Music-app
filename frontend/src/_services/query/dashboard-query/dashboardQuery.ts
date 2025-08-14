import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/_services/actions/dashboard-actions/actions'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000, // Refetch every minute
  })
}