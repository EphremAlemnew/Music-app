"use client";

import { useState, useEffect } from "react";
import { Edit, Music2, Check, Loader2 } from "lucide-react";
import { useUpdatePlaylistMutation } from "@/_services/query/playlists-query/playlistsQuery";
import { useSongs } from "@/_services/query/songs-query/songsQuery";
import {
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "@/_services/actions/playlists-actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

interface EditPlaylistProps {
  playlist: PlaylistData;
  trigger?: React.ReactNode;
}

export function EditPlaylist({ playlist, trigger }: EditPlaylistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description || "",
  });
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);

  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const { data: songsData } = useSongs();
  const availableSongs = songsData?.results || [];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: playlist.name,
        description: playlist.description || "",
      });
      setSelectedSongs(playlist.songs?.map((s: Song) => s.id) || []);
    }
  }, [isOpen, playlist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update playlist metadata
      await updatePlaylistMutation.mutateAsync({
        id: playlist.id,
        data: {
          name: formData.name,
          description: formData.description,
        },
      });

      // Update songs in playlist
      const currentSongIds = playlist.songs?.map((s: Song) => s.id) || [];
      const songsToAdd = selectedSongs.filter(
        (id) => !currentSongIds.includes(id)
      );
      const songsToRemove = currentSongIds.filter(
        (id: number) => !selectedSongs.includes(id)
      );

      // Add new songs sequentially
      for (let i = 0; i < songsToAdd.length; i++) {
        await addSongToPlaylist(playlist.id, songsToAdd[i]);
      }

      // Remove deselected songs sequentially
      for (let i = 0; i < songsToRemove.length; i++) {
        await removeSongFromPlaylist(playlist.id, songsToRemove[i]);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  const toggleSongSelection = (songId: number) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Playlist</DialogTitle>
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
                {selectedSongs.length} of {availableSongs.length} songs selected
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updatePlaylistMutation.isPending}
          >
            {updatePlaylistMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Playlist"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}