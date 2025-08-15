"use client";

import { useState } from "react";
import { Play, Edit, Trash2, Music2, Loader2 } from "lucide-react";
import {
  usePlaylists,
  useDeletePlaylistMutation,
} from "@/_services/query/playlists-query/playlistsQuery";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { playPlaylist, playSong } from "@/store/slices/musicSlice";
import { useLogSongPlayMutation } from "@/_services/query/play-logs-query/playLogsQuery";
import { AddPlaylist } from "@/components/playlist/add-playlist";
import { EditPlaylist } from "@/components/playlist/edit-playlist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const deletePlaylistMutation = useDeletePlaylistMutation();

  const playlists = playlistsData?.results || [];

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const currentUser = user?.username || "";
  const logPlayMutation = useLogSongPlayMutation();

  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<PlaylistData | null>(
    null
  );

  const handleDelete = (playlist: PlaylistData) => {
    setPlaylistToDelete(playlist);
  };

  const confirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylistMutation.mutate(playlistToDelete.id);
      setPlaylistToDelete(null);
    }
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
        <AddPlaylist />
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
                    <EditPlaylist
                      playlist={selectedPlaylist}
                      trigger={
                        <Button
                          variant="outline"
                          onClick={() => setIsDetailsOpen(false)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      }
                    />
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
                    <EditPlaylist
                      playlist={playlist}
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      }
                    />
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
