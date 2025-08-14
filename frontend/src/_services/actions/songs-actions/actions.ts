import axiosInstance from "../axiosInstance";

export interface Song {
  id: number;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  duration?: number;
  uploaded_by_name: string;
  created_at: string;
  file_url?: string;
  filename?: string;
}

export interface CreateSongData {
  title: string;
  artist: string;
  genre: string;
  description?: string;
  audio_file: File;
}

export const getSongs = async (params?: {
  search?: string;
  genre?: string;
  artist?: string;
  ordering?: string;
}): Promise<{ results: Song[]; count: number }> => {
  const response = await axiosInstance.get("songs/", { params });
  return response.data;
};

export const getSong = async (id: number): Promise<Song> => {
  const response = await axiosInstance.get(`songs/${id}/`);
  return response.data;
};

export const createSong = async (data: CreateSongData): Promise<Song> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("artist", data.artist);
  formData.append("genre", data.genre);
  if (data.description) formData.append("description", data.description);
  formData.append("audio_file", data.audio_file);

  const response = await axiosInstance.post("songs/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateSong = async (id: number, data: Partial<CreateSongData>): Promise<Song> => {
  const response = await axiosInstance.patch(`songs/${id}/`, data)
  return response.data
}

export const deleteSong = async (id: number): Promise<void> => {
  await axiosInstance.delete(`songs/${id}/`);
};
