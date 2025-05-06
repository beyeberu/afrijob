from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from firebase_admin import auth
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Count, Q
from .models import Job, JobCategory, FirebaseUser
from .serializers import JobSerializer, UserSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .authentication import FirebaseAuthentication

User = get_user_model()

class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().select_related(
        'employment_type', 
        'job_category', 
        'posted_by'
    ).order_by('-posted_on')
    
    serializer_class = JobSerializer
    pagination_class = JobPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = {
        'employment_type': ['exact'],
        'job_category': ['exact'],
        'posted_on': ['gte', 'lte', 'exact'],
        'expired_date': ['gte', 'lte', 'exact'],
        'min_salary': ['gte', 'lte', 'exact'],
        'max_salary': ['gte', 'lte', 'exact'],
    }
    
    search_fields = [
        'job_title', 
        'company_name',
        'location',
        'job_description',
        'responsibilities',
        'qualifications',
        'skills',
        'salary_and_benefits',
        'how_to_apply',
        'encourage_applicants',
        'phone_no',
        'email',
        'website'
    ]
    
    ordering_fields = [
        'posted_on', 
        'expired_date', 
        'min_salary', 
        'max_salary'
    ]
    
    authentication_classes = [FirebaseAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    @action(detail=False, methods=['get'])
    def active(self, request):
        today = timezone.localdate()
        queryset = self.filter_queryset(
            self.get_queryset().filter(
                posted_on__lte=today,
                expired_date__gte=today,
                status='active'
            )
        )
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Auto-set posted_on to current date if not provided
        if 'posted_on' not in serializer.validated_data:
            serializer.validated_data['posted_on'] = timezone.localdate()
            
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token(request):
    """
    Verifies a Firebase token and creates or updates a user in the database.
    """
    try:
        token = request.data['token']
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        user, created = User.objects.update_or_create(
            firebase_uid=uid,
            defaults={
                'email': decoded_token.get('email'),
                'first_name': decoded_token.get('name', '').split(' ')[0],
                'last_name': ' '.join(decoded_token.get('name', '').split(' ')[1:]) or '',
                'is_active': True
            }
        )
        
        return Response({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip(),
                'is_staff': user.is_staff,
                'is_new': created
            }
        })
        
    except KeyError:
        return Response({'success': False, 'error': 'Token required'}, status=400)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Returns statistics for the dashboard, including job counts, user counts,
    category distribution, and recent activity.
    """
    try:
        # Job statistics
        total_jobs = Job.objects.count()
        active_jobs = Job.objects.filter(status='active').count()
        draft_jobs = Job.objects.filter(status='draft').count()

        # User statistics
        total_users = FirebaseUser.objects.count()
        new_users = FirebaseUser.objects.filter(
            date_joined__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()

        # Category distribution
        categories = JobCategory.objects.annotate(
            job_count=Count('job')
        ).values('name', 'job_count')

        # Recent activity
        recent_jobs = Job.objects.order_by('-created_at')[:5]
        recent_users = FirebaseUser.objects.order_by('-date_joined')[:5]

        # Response data
        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'draft_jobs': draft_jobs,
            'total_users': total_users,
            'new_users': new_users,
            'categories': list(categories),
            'recent_jobs': JobSerializer(recent_jobs, many=True).data,
            'recent_users': UserSerializer(recent_users, many=True).data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)