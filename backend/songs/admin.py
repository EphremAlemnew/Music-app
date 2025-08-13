from django.contrib import admin
from .models import Song

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'genre', 'uploaded_by', 'created_at')
    list_filter = ('genre', 'created_at', 'uploaded_by')
    search_fields = ('title', 'artist')
    readonly_fields = ('file_size', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'artist', 'genre', 'description')
        }),
        ('File Information', {
            'fields': ('audio_file', 'duration', 'file_size')
        }),
        ('Metadata', {
            'fields': ('uploaded_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )