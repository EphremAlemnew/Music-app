"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Edit,
  Trash2,
  Music2,
  Users,
  Lock,
  Loader2,
  Check,
} from "lucide-react";
import {
  usePlaylists,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
} from "@/_services/query/playlists-query/playlistsQuery";
import { useSongs } from "@/_services/query/songs-query/songsQuery";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { playPlaylist, playSong } from "@/store/slices/musicSlice";
import { useLogSongPlayMutation } from "@/_services/query/play-logs-query/playLogsQuery";
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "@/_services/actions/playlists-actions/actions";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Song {
  id: number;
  title: string;
  artist: string;
  duration?: number;
  file_url?: string;
}

interface PlaylistData {
  id: number;
  name: string;
  description?: string;
  created_by_name: string;
  is_public: boolean;
  song_count: number;
  songs?: Song[];
}

export default function PlaylistsPage() {
  const { data: playlistsData, isLoading } = usePlaylists({
    ordering: "-updated_at",
  });
  const createPlaylistMutation = useCreatePlaylistMutation();
  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();

  const playlists = playlistsData?.results || [];

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const currentUser = user?.username || "";
  const logPlayMutation = useLogSongPlayMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<PlaylistData | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);

  const { data: songsData } = useSongs();
  const availableSongs = songsData?.results || [];
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<PlaylistData | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPlaylist) {
        // Update playlist metadata
        await updatePlaylistMutation.mutateAsync({
          id: editingPlaylist.id,
          data: {
            name: formData.name,
            description: formData.description,
          },
        });

        // Update songs in playlist
        const currentSongIds =
          editingPlaylist.songs?.map((s: Song) => s.id) || [];
        const songsToAdd = selectedSongs.filter(
          (id) => !currentSongIds.includes(id)
        );
        const songsToRemove = currentSongIds.filter(
          (id: number) => !selectedSongs.includes(id)
        );

        // Add new songs sequentially
        for (let i = 0; i < songsToAdd.length; i++) {
          await addSongToPlaylist(editingPlaylist.id, songsToAdd[i]);
        }

        // Remove deselected songs sequentially
        for (let i = 0; i < songsToRemove.length; i++) {
          await removeSongFromPlaylist(editingPlaylist.id, songsToRemove[i]);
        }
      } else {
        await createPlaylistMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          song_ids: selectedSongs,
        });
      }
      setFormData({ name: "", description: "" });
      setSelectedSongs([]);
      setEditingPlaylist(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save playlist:", error);
    }
  };

  const handleEdit = (playlist: PlaylistData) => {
    if (playlist.created_by_name !== currentUser) return;
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description || "",
    });
    setSelectedSongs(playlist.songs?.map((s: Song) => s.id) || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (playlist: PlaylistData) => {
    setPlaylistToDelete(playlist);
  };

  const confirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylistMutation.mutate(playlistToDelete.id);
      setPlaylistToDelete(null);
    }
  };

  const toggleSongSelection = (songId: number) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const canModify = (playlist: PlaylistData) => {
    return playlist.created_by_name === currentUser;
  };

  const handlePlayPlaylist = (playlist: PlaylistData) => {
    if (playlist.songs && playlist.songs.length > 0) {
      // Log the first song play
      logPlayMutation.mutate(playlist.songs[0].id);

      // Convert playlist songs to the format expected by Redux
      const playlistSongs = playlist.songs.map((song: Song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration?.toString() || "",
        file_url: song.file_url,
      }));

      dispatch(playPlaylist(playlistSongs));
    }
  };

  const handlePlaySong = (song: Song) => {
    // Log the song play
    logPlayMutation.mutate(song.id);

    dispatch(
      playSong({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration?.toString() || "",
        file_url: song.file_url,
      })
    );
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
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Playlists
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and manage your music collections
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingPlaylist(null)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPlaylist ? "Edit Playlist" : "Create New Playlist"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Select Songs
                </Label>
                <div className="max-h-72 overflow-y-auto space-y-3">
                  {availableSongs.map((song: Song) => {
                    const isSelected = selectedSongs.includes(song.id);
                    return (
                      <div
                        key={song.id}
                        onClick={() => toggleSongSelection(song.id)}
                        className={`group relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-sm"
                            : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? "bg-gradient-to-br from-purple-500 to-blue-600"
                                : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-purple-400 group-hover:to-blue-500"
                            }`}
                          >
                            <Music2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {song.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {song.artist}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? "bg-purple-500"
                                : "bg-gray-200 dark:bg-gray-700 group-hover:bg-purple-200 dark:group-hover:bg-purple-800"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 group-hover:bg-purple-400 transition-colors" />
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-center">
                    {selectedSongs.length} of {availableSongs.length} songs
                    selected
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  createPlaylistMutation.isPending ||
                  updatePlaylistMutation.isPending
                }
              >
                {createPlaylistMutation.isPending ||
                updatePlaylistMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingPlaylist ? "Updating..." : "Creating..."}
                  </>
                ) : editingPlaylist ? (
                  "Update Playlist"
                ) : (
                  "Create Playlist"
                )}
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
                <span className="text-muted-foreground">
                  Created by {selectedPlaylist.created_by_name}
                </span>
                <span className="text-muted-foreground">
                  {selectedPlaylist.song_count} songs
                </span>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Songs in this playlist</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedPlaylist.songs &&
                  selectedPlaylist.songs.length > 0 ? (
                    selectedPlaylist.songs.map((song: Song, index: number) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="w-6 text-sm text-muted-foreground">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{song.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {song.artist}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlaySong(song)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No songs in this playlist yet
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => handlePlayPlaylist(selectedPlaylist)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play All
                </Button>
                {canModify(selectedPlaylist) && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEdit(selectedPlaylist);
                        setIsDetailsOpen(false);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDelete(selectedPlaylist);
                        setIsDetailsOpen(false);
                      }}
                      className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                    >
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
          <Card
            key={playlist.id}
            className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => {
              setSelectedPlaylist(playlist);
              setIsDetailsOpen(true);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative pb-2">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Music2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {playlist.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {playlist.created_by_name}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-0">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Music2 className="w-4 h-4" />
                </div>
                <span className="font-medium">{playlist.song_count} songs</span>
              </div>

              <div className="space-y-2 mb-6 max-h-24 overflow-y-auto">
                {playlist.songs && playlist.songs.length > 0 ? (
                  <>
                    {playlist.songs.slice(0, 3).map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="font-medium truncate">
                          {song.title}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground truncate">
                          {song.artist}
                        </span>
                      </div>
                    ))}
                    {playlist.songs.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-4">
                        +{playlist.songs.length - 3} more songs
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {playlist.description || "No songs in this playlist yet"}
                  </p>
                )}
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-md"
                  onClick={() => handlePlayPlaylist(playlist)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </Button>
                {canModify(playlist) && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(playlist);
                      }}
                      className="hover:bg-blue-50 dark:hover:bg-blue-950"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(playlist);
                      }}
                      className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!playlistToDelete}
        onOpenChange={() => setPlaylistToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{playlistToDelete?.name}
              &quot;? This action cannot be undone and will permanently remove
              the playlist and all its songs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
