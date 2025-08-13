from rest_framework import serializers
from .models import Playlist, PlaylistSong
from songs.serializers import SongListSerializer
from notifications.tasks import send_playlist_update_notification

class PlaylistSongSerializer(serializers.ModelSerializer):
    song = SongListSerializer(read_only=True)
    
    class Meta:
        model = PlaylistSong
        fields = ['song', 'order', 'added_at']

class PlaylistSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    song_count = serializers.ReadOnlyField()
    playlist_songs = PlaylistSongSerializer(source='playlistsong_set', many=True, read_only=True)
    
    class Meta:
        model = Playlist
        fields = [
            'id', 'name', 'description', 'created_by', 'created_by_name',
            'is_public', 'song_count', 'created_at', 'updated_at', 'playlist_songs'
        ]
        read_only_fields = ('id', 'created_by', 'is_public', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class PlaylistListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    song_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Playlist
        fields = [
            'id', 'name', 'description', 'created_by_name',
            'is_public', 'song_count', 'created_at', 'updated_at'
        ]

class AddSongToPlaylistSerializer(serializers.Serializer):
    song_id = serializers.IntegerField()
    order = serializers.IntegerField(required=False, default=0)
    
    def validate_song_id(self, value):
        from songs.models import Song
        if not Song.objects.filter(id=value).exists():
            raise serializers.ValidationError("Song does not exist")
        return value
    
    def create(self, validated_data):
        playlist = self.context['playlist']
        song_id = validated_data['song_id']
        order = validated_data.get('order', 0)
        
        from songs.models import Song
        song = Song.objects.get(id=song_id)
        
        playlist_song, created = PlaylistSong.objects.get_or_create(
            playlist=playlist,
            song=song,
            defaults={'order': order}
        )
        
        if created:
            # Send notification asynchronously
            send_playlist_update_notification.delay(
                playlist.id, 
                f"New song '{song.title}' added to playlist '{playlist.name}'"
            )
        
        return playlist_song

class RemoveSongFromPlaylistSerializer(serializers.Serializer):
    song_id = serializers.IntegerField()
    
    def validate_song_id(self, value):
        playlist = self.context['playlist']
        if not PlaylistSong.objects.filter(playlist=playlist, song_id=value).exists():
            raise serializers.ValidationError("Song is not in this playlist")
        return value