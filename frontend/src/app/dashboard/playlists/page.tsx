'use client'

import { useState } from 'react'
import { Plus, Play, Edit, Trash2, Music2, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface Song {
  id: string
  title: string
  artist: string
}

interface Playlist {
  id: string
  name: string
  createdBy: string
  isPublic: boolean
  songs: Song[]
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'Top Hits 2024',
      createdBy: 'Admin',
      isPublic: true,
      songs: [
        { id: '1', title: 'Sample Song 1', artist: 'Artist 1' },
        { id: '2', title: 'Sample Song 2', artist: 'Artist 2' }
      ]
    },
    {
      id: '2',
      name: 'My Favorites',
      createdBy: 'John Doe',
      isPublic: false,
      songs: [{ id: '3', title: 'Favorite Song', artist: 'Favorite Artist' }]
    }
  ])

  const [availableSongs] = useState<Song[]>([
    { id: '1', title: 'Sample Song 1', artist: 'Artist 1' },
    { id: '2', title: 'Sample Song 2', artist: 'Artist 2' },
    { id: '3', title: 'Favorite Song', artist: 'Favorite Artist' },
    { id: '4', title: 'New Song', artist: 'New Artist' }
  ])

  const [isAdmin] = useState(true)
  const [currentUser] = useState('John Doe')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [playlistName, setPlaylistName] = useState('')
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPlaylist: Playlist = {
      id: editingPlaylist?.id || Date.now().toString(),
      name: playlistName,
      createdBy: editingPlaylist?.createdBy || currentUser,
      isPublic: editingPlaylist?.isPublic || isAdmin,
      songs: availableSongs.filter(song => selectedSongs.includes(song.id))
    }

    if (editingPlaylist) {
      setPlaylists(playlists.map(p => p.id === editingPlaylist.id ? newPlaylist : p))
    } else {
      setPlaylists([...playlists, newPlaylist])
    }

    setPlaylistName('')
    setSelectedSongs([])
    setEditingPlaylist(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (playlist: Playlist) => {
    if (playlist.createdBy !== currentUser && !isAdmin) return
    setEditingPlaylist(playlist)
    setPlaylistName(playlist.name)
    setSelectedSongs(playlist.songs.map(s => s.id))
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const playlist = playlists.find(p => p.id === id)
    if (playlist && (playlist.createdBy === currentUser || isAdmin)) {
      setPlaylists(playlists.filter(p => p.id !== id))
    }
  }

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    )
  }

  const canModify = (playlist: Playlist) => {
    return playlist.createdBy === currentUser || isAdmin
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Playlists</h1>
          <p className="text-muted-foreground mt-1">Discover and manage your music collections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPlaylist(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Select Songs</Label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2">
                  {availableSongs.map((song) => (
                    <div key={song.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSongs.includes(song.id)}
                        onChange={() => toggleSongSelection(song.id)}
                      />
                      <span className="text-sm">{song.title} - {song.artist}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingPlaylist ? 'Update Playlist' : 'Create Playlist'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              {selectedPlaylist?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPlaylist && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={selectedPlaylist.isPublic ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}>
                  {selectedPlaylist.isPublic ? <Users className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                  {selectedPlaylist.isPublic ? 'Public' : 'Private'}
                </Badge>
                <span className="text-muted-foreground">Created by {selectedPlaylist.createdBy}</span>
                <span className="text-muted-foreground">{selectedPlaylist.songs.length} songs</span>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Songs in this playlist</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedPlaylist.songs.map((song, index) => (
                    <div key={song.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <span className="w-6 text-sm text-muted-foreground">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Play All
                </Button>
                {canModify(selectedPlaylist) && (
                  <>
                    <Button variant="outline" onClick={() => {
                      handleEdit(selectedPlaylist)
                      setIsDetailsOpen(false)
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={() => {
                      handleDelete(selectedPlaylist.id)
                      setIsDetailsOpen(false)
                    }} className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => {
            setSelectedPlaylist(playlist)
            setIsDetailsOpen(true)
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative pb-2">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Music2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{playlist.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {playlist.createdBy}</p>
                  </div>
                </div>
                {playlist.isPublic ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                    <Users className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400">
                    <Lock className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Music2 className="w-4 h-4" />
                </div>
                <span className="font-medium">{playlist.songs.length} songs</span>
              </div>
              
              <div className="space-y-2 mb-6 max-h-24 overflow-y-auto">
                {playlist.songs.slice(0, 3).map((song) => (
                  <div key={song.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-medium truncate">{song.title}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground truncate">{song.artist}</span>
                  </div>
                ))}
                {playlist.songs.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-4">
                    +{playlist.songs.length - 3} more songs
                  </div>
                )}
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-md">
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                {canModify(playlist) && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(playlist)
                    }} className="hover:bg-blue-50 dark:hover:bg-blue-950">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(playlist.id)
                    }} className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}