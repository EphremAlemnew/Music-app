"use client";

import { useState, useEffect } from "react";
import { Play, Trash2, Search, Music, Loader2 } from "lucide-react";
import {
  useSongs,
  useDeleteSongMutation,
} from "@/_services/query/songs-query/songsQuery";
import { useLogSongPlayMutation } from "@/_services/query/play-logs-query/playLogsQuery";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { playSong } from "@/store/slices/musicSlice";
import { EditSong } from "@/components/songs/edit-song";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import AddSong from "@/components/songs/add-song";

interface SongData {
  id: number;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  duration?: number;
  file_url?: string;
}
// ...existing code...
export default function SongsPage() {
  const { user } = useAppSelector((state) => state.user);
  const isAdmin = user?.is_admin || false;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [songToDelete, setSongToDelete] = useState<SongData | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: songsData, isLoading } = useSongs({
    search: debouncedSearchTerm || undefined,
    ordering: "-created_at",
  });
  const deleteSongMutation = useDeleteSongMutation();
  const logPlayMutation = useLogSongPlayMutation();
  const dispatch = useAppDispatch();

  const songs = songsData?.results || [];

  const handleDelete = (song: SongData) => {
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
        {isAdmin && <AddSong />}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            key="search-input"
            placeholder="Search songs, artists, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {songs.length} songs found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song: SongData) => (
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
                      <EditSong song={song} />
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

                    dispatch(
                      playSong({
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        duration: song.duration?.toString() || "",
                        file_url: song.file_url,
                      })
                    );
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

      <AlertDialog
        open={!!songToDelete}
        onOpenChange={() => setSongToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{songToDelete?.title}&quot;
              by {songToDelete?.artist}? This action cannot be undone and will
              permanently remove the song and its audio file.
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
