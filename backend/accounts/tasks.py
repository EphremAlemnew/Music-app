from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import User

@shared_task
def send_welcome_email(user_id):
    try:
        user = User.objects.get(id=user_id)
        subject = 'Welcome to Music Management App!'
        message = f"""
        Hi {user.first_name or user.username},
        
        Welcome to our Music Management App! 🎵
        
        You have successfully registered as a {'Admin' if user.is_admin else 'Regular'} user.
        
        {'As an admin, you can upload songs, create public playlists, and view all play logs.' if user.is_admin else 'As a regular user, you can create personal playlists, play songs, and view your play history.'}
        
        Start exploring and enjoy your musical journey!
        
        Best regards,
        Music Management Team
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return f"Welcome email sent to {user.email}"
    except User.DoesNotExist:
        return f"User with id {user_id} not found"
    except Exception as e:
        return f"Failed to send email: {str(e)}"