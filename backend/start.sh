#!/bin/sh

echo "Waiting for PostgreSQL..."

# Wait for PostgreSQL using Python
python - <<END
import os, time, psycopg2
while True:
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get('DB_NAME', 'music_app'),
            user=os.environ.get('DB_USER', 'postgres'),
            password=os.environ.get('DB_PASSWORD', 'postgres'),
            host=os.environ.get('DB_HOST', 'db'),
            port=os.environ.get('DB_PORT', 5432)
        )
        conn.close()
        break
    except Exception:
        time.sleep(1)
END

echo "PostgreSQL started"

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
"

# Start Django server
python manage.py runserver 0.0.0.0:8000
