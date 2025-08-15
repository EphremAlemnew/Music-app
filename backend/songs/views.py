from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Song
from .serializers import SongSerializer, SongListSerializer
from .permissions import IsAdminOrReadOnly
from notifications.models import Notification
from accounts.models import User

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['genre', 'artist']
    search_fields = ['title', 'artist', 'genre']
    ordering_fields = ['created_at', 'title', 'artist']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SongListSerializer
        return SongSerializer
    
    def perform_create(self, serializer):
        song = serializer.save(uploaded_by=self.request.user)
        
        # Create notifications for all users except the uploader
        users_to_notify = User.objects.exclude(id=self.request.user.id)
        notifications = [
            Notification(
                user=user,
                title="New Song Added",
                message=f"'{song.title}' by {song.artist} has been added to the library",
                notification_type="song_added"
            )
            for user in users_to_notify
        ]
        Notification.objects.bulk_create(notifications)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download song file"""
        song = self.get_object()
        if song.audio_file:
            response = Response({
                'download_url': song.file_url,
                'filename': song.filename
            })
            return response
        return Response(
            {'error': 'Audio file not found'},
            status=status.HTTP_404_NOT_FOUND
        )