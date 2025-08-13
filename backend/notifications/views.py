from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.utils import timezone

from .models import Notification
from .serializers import (
    NotificationSerializer, 
    NotificationListSerializer,
    MarkAsReadSerializer
)

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        # Users can only see their own notifications
        return Notification.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark multiple or all notifications as read"""
        serializer = MarkAsReadSerializer(data=request.data)
        if serializer.is_valid():
            notification_ids = serializer.validated_data.get('notification_ids', [])
            
            queryset = self.get_queryset().filter(is_read=False)
            
            if notification_ids:
                queryset = queryset.filter(id__in=notification_ids)
            
            count = queryset.update(
                is_read=True,
                read_at=timezone.now()
            )
            
            return Response({
                'message': f'{count} notification(s) marked as read'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Delete all notifications for the current user"""
        count = self.get_queryset().count()
        self.get_queryset().delete()
        return Response({
            'message': f'{count} notification(s) deleted'
        })