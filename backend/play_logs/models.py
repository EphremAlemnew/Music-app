from django.db import models
from django.conf import settings

class PlayLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='play_logs'
    )
    song = models.ForeignKey(
        'songs.Song',
        on_delete=models.CASCADE,
        related_name='play_logs'
    )
    played_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-played_at']
        indexes = [
            models.Index(fields=['user', 'played_at']),
            models.Index(fields=['song', 'played_at']),
            models.Index(fields=['played_at']),
        ]
    
    def __str__(self):
        from django.utils.html import escape
        return escape(f"{self.user.username} played {self.song.title} at {self.played_at}")
    
    @classmethod
    def log_play(cls, user, song, request=None):
        """Helper method to log a song play"""
        ip_address = None
        user_agent = None
        
        if request:
            # Get IP address
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0]
            else:
                ip_address = request.META.get('REMOTE_ADDR')
            
            # Get user agent
            user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        return cls.objects.create(
            user=user,
            song=song,
            ip_address=ip_address,
            user_agent=user_agent
        )