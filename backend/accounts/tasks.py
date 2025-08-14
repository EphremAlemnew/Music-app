from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import escape
from .models import User

@shared_task
def send_welcome_email(user_id):
    try:
        user = User.objects.get(id=user_id)

        subject = "🎵 Welcome to Music Management App!"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [user.email]

        # Plain text fallback
        text_content = f"""
Hi {user.first_name or user.username},

Welcome to our Music Management App! 🎶

You have successfully registered as a {'Admin' if user.is_admin else 'Regular'} user.

{'As an admin, you can upload songs, create public playlists, and view all play logs.' if user.is_admin else 'As a regular user, you can create personal playlists, play songs, and view your play history.'}

Start exploring and enjoy your musical journey!

Best regards,
Music Management Team
"""

        # HTML version with styles
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #1db954; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0;">🎵 Welcome to Music Management App!</h1>
                </div>
                <div style="padding: 20px; color: #333;">
                    <p style="font-size: 16px;">Hi <strong>{escape(user.first_name or user.username)}</strong>,</p>
                    <p style="font-size: 16px;">Welcome to our <strong>Music Management App</strong>! We’re thrilled to have you on board. 🎶</p>
                    
                    <p style="font-size: 16px;">
                        You have successfully registered as a 
                        <span style="color: #1db954; font-weight: bold;">{'Admin' if user.is_admin else 'Regular'} user</span>.
                    </p>
                    
                    <p style="font-size: 15px;">
                        {'As an admin, you can <strong>upload songs</strong>, create <strong>public playlists</strong>, and view all <strong>play logs</strong>.' 
                        if user.is_admin 
                        else 'As a regular user, you can <strong>create personal playlists</strong>, play songs, and view your play history.'}
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://your-music-app.com" 
                           style="background-color: #1db954; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-size: 16px;">
                           🎧 Start Exploring
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #777;">Best regards,<br>Music Management Team</p>
                </div>
            </div>
        </body>
        </html>
        """

        # Send email with HTML + plain text fallback
        email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        email.attach_alternative(html_content, "text/html")
        email.send()

        return f"Welcome email sent to {user.email}"

    except User.DoesNotExist:
        return f"User with id {user_id} not found"
    except Exception as e:
        return f"Failed to send email: {str(e)}"
