"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Edit,
  Trash2,
  Upload,
  Search,
  Music,
  Loader2,
} from "lucide-react";
import {
  useSongs,
  useCreateSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
} from "@/_services/query/songs-query/songsQuery";
import { useLogSongPlayMutation } from "@/_services/query/play-logs-query/playLogsQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playSong } from "@/store/slices/musicSlice";
import {
  FloatingPlayer,
  FloatingPlayerSong,
} from "@/components/music-player/floating-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  audioFile?: File;
}
// ...existing code...
export default function SongsPage() {
  const { user } = useAppSelector((state) => state.user);
  const isAdmin = user?.is_admin || false;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [songToDelete, setSongToDelete] = useState<any>(null);

  const { data: songsData, isLoading } = useSongs({
    search: searchTerm || undefined,
    ordering: "-created_at",
  });
  const createSongMutation = useCreateSongMutation();
  const updateSongMutation = useUpdateSongMutation();
  const deleteSongMutation = useDeleteSongMutation();
  const logPlayMutation = useLogSongPlayMutation();
  const dispatch = useAppDispatch();

  const songs = songsData?.results || [];
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    description: "",
    audioFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong && !formData.audioFile) return;

    try {
      if (editingSong) {
        await updateSongMutation.mutateAsync({
          id: editingSong.id,
          data: {
            title: formData.title,
            artist: formData.artist,
            genre: formData.genre,
            description: formData.description,
          }
        });
      } else {
        await createSongMutation.mutateAsync({
          title: formData.title,
          artist: formData.artist,
          genre: formData.genre,
          description: formData.description,
          audio_file: formData.audioFile,
        });
      }
      setFormData({
        title: "",
        artist: "",
        genre: "",
        description: "",
        audioFile: null,
      });
      setEditingSong(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save song:", error);
    }
  };

  const handleEdit = (song: any) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      description: song.description || "",
      audioFile: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (song: any) => {
    setSongToDelete(song);
  };

  const confirmDelete = () => {
    if (songToDelete) {
      deleteSongMutation.mutate(songToDelete.id);
      setSongToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
                <DialogTitle>
                  {editingSong ? "Edit Song" : "Add New Song"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    value={formData.artist}
                    onChange={(e) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) =>
                      setFormData({ ...formData, genre: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="hip_hop">Hip Hop</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="blues">Blues</SelectItem>
                      <SelectItem value="reggae">Reggae</SelectItem>
                      <SelectItem value="folk">Folk</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="audio">Audio File</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept=".mp3,.wav,.m4a,.ogg"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        audioFile: e.target.files?.[0] || null,
                      })
                    }
                    required={!editingSong}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: MP3, WAV, M4A, OGG
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createSongMutation.isPending || updateSongMutation.isPending}
                >
                  {(createSongMutation.isPending || updateSongMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : editingSong ? (
                    "Update Song"
                  ) : (
                    "Add Song"
                  )}
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
          {songs.length} songs found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song: any) => (
          <Card
            key={song.id}
            className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-purple-950/50 dark:via-gray-900 dark:to-pink-950/50 backdrop-blur-sm hover:scale-105"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEdit(song)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(song)}
                        disabled={deleteSongMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl font-bold truncate">
                {song.title}
              </CardTitle>
              <p className="text-muted-foreground font-medium">{song.artist}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                  {song.genre}
                </span>
              </div>
              {song.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {song.description}
                </p>
              )}
              {song.file_url ? (
                <Button
                  className="w-full mb-2"
                  variant="secondary"
                  onClick={() => {
                    // Log the play
                    logPlayMutation.mutate(song.id);
                    
                    dispatch(playSong({
                      id: song.id,
                      title: song.title,
                      artist: song.artist,
                      duration: song.duration || "",
                      file_url: song.file_url,
                    }));
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
              ) : (
                <Button disabled className="w-full" variant="outline">
                  No Audio File
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {songs.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No songs found</p>
        </div>
      )}



      <AlertDialog open={!!songToDelete} onOpenChange={() => setSongToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{songToDelete?.title}" by {songToDelete?.artist}? 
              This action cannot be undone and will permanently remove the song and its audio file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
