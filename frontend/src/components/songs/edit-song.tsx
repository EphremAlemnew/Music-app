"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2 } from "lucide-react";
import { useUpdateSongMutation } from "@/_services/query/songs-query/songsQuery";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SongData {
  id: number;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  duration?: number;
  file_url?: string;
}

interface EditSongProps {
  song: SongData;
  trigger?: React.ReactNode;
}

export function EditSong({ song, trigger }: EditSongProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateSongMutation = useUpdateSongMutation();

  const [formData, setFormData] = useState({
    title: song.title,
    artist: song.artist,
    genre: song.genre,
    description: song.description || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        description: song.description || "",
      });
    }
  }, [isOpen, song]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSongMutation.mutateAsync({
        id: song.id,
        data: {
          title: formData.title,
          artist: formData.artist,
          genre: formData.genre,
          description: formData.description,
        },
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update song:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="ghost">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
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
          <Button
            type="submit"
            className="w-full"
            disabled={updateSongMutation.isPending}
          >
            {updateSongMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Song"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}