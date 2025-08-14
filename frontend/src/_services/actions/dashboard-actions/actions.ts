import axiosInstance from "../axiosInstance";

export interface DashboardStats {
  total_songs: number;
  total_playlists: number;
  total_users: number;
  plays_today: number;
  recent_plays: Array<{
    song_title: string;
    song_artist: string;
    played_at: string;
  }>;
  top_playlists: Array<{
    name: string;
    song_count: number;
  }>;
  genre_stats: Array<{
    genre: string;
    percentage: number;
  }>;
  recent_activity: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("dashboard/stats/");
  return response.data;
};
