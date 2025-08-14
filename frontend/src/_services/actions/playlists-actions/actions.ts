import axiosInstance from "../axiosInstance";

export interface PlaylistSong {
  id: number;
  title: string;
  artist: string;
  genre: string;
  duration?: number;
  file_url?: string;
  order: number;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  created_by_name: string;
  is_public: boolean;
  song_count: number;
  songs: PlaylistSong[];
  created_at: string;
  updated_at: string;
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
  song_ids?: number[];
}

export const getPlaylists = async (params?: {
  search?: string;
  is_public?: boolean;
  ordering?: string;
}): Promise<{ results: Playlist[]; count: number }> => {
  const response = await axiosInstance.get("playlists/", { params });
  return response.data;
};

export const getPlaylist = async (id: number): Promise<Playlist> => {
  const response = await axiosInstance.get(`playlists/${id}/`);
  return response.data;
};

export const createPlaylist = async (
  data: CreatePlaylistData
): Promise<Playlist> => {
  const { song_ids, ...playlistData } = data;
  const response = await axiosInstance.post("playlists/", playlistData);
  
  // Add songs to playlist if provided
  if (song_ids && song_ids.length > 0) {
    for (const songId of song_ids) {
      await addSongToPlaylist(response.data.id, songId);
    }
  }
  
  return response.data;
};

export const updatePlaylist = async (
  id: number,
  data: Partial<CreatePlaylistData>
): Promise<Playlist> => {
  const response = await axiosInstance.patch(`playlists/${id}/`, data);
  return response.data;
};

export const deletePlaylist = async (id: number): Promise<void> => {
  await axiosInstance.delete(`playlists/${id}/`);
};

export const addSongToPlaylist = async (
  playlistId: number,
  songId: number
): Promise<void> => {
  await axiosInstance.post(`playlists/${playlistId}/add_song/`, {
    song_id: songId,
  });
};

export const removeSongFromPlaylist = async (
  playlistId: number,
  songId: number
): Promise<void> => {
  await axiosInstance.delete(`playlists/${playlistId}/remove_song/`, {
    data: { song_id: songId },
  });
};
