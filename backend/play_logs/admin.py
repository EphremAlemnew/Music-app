from django.contrib import admin
from .models import PlayLog

@admin.register(PlayLog)
class PlayLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'played_at', 'ip_address')
    list_filter = ('played_at', 'song__genre')
    search_fields = ('user__username', 'song__title', 'song__artist')
    readonly_fields = ('played_at', 'ip_address', 'user_agent')
    date_hierarchy = 'played_at'
    
    fieldsets = (
        ('Play Information', {
            'fields': ('user', 'song', 'played_at')
        }),
        ('Technical Details', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
    )