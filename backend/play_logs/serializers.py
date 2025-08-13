from rest_framework import serializers
from .models import PlayLog

class PlayLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    song_title = serializers.CharField(source='song.title', read_only=True)
    song_artist = serializers.CharField(source='song.artist', read_only=True)
    
    class Meta:
        model = PlayLog
        fields = [
            'id', 'user', 'user_name', 'song', 'song_title', 'song_artist',
            'played_at', 'ip_address'
        ]
        read_only_fields = ('id', 'played_at', 'ip_address')

class CreatePlayLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayLog
        fields = ['song']
    
    def create(self, validated_data):
        request = self.context['request']
        validated_data['user'] = request.user
        
        # Get IP address and user agent from request
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            validated_data['ip_address'] = x_forwarded_for.split(',')[0]
        else:
            validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
        
        validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        return super().create(validated_data)

class PlayLogListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    song_title = serializers.CharField(source='song.title', read_only=True)
    song_artist = serializers.CharField(source='song.artist', read_only=True)
    
    class Meta:
        model = PlayLog
        fields = [
            'id', 'user_name', 'song_title', 'song_artist', 'played_at'
        ]