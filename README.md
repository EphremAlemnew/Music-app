# 🎵 Music Management App

A full-stack music streaming and management application built with Django REST Framework and Next.js.

## 🚀 Features

### 🎧 Music Player

- **Audio streaming** with play/pause controls
- **Volume control** and progress tracking
- **Floating player** for continuous playback
- **Queue management** and playlist support

### 👥 User Management

- **JWT Authentication** with secure HttpOnly cookies
- **Role-based access** (Admin/Regular users)
- **User profiles** and account management
- **Email notifications** via Celery

### 🎵 Song Management

- **Upload songs** (Admin only) - MP3, WAV, M4A, OGG
- **Search and filter** by title, artist, genre
- **Genre categorization** (Rock, Pop, Jazz, Classical, etc.)
- **Play logging** and analytics

### 📋 Playlist Features

- **Create playlists** with custom songs
- **Public/Private** playlist visibility
- **Collaborative playlists** and sharing
- **Playlist management** and editing

### 🔔 Notifications

- **Real-time notifications** for new songs
- **Email alerts** for important events
- **Notification history** and management
- **Mark as read** functionality

### 📊 Analytics

- **Play logs** and listening history
- **Popular songs** tracking
- **User activity** monitoring
- **Admin dashboard** with insights

## 🛠️ Tech Stack

### Backend

- **Django 4.2** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Secure token-based auth
- **Celery** - Async task processing
- **Redis** - Message broker and caching
- **SQLite/PostgreSQL** - Database
- **Docker** - Containerization

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Axios** - HTTP client

## 🐳 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd Music-app
```

### 2. Start Services

```bash
cd frontend
docker-compose up --build
```

This starts:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Redis**: localhost:6379
- **PostgreSQL**: localhost:5432

### 3. Setup Database

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Seed sample data
docker-compose exec backend python manage.py seed_db
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/api/schema/swagger/
- **Admin Panel**: http://localhost:8000/admin/

## 👤 Default Accounts

After seeding, use these credentials:

**Admin Account**

- Email: `admin@musicapp.com`
- Password: `admin123`

**Regular Users**

- Email: `john@example.com` / Password: `user123`
- Email: `jane@example.com` / Password: `user123`

## 🔧 Development Setup

### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver

# Start Celery worker (separate terminal)
celery -A music_app worker -l info
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

## 📁 Project Structure

```
Demo/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication
│   ├── songs/              # Song management
│   ├── playlists/          # Playlist features
│   ├── play_logs/          # Analytics
│   ├── notifications/      # Notification system
│   ├── dashboard/          # Admin dashboard
│   └── music_app/          # Django settings
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── _services/     # API services
│   │   ├── store/         # Redux store
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
└── docker-compose.yml     # Multi-service setup
```

## 🔐 Security Features

- **JWT tokens** stored in memory (access) and HttpOnly cookies (refresh)
- **CORS protection** with specific allowed origins
- **Rate limiting** on authentication endpoints
- **Input validation** and sanitization
- **File upload restrictions** and validation
- **Permission-based access** control

## 🚀 Deployment

### Production Environment Variables

**Backend (.env)**

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DB_NAME=music_app_prod
DB_USER=postgres
DB_PASSWORD=secure-password
DB_HOST=db
REDIS_URL=redis://redis:6379
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_API_MEDIA_URL=https://your-api-domain.com
```

### Docker Production

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up --build -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

## 📚 API Documentation

Interactive API documentation available at:

- **Swagger UI**: http://localhost:8000/api/schema/swagger/
- **ReDoc**: http://localhost:8000/api/schema/redoc/

### Key Endpoints

- `POST /api/auth/login/` - User authentication
- `GET /api/songs/` - List songs
- `POST /api/songs/` - Upload song (Admin)
- `GET /api/playlists/` - List playlists
- `POST /api/playlists/` - Create playlist
- `GET /api/notifications/` - User notifications

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ using Django REST Framework and Next.js**
