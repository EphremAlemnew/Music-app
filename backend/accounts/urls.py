from django.urls import path
from . import views
from .refresh_view import refresh_token_view
views.refresh_token_view = refresh_token_view

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
]