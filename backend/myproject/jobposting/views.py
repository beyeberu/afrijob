# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.utils import timezone
from .models import JobPost
from .serializers import JobPostSerializer

def get_csrf_token(request):
    """Endpoint to get CSRF token with proper cookie settings"""
    response = JsonResponse({'csrfToken': get_token(request)})
    response.set_cookie(
        'csrftoken',
        get_token(request),
        httponly=False,
        samesite='Lax',
        secure=request.is_secure()
    )
    return response

@method_decorator(ensure_csrf_cookie, name='dispatch')
class JobPostCreateView(generics.CreateAPIView):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            # Convert all errors to array format
            errors = {}
            for field, error_details in serializer.errors.items():
                if isinstance(error_details, list):
                    errors[field] = error_details
                else:
                    errors[field] = [str(error_details)]
            
            return Response({
                'status': 'error',
                'errors': errors,
                'message': 'Validation failed',
                'detail': 'Please check all fields'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            expired_date = serializer.validated_data.get('expired_date')
            job_status = 'Expired' if expired_date and expired_date < timezone.now().date() else 'Published'
            
            serializer.save(status=job_status)
            
            return Response({
                'status': 'success',
                'message': 'Job post created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': 'Server error occurred',
                'detail': str(e),
                'errors': {}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)