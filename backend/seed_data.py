import os
import django
from django.core.files.base import ContentFile
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_app.settings')
django.setup()

from accounts.models import User
from songs.models import Song
from playlists.models import Playlist
from notifications.models import Notification

def seed_users():
    """Create sample users"""
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@musicapp.com',
            'password': 'admin123',
            'first_name': 'Admin',
            'last_name': 'User',
            'user_type': 'admin',
            'is_admin': True
        },
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'user123',
            'first_name': 'John',
            'last_name': 'Doe',
            'user_type': 'regular'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'user123',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'user_type': 'regular'
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'password': make_password(user_data['password']),
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'user_type': user_data['user_type'],
                'is_admin': user_data.get('is_admin', False)
            }
        )
        created_users.append(user)
        if created:
            print(f"Created user: {user.username}")
        else:
            print(f"User already exists: {user.username}")
    
    return created_users

def seed_songs():
    """Create sample songs"""
    admin_user = User.objects.filter(is_admin=True).first()
    if not admin_user:
        print("No admin user found. Creating songs with first user.")
        admin_user = User.objects.first()
    
    songs_data = [
        {
            'title': 'Bohemian Rhapsody',
            'artist': 'Queen',
            'genre': 'rock',
            'description': 'A classic rock opera masterpiece'
        },
        {
            'title': 'Billie Jean',
            'artist': 'Michael Jackson',
            'genre': 'pop',
            'description': 'Iconic pop hit from the King of Pop'
        },
        {
            'title': 'Take Five',
            'artist': 'Dave Brubeck',
            'genre': 'jazz',
            'description': 'Famous jazz composition in 5/4 time'
        },
        {
            'title': 'Symphony No. 9',
            'artist': 'Ludwig van Beethoven',
            'genre': 'classical',
            'description': 'Beethoven\'s final complete symphony'
        },
        {
            'title': 'One More Time',
            'artist': 'Daft Punk',
            'genre': 'electronic',
            'description': 'Electronic dance music classic'
        },
        {
            'title': 'Sweet Child O\' Mine',
            'artist': 'Guns N\' Roses',
            'genre': 'rock',
            'description': 'Hard rock anthem with iconic guitar riff'
        },
        {
            'title': 'Thriller',
            'artist': 'Michael Jackson',
            'genre': 'pop',
            'description': 'Halloween-themed pop masterpiece'
        },
        {
            'title': 'Blue in Green',
            'artist': 'Miles Davis',
            'genre': 'jazz',
            'description': 'Contemplative jazz ballad'
        },
        {
            'title': 'Hotel California',
            'artist': 'Eagles',
            'genre': 'rock',
            'description': 'Classic rock song with mysterious lyrics'
        },
        {
            'title': 'Imagine',
            'artist': 'John Lennon',
            'genre': 'folk',
            'description': 'Peaceful anthem for unity and hope'
        }
    ]
    
    created_songs = []
    for song_data in songs_data:
        song, created = Song.objects.get_or_create(
            title=song_data['title'],
            artist=song_data['artist'],
            defaults={
                'genre': song_data['genre'],
                'description': song_data['description'],
                'uploaded_by': admin_user,
                'duration': 180  # 3 minutes default
            }
        )
        created_songs.append(song)
        if created:
            print(f"Created song: {song.title} by {song.artist}")
        else:
            print(f"Song already exists: {song.title}")
    
    return created_songs

def seed_playlists():
    """Create sample playlists"""
    users = User.objects.all()
    songs = Song.objects.all()
    
    if not users.exists() or not songs.exists():
        print("No users or songs found. Cannot create playlists.")
        return []
    
    playlists_data = [
        {
            'name': 'Rock Classics',
            'description': 'Best rock songs of all time',
            'is_public': True,
            'song_genres': ['rock']
        },
        {
            'name': 'Pop Hits',
            'description': 'Popular songs everyone loves',
            'is_public': True,
            'song_genres': ['pop']
        },
        {
            'name': 'Jazz Collection',
            'description': 'Smooth jazz for relaxation',
            'is_public': False,
            'song_genres': ['jazz']
        },
        {
            'name': 'Mixed Favorites',
            'description': 'My personal favorite songs',
            'is_public': False,
            'song_genres': ['rock', 'pop', 'folk']
        }
    ]
    
    created_playlists = []
    for i, playlist_data in enumerate(playlists_data):
        user = users[i % len(users)]  # Distribute playlists among users
        
        playlist, created = Playlist.objects.get_or_create(
            name=playlist_data['name'],
            created_by=user,
            defaults={
                'description': playlist_data['description'],
                'is_public': playlist_data['is_public']
            }
        )
        
        if created:
            # Add songs to playlist based on genre
            playlist_songs = songs.filter(genre__in=playlist_data['song_genres'])[:5]
            playlist.songs.set(playlist_songs)
            print(f"Created playlist: {playlist.name} with {playlist_songs.count()} songs")
        else:
            print(f"Playlist already exists: {playlist.name}")
        
        created_playlists.append(playlist)
    
    return created_playlists

def seed_notifications():
    """Create sample notifications"""
    users = User.objects.all()
    
    if not users.exists():
        print("No users found. Cannot create notifications.")
        return []
    
    notifications_data = [
        {
            'title': 'Welcome to Music App!',
            'message': 'Thanks for joining our music community. Start exploring songs and create your first playlist!',
            'notification_type': 'welcome'
        },
        {
            'title': 'New Song Added',
            'message': 'Bohemian Rhapsody by Queen has been added to the library',
            'notification_type': 'song_added'
        },
        {
            'title': 'Playlist Created',
            'message': 'Rock Classics playlist has been created and is now public',
            'notification_type': 'playlist_created'
        }
    ]
    
    created_notifications = []
    for notification_data in notifications_data:
        for user in users:
            notification, created = Notification.objects.get_or_create(
                user=user,
                title=notification_data['title'],
                defaults={
                    'message': notification_data['message'],
                    'notification_type': notification_data['notification_type']
                }
            )
            if created:
                created_notifications.append(notification)
    
    print(f"Created {len(created_notifications)} notifications")
    return created_notifications

def run_seed():
    """Run all seeding functions"""
    print("Starting database seeding...")
    
    print("\n1. Seeding users...")
    users = seed_users()
    
    print("\n2. Seeding songs...")
    songs = seed_songs()
    
    print("\n3. Seeding playlists...")
    playlists = seed_playlists()
    
    print("\n4. Seeding notifications...")
    notifications = seed_notifications()
    
    print(f"\nSeeding completed!")
    print(f"Created: {len(users)} users, {len(songs)} songs, {len(playlists)} playlists, {len(notifications)} notifications")

if __name__ == '__main__':
    run_seed()