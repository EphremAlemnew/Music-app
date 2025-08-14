from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from songs.models import Song
from playlists.models import Playlist
from play_logs.models import PlayLog
from accounts.models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    
    # Basic counts
    total_songs = Song.objects.count()
    total_playlists = Playlist.objects.count()
    total_users = User.objects.count()
    
    # Plays today
    today = timezone.now().date()
    plays_today = PlayLog.objects.filter(played_at__date=today).count()
    
    # Recent plays (last 5)
    recent_plays = PlayLog.objects.select_related('song').order_by('-played_at')[:5]
    recent_plays_data = [
        {
            'song_title': play.song.title,
            'song_artist': play.song.artist,
            'played_at': play.played_at.isoformat()
        }
        for play in recent_plays
    ]
    
    # Top playlists by song count
    top_playlists = Playlist.objects.annotate(
        songs_count=Count('songs')
    ).order_by('-songs_count')[:5]
    
    top_playlists_data = [
        {
            'name': playlist.name,
            'song_count': playlist.songs_count
        }
        for playlist in top_playlists
    ]
    
    # Genre statistics
    genre_stats = Song.objects.values('genre').annotate(
        count=Count('id')
    ).order_by('-count')
    
    total_songs_for_percentage = Song.objects.count()
    genre_stats_data = []
    
    if total_songs_for_percentage > 0:
        for stat in genre_stats:
            percentage = (stat['count'] / total_songs_for_percentage) * 100
            genre_stats_data.append({
                'genre': stat['genre'],
                'percentage': round(percentage, 1)
            })
    
    # Recent activity (mix of plays, playlist creations, user joins)
    recent_activity = []
    
    # Add recent plays
    for play in recent_plays[:3]:
        recent_activity.append({
            'type': 'play',
            'title': 'Song played',
            'description': f'{play.song.title} by {play.song.artist}',
            'timestamp': play.played_at.isoformat()
        })
    
    # Add recent playlists
    recent_playlists = Playlist.objects.order_by('-created_at')[:2]
    for playlist in recent_playlists:
        recent_activity.append({
            'type': 'playlist',
            'title': 'Playlist created',
            'description': playlist.name,
            'timestamp': playlist.created_at.isoformat()
        })
    
    # Add recent users
    recent_users = User.objects.order_by('-date_joined')[:1]
    for user in recent_users:
        recent_activity.append({
            'type': 'user',
            'title': 'New user joined',
            'description': user.username,
            'timestamp': user.date_joined.isoformat()
        })
    
    # Sort by timestamp
    recent_activity.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return Response({
        'total_songs': total_songs,
        'total_playlists': total_playlists,
        'total_users': total_users,
        'plays_today': plays_today,
        'recent_plays': recent_plays_data,
        'top_playlists': top_playlists_data,
        'genre_stats': genre_stats_data,
        'recent_activity': recent_activity[:5]
    })