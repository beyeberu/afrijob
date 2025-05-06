import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from jobs.models import Job, FirebaseUser
from django.db.models import Count
from django.utils.timezone import now, timedelta

User = get_user_model()

class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Parse the token from the query string
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            # Close the connection if no token is provided
            await self.close()
            return

        try:
            # Validate the token
            UntypedToken(token)
            # Retrieve the user from the token
            self.user = User.objects.get(id=UntypedToken(token)['user_id'])
        except (AuthenticationFailed, User.DoesNotExist):
            # Close the connection if the token is invalid or the user does not exist
            await self.close()
            return

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Handle WebSocket disconnection
        pass

    async def send_dashboard_data(self):
        # Fetch dashboard stats
        total_jobs = Job.objects.count()
        active_jobs = Job.objects.filter(status='active').count()
        draft_jobs = Job.objects.filter(status='draft').count()
        total_users = FirebaseUser.objects.count()
        new_users = FirebaseUser.objects.filter(date_joined__gte=now() - timedelta(days=7)).count()

        categories = list(Job.objects.values('job_category__name').annotate(job_count=Count('id')))
        recent_jobs = list(Job.objects.order_by('-created_at')[:5].values('id', 'job_title', 'company_name'))
        recent_users = list(FirebaseUser.objects.order_by('-date_joined')[:5].values('id', 'email'))

        # Send data to WebSocket
        await self.send(text_data=json.dumps({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'draft_jobs': draft_jobs,
            'total_users': total_users,
            'new_users': new_users,
            'categories': categories,
            'recent_jobs': recent_jobs,
            'recent_users': recent_users,
        }))

    async def receive(self, text_data):
        # Handle incoming messages if needed
        await self.send_dashboard_data()