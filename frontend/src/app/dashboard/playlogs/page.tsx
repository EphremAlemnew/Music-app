'use client'

import { useState, useEffect } from 'react'
import { Clock, User, Music, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface PlayLog {
  id: string
  userId: string
  userName: string
  songId: string
  songTitle: string
  artist: string
  timestamp: string
}

export default function PlayLogsPage() {
  const [playLogs, setPlayLogs] = useState<PlayLog[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      songId: '1',
      songTitle: 'Sample Song 1',
      artist: 'Artist 1',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      songId: '2',
      songTitle: 'Sample Song 2',
      artist: 'Artist 2',
      timestamp: '2024-01-15T11:15:00Z'
    },
    {
      id: '3',
      userId: '1',
      userName: 'John Doe',
      songId: '3',
      songTitle: 'Favorite Song',
      artist: 'Favorite Artist',
      timestamp: '2024-01-15T12:00:00Z'
    }
  ])

  const [isAdmin] = useState(true) // Mock admin status
  const [currentUserId] = useState('1') // Mock current user ID
  const [searchTerm, setSearchTerm] = useState('')

  // Simulate API call to log play
  const logPlay = async (userId: string, songId: string, songTitle: string, artist: string) => {
    const newLog: PlayLog = {
      id: Date.now().toString(),
      userId,
      userName: userId === '1' ? 'John Doe' : 'Other User',
      songId,
      songTitle,
      artist,
      timestamp: new Date().toISOString()
    }

    // In real app, this would be an API call
    console.log('Logging play to API:', newLog)
    setPlayLogs(prev => [newLog, ...prev])
  }

  // Filter logs based on user role
  const filteredLogs = playLogs.filter(log => {
    const matchesSearch = log.songTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (isAdmin) {
      return matchesSearch // Admin sees all logs
    } else {
      return log.userId === currentUserId && matchesSearch // Users see only their logs
    }
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

      {/* Demo button to simulate play logging */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Demo Play Logging</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => logPlay(currentUserId, 'demo', 'Demo Song', 'Demo Artist')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Simulate Play (Demo Song)
          </button>
          <p className="text-sm text-muted-foreground mt-2">
            Click to simulate a song play and see it logged in real-time
          </p>
        </CardContent>
      </Card>

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
                      <h3 className="font-medium">{log.songTitle}</h3>
                      <p className="text-sm text-muted-foreground">{log.artist}</p>
                      {isAdmin && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs text-muted-foreground">{log.userName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(log.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimestamp(log.timestamp)}</span>
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