import axiosInstance from "../axiosInstance";

export interface PlayLog {
  id: number;
  user_name: string;
  song_title: string;
  song_artist: string;
  played_at: string;
}

export const logSongPlay = async (songId: number): Promise<void> => {
  await axiosInstance.post("play-logs/", { song: songId });
};

export const getPlayLogs = async (params?: {
  song?: number;
  user?: number;
  ordering?: string;
}): Promise<{ results: PlayLog[]; count: number }> => {
  const response = await axiosInstance.get("play-logs/", { params });
  return response.data;
};
