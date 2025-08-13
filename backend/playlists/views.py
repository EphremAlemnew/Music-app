from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Playlist, PlaylistSong
from .serializers import (
    PlaylistSerializer, 
    PlaylistListSerializer,
    AddSongToPlaylistSerializer,
    RemoveSongFromPlaylistSerializer
)
from .permissions import IsOwnerOrAdminOrReadOnlyPublic

class PlaylistViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdminOrReadOnlyPublic]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_public', 'created_by']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Playlist.objects.all()
        else:
            # Regular users can see public playlists and their own playlists
            return Playlist.objects.filter(
                Q(is_public=True) | Q(created_by=user)
            )
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PlaylistListSerializer
        return PlaylistSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_song(self, request, pk=None):
        """Add a song to the playlist"""
        playlist = self.get_object()
        serializer = AddSongToPlaylistSerializer(
            data=request.data,
            context={'playlist': playlist}
        )
        if serializer.is_valid():
            playlist_song = serializer.save()
            return Response({
                'message': 'Song added to playlist successfully',
                'song': playlist_song.song.title
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def remove_song(self, request, pk=None):
        """Remove a song from the playlist"""
        playlist = self.get_object()
        serializer = RemoveSongFromPlaylistSerializer(
            data=request.data,
            context={'playlist': playlist}
        )
        if serializer.is_valid():
            song_id = serializer.validated_data['song_id']
            PlaylistSong.objects.filter(playlist=playlist, song_id=song_id).delete()
            return Response({
                'message': 'Song removed from playlist successfully'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        """Get all songs in the playlist"""
        playlist = self.get_object()
        playlist_songs = PlaylistSong.objects.filter(playlist=playlist).select_related('song')
        songs_data = []
        for ps in playlist_songs:
            songs_data.append({
                'id': ps.song.id,
                'title': ps.song.title,
                'artist': ps.song.artist,
                'genre': ps.song.genre,
                'duration': ps.song.duration,
                'order': ps.order,
                'added_at': ps.added_at
            })
        return Response(songs_data)