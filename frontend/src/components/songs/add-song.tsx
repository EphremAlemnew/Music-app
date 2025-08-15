"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  useCreateSongMutation,
  useUpdateSongMutation,
} from "@/_services/query/songs-query/songsQuery";

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

interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  audioFile?: File;
}

export default function SongsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const createSongMutation = useCreateSongMutation();
  const updateSongMutation = useUpdateSongMutation();

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
          id: Number(editingSong.id),
          data: {
            title: formData.title,
            artist: formData.artist,
            genre: formData.genre,
            description: formData.description,
          },
        });
      } else if (formData.audioFile) {
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

  return (
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
            disabled={
              createSongMutation.isPending || updateSongMutation.isPending
            }
          >
            {createSongMutation.isPending || updateSongMutation.isPending ? (
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
  );
}
