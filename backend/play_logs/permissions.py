from rest_framework import permissions

class IsOwnerOrAdminReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Admin users can read all play logs
    - Regular users can only read their own play logs
    - All users can create play logs (logging their song plays)
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin users can read all play logs
        if request.user.is_admin:
            return True
        
        # Regular users can only access their own play logs
        return obj.user == request.user