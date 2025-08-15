from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from accounts.models import User
from songs.models import Song
from playlists.models import Playlist
from notifications.models import Notification

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')
        
        # Create users
        self.create_users()
        
        # Create songs
        self.create_songs()
        
        # Create playlists
        self.create_playlists()
        
        # Create notifications
        self.create_notifications()
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))

    def create_users(self):
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
            if created:
                self.stdout.write(f"Created user: {user.username}")

    def create_songs(self):
        admin_user = User.objects.filter(is_admin=True).first()
        
        songs_data = [
            {'title': 'Bohemian Rhapsody', 'artist': 'Queen', 'genre': 'rock'},
            {'title': 'Billie Jean', 'artist': 'Michael Jackson', 'genre': 'pop'},
            {'title': 'Take Five', 'artist': 'Dave Brubeck', 'genre': 'jazz'},
            {'title': 'Symphony No. 9', 'artist': 'Beethoven', 'genre': 'classical'},
            {'title': 'One More Time', 'artist': 'Daft Punk', 'genre': 'electronic'},
        ]
        
        for song_data in songs_data:
            song, created = Song.objects.get_or_create(
                title=song_data['title'],
                artist=song_data['artist'],
                defaults={
                    'genre': song_data['genre'],
                    'uploaded_by': admin_user,
                    'duration': 180
                }
            )
            if created:
                self.stdout.write(f"Created song: {song.title}")

    def create_playlists(self):
        users = User.objects.all()
        songs = Song.objects.all()
        
        if users.exists() and songs.exists():
            playlist, created = Playlist.objects.get_or_create(
                name='Rock Classics',
                created_by=users.first(),
                defaults={
                    'description': 'Best rock songs',
                    'is_public': True
                }
            )
            if created:
                rock_songs = songs.filter(genre='rock')
                playlist.songs.set(rock_songs)
                self.stdout.write(f"Created playlist: {playlist.name}")

    def create_notifications(self):
        users = User.objects.all()
        
        for user in users:
            notification, created = Notification.objects.get_or_create(
                user=user,
                title='Welcome to Music App!',
                defaults={
                    'message': 'Thanks for joining our music community!',
                    'notification_type': 'welcome'
                }
            )
            if created:
                self.stdout.write(f"Created notification for: {user.username}")