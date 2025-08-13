from rest_framework import permissions

class IsOwnerOrAdminOrReadOnlyPublic(permissions.BasePermission):
    """
    Custom permission:
    - Admin users can read/write all playlists
    - Regular users can read public playlists and their own playlists
    - Regular users can only write to their own playlists
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_admin:
            return True
        
        # For read operations
        if request.method in permissions.SAFE_METHODS:
            # Can read public playlists or own playlists
            return obj.is_public or obj.created_by == request.user
        
        # For write operations (PUT, PATCH, DELETE)
        # Only the owner can modify their playlist
        return obj.created_by == request.user