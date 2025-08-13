from celery import shared_task
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

@shared_task
def send_playlist_update_notification(playlist_id, message):
    """Send notification when a playlist is updated"""
    try:
        from playlists.models import Playlist
        playlist = Playlist.objects.get(id=playlist_id)
        
        # If it's a public playlist (admin created), notify all users
        if playlist.is_public:
            users = User.objects.filter(user_type='regular')
            notifications = []
            for user in users:
                notifications.append(
                    Notification(
                        user=user,
                        title='Playlist Updated',
                        message=message,
                        notification_type='playlist_update',
                        related_playlist=playlist
                    )
                )
            
            Notification.objects.bulk_create(notifications)
            return f"Notification sent to {len(notifications)} users about playlist update"
        else:
            # For private playlists, only notify the owner
            Notification.objects.create(
                user=playlist.created_by,
                title='Your Playlist Updated',
                message=message,
                notification_type='playlist_update',
                related_playlist=playlist
            )
            return "Notification sent to playlist owner"
            
    except Exception as e:
        return f"Failed to send playlist notification: {str(e)}"

@shared_task
def send_new_song_notification(song_id):
    """Send notification when a new song is added by admin"""
    try:
        from songs.models import Song
        song = Song.objects.get(id=song_id)
        
        # Only notify if song was uploaded by admin
        if song.uploaded_by.is_admin:
            users = User.objects.filter(user_type='regular')
            notifications = []
            
            for user in users:
                notifications.append(
                    Notification(
                        user=user,
                        title='New Song Available',
                        message=f"New song '{song.title}' by {song.artist} has been added to the library!",
                        notification_type='new_song',
                        related_song=song
                    )
                )
            
            Notification.objects.bulk_create(notifications)
            return f"New song notification sent to {len(notifications)} users"
        
        return "Song was not uploaded by admin, no notifications sent"
        
    except Exception as e:
        return f"Failed to send new song notification: {str(e)}"

@shared_task
def create_welcome_notification(user_id):
    """Create a welcome notification for new users"""
    try:
        user = User.objects.get(id=user_id)
        
        message = f"Welcome to Music Management App, {user.first_name or user.username}! "
        if user.is_admin:
            message += "As an admin, you can upload songs, create public playlists, and view all play logs."
        else:
            message += "Start exploring songs, create your own playlists, and enjoy your musical journey!"
        
        Notification.objects.create(
            user=user,
            title='Welcome to Music App!',
            message=message,
            notification_type='welcome'
        )
        
        return f"Welcome notification created for {user.username}"
        
    except Exception as e:
        return f"Failed to create welcome notification: {str(e)}"