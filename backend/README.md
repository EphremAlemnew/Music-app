# Music Management API

A comprehensive Django REST Framework backend for managing songs, playlists, and user interactions with role-based access control.

## Features

- **Authentication & User Management**
  - JWT-based authentication with SimpleJWT
  - Two user roles: Admin and Regular User
  - Welcome email notifications on registration

- **Songs Module**
  - Audio file upload and management
  - CRUD operations (Admin only)
  - Search and filter capabilities
  - Support for multiple audio formats

- **Playlist Module**
  - Public playlists (Admin created)
  - Personal playlists (User created)
  - Add/remove songs functionality
  - Playlist sharing and discovery

- **Play Log Tracking**
  - Automatic logging of song plays
  - User-specific and global statistics
  - Admin can view all logs, users see their own

- **Notifications System**
  - Email notifications via Celery
  - In-app notifications for playlist updates
  - Real-time notification management

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: SimpleJWT
- **Async Tasks**: Celery + Redis
- **API Documentation**: drf-spectacular
- **File Storage**: Django's built-in file handling

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Setup**
   - Create PostgreSQL database
   - Copy `.env.example` to `.env` and configure settings

3. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Redis** (for Celery)
   ```bash
   redis-server
   ```

6. **Start Celery Worker**
   ```bash
   python celery_worker.py worker --loglevel=info
   ```

7. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET/PUT /api/auth/profile/` - User profile

### Songs
- `GET /api/songs/` - List all songs
- `POST /api/songs/` - Upload song (Admin only)
- `GET /api/songs/{id}/` - Get song details
- `PUT/PATCH /api/songs/{id}/` - Update song (Admin only)
- `DELETE /api/songs/{id}/` - Delete song (Admin only)

### Playlists
- `GET /api/playlists/` - List playlists
- `POST /api/playlists/` - Create playlist
- `GET /api/playlists/{id}/` - Get playlist details
- `PUT/PATCH /api/playlists/{id}/` - Update playlist
- `DELETE /api/playlists/{id}/` - Delete playlist
- `POST /api/playlists/{id}/add_song/` - Add song to playlist
- `DELETE /api/playlists/{id}/remove_song/` - Remove song from playlist

### Play Logs
- `GET /api/play-logs/` - List play logs
- `POST /api/play-logs/` - Log a song play
- `GET /api/play-logs/my_stats/` - User's play statistics
- `GET /api/play-logs/global_stats/` - Global statistics (Admin only)

### Notifications
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/{id}/mark_read/` - Mark notification as read
- `POST /api/notifications/mark_all_read/` - Mark multiple notifications as read
- `GET /api/notifications/unread_count/` - Get unread count
- `DELETE /api/notifications/clear_all/` - Clear all notifications

## API Documentation

Visit `/api/docs/` for interactive Swagger documentation.

## Project Structure

```
music_app/
├── accounts/          # User management and authentication
├── songs/             # Song upload and management
├── playlists/         # Playlist functionality
├── play_logs/         # Play tracking and statistics
├── notifications/     # In-app notification system
├── music_app/         # Main project settings
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## Features in Detail

### Role-Based Access Control
- **Admin Users**: Can upload/edit/delete songs, create public playlists, view all play logs
- **Regular Users**: Can view songs, create personal playlists, view own play logs

### File Upload Security
- File type validation for audio files
- File size limits
- Secure file storage with proper paths

### Async Task Processing
- Welcome email sending via Celery
- Playlist update notifications
- Background task processing

### API Features
- Comprehensive filtering and search
- Pagination for large datasets
- Proper error handling and validation
- RESTful design patterns
- Extensive API documentation