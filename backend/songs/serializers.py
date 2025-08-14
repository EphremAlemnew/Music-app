from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.ReadOnlyField()
    filename = serializers.ReadOnlyField()
    
    class Meta:
        model = Song
        fields = [
            'id', 'title', 'artist', 'genre', 'description',
            'audio_file', 'duration', 'file_size', 'uploaded_by',
            'uploaded_by_name', 'created_at', 'updated_at',
            'file_url', 'filename'
        ]
        read_only_fields = ('id', 'uploaded_by', 'file_size', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Don't allow changing the uploaded_by field
        validated_data.pop('uploaded_by', None)
        return super().update(instance, validated_data)

class SongListSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Song
        fields = [
            'id', 'title', 'artist', 'genre', 'description', 'duration',
            'uploaded_by_name', 'created_at', 'file_url'
        ]