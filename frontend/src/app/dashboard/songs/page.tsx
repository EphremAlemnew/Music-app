'use client'

import { useState } from 'react'
import { Plus, Play, Edit, Trash2, Upload, Search, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  description?: string
  audioFile?: File
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([
    { id: '1', title: 'Sample Song', artist: 'Sample Artist', genre: 'Pop' },
    { id: '2', title: 'Rock Anthem', artist: 'Rock Band', genre: 'Rock' },
    { id: '3', title: 'Jazz Blues', artist: 'Jazz Master', genre: 'Jazz' }
  ])
  const [isAdmin] = useState(true) // Mock admin status
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    audioFile: null as File | null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSong: Song = {
      id: editingSong?.id || Date.now().toString(),
      title: formData.title,
      artist: formData.artist,
      genre: formData.genre,
      description: formData.description,
      audioFile: formData.audioFile || undefined
    }

    if (editingSong) {
      setSongs(songs.map(s => s.id === editingSong.id ? newSong : s))
    } else {
      setSongs([...songs, newSong])
    }

    setFormData({ title: '', artist: '', genre: '', description: '', audioFile: null })
    setEditingSong(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (song: Song) => {
    setEditingSong(song)
    setFormData({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      description: song.description || '',
      audioFile: null
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSongs(songs.filter(s => s.id !== id))
  }

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Songs</h1>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSong(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Song
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingSong ? 'Edit Song' : 'Add New Song'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) => setFormData({...formData, artist: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="audio">Audio File</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFormData({...formData, audioFile: e.target.files?.[0] || null})}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingSong ? 'Update Song' : 'Add Song'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search songs, artists, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredSongs.length} songs found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => (
          <Card key={song.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-purple-950/50 dark:via-gray-900 dark:to-pink-950/50 backdrop-blur-sm hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  {isAdmin && (
                    <>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEdit(song)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(song.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl font-bold truncate">{song.title}</CardTitle>
              <p className="text-muted-foreground font-medium">{song.artist}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                  {song.genre}
                </span>
              </div>
              {song.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{song.description}</p>
              )}
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium">
                <Play className="w-4 h-4 mr-2" />
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSongs.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No songs found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}