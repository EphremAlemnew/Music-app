from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    related_playlist_name = serializers.CharField(
        source='related_playlist.name', 
        read_only=True
    )
    related_song_title = serializers.CharField(
        source='related_song.title', 
        read_only=True
    )
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'is_read',
            'created_at', 'read_at', 'related_playlist', 'related_playlist_name',
            'related_song', 'related_song_title'
        ]
        read_only_fields = (
            'id', 'created_at', 'read_at', 'related_playlist_name', 
            'related_song_title'
        )

class NotificationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 
            'is_read', 'created_at'
        ]

class MarkAsReadSerializer(serializers.Serializer):
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of notification IDs to mark as read. If empty, marks all as read."
    )