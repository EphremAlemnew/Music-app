from django.contrib import admin
from .models import Playlist, PlaylistSong

class PlaylistSongInline(admin.TabularInline):
    model = PlaylistSong
    extra = 0
    readonly_fields = ('added_at',)

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'is_public', 'song_count', 'created_at')
    list_filter = ('is_public', 'created_at', 'created_by')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PlaylistSongInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'created_by', 'is_public')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PlaylistSong)
class PlaylistSongAdmin(admin.ModelAdmin):
    list_display = ('playlist', 'song', 'order', 'added_at')
    list_filter = ('added_at', 'playlist')
    search_fields = ('playlist__name', 'song__title')