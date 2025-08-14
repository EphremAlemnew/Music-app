'use client'

import { useState } from 'react'
import { Clock, User, Music, Calendar, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { usePlayLogs } from '@/_services/query/play-logs-query/playLogsQuery'

export default function PlayLogsPage() {
  const [isAdmin] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: playLogsData, isLoading } = usePlayLogs({
    ordering: '-played_at'
  })
  
  const playLogs = playLogsData?.results || []



  const filteredLogs = playLogs.filter(log => {
    return log.song_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.song_artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const playTime = new Date(timestamp)
    const diffMs = now.getTime() - playTime.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Play Logs</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'All user play history' : 'Your play history'}
          </p>
        </div>
        <Badge variant={isAdmin ? 'default' : 'secondary'}>
          {isAdmin ? 'Admin View' : 'User View'}
        </Badge>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search songs, artists, or users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="text-sm text-muted-foreground">
          {filteredLogs.length} logs found
        </div>
      </div>



      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No play logs found</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <Music className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{log.song_title}</h3>
                      <p className="text-sm text-muted-foreground">{log.song_artist}</p>
                      {isAdmin && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs text-muted-foreground">{log.user_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(log.played_at)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimestamp(log.played_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}