from django.db import models
from django.core.validators import FileExtensionValidator
import os

def song_upload_path(instance, filename):
    return f'songs/{instance.artist}/{filename}'

class Song(models.Model):
    GENRE_CHOICES = [
        ('rock', 'Rock'),
        ('pop', 'Pop'),
        ('jazz', 'Jazz'),
        ('classical', 'Classical'),
        ('electronic', 'Electronic'),
        ('hip_hop', 'Hip Hop'),
        ('country', 'Country'),
        ('blues', 'Blues'),
        ('reggae', 'Reggae'),
        ('folk', 'Folk'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=100)
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    description = models.TextField(blank=True, null=True)
    audio_file = models.FileField(
        upload_to=song_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'm4a', 'ogg'])]
    )
    duration = models.IntegerField(help_text="Duration in seconds", null=True, blank=True)
    file_size = models.BigIntegerField(help_text="File size in bytes", null=True, blank=True)
    uploaded_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='uploaded_songs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['artist']),
            models.Index(fields=['genre']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.artist}"
    
    def save(self, *args, **kwargs):
        if self.audio_file:
            self.file_size = self.audio_file.size
        super().save(*args, **kwargs)
    
    @property
    def file_url(self):
        if self.audio_file:
            return self.audio_file.url
        return None
    
    @property
    def filename(self):
        if self.audio_file:
            return os.path.basename(self.audio_file.name)
        return None