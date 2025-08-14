from django.db import models
from django.conf import settings

class Playlist(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='playlists'
    )
    songs = models.ManyToManyField(
        'songs.Song',
        through='PlaylistSong',
        related_name='playlists'
    )
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['created_by']),
            models.Index(fields=['is_public']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        from django.utils.html import escape
        return escape(f"{self.name} by {self.created_by.username}")
    
    @property
    def song_count(self):
        return self.songs.count()
    
    def save(self, *args, **kwargs):
        # Admin playlists are automatically public
        if self.created_by.is_admin:
            self.is_public = True
        super().save(*args, **kwargs)

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    song = models.ForeignKey('songs.Song', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'added_at']
        unique_together = ['playlist', 'song']
    
    def __str__(self):
        from django.utils.html import escape
        return escape(f"{self.song.title} in {self.playlist.name}")