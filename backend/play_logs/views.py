from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import PlayLog
from .serializers import PlayLogSerializer, CreatePlayLogSerializer, PlayLogListSerializer
from .permissions import IsOwnerOrAdminReadOnly

class PlayLogViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdminReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['song', 'user']
    ordering_fields = ['played_at']
    ordering = ['-played_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return PlayLog.objects.all().select_related('user', 'song')
        else:
            # Regular users can only see their own play logs
            return PlayLog.objects.filter(user=user).select_related('song')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreatePlayLogSerializer
        elif self.action == 'list':
            return PlayLogListSerializer
        return PlayLogSerializer
    
    def create(self, request, *args, **kwargs):
        """Log a song play"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            play_log = serializer.save()
            return Response({
                'id': play_log.id,
                'message': 'Song play logged successfully',
                'played_at': play_log.played_at
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        """Get current user's play statistics"""
        user = request.user
        queryset = PlayLog.objects.filter(user=user)
        
        # Total plays
        total_plays = queryset.count()
        
        # Plays this week
        week_ago = timezone.now() - timedelta(days=7)
        weekly_plays = queryset.filter(played_at__gte=week_ago).count()
        
        # Most played songs
        most_played = queryset.values(
            'song__title', 'song__artist'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:10]
        
        # Most played genres
        genre_stats = queryset.values(
            'song__genre'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:5]
        
        return Response({
            'total_plays': total_plays,
            'weekly_plays': weekly_plays,
            'most_played_songs': most_played,
            'genre_preferences': genre_stats
        })
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def global_stats(self, request):
        """Get global play statistics (Admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = PlayLog.objects.all()
        
        # Total plays
        total_plays = queryset.count()
        
        # Unique users who played songs
        unique_users = queryset.values('user').distinct().count()
        
        # Most played songs globally
        most_played_global = queryset.values(
            'song__title', 'song__artist'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:20]
        
        # Most active users
        most_active_users = queryset.values(
            'user__username'
        ).annotate(
            play_count=Count('id')
        ).order_by('-play_count')[:10]
        
        return Response({
            'total_plays': total_plays,
            'unique_users': unique_users,
            'most_played_songs': most_played_global,
            'most_active_users': most_active_users
        })