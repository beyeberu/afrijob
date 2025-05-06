import firebase_admin
from firebase_admin import auth, credentials
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

# Initialize Firebase (call this from your settings.py)
def initialize_firebase():
    cred = credentials.Certificate('path/to/your-service-account-key.json')
    return firebase_admin.initialize_app(cred)

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            # Extract token from "Bearer <token>"
            token = auth_header.split(' ').pop()
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token.get('uid')
            
            # Get or create user
            user_model = get_user_model()
            user, created = user_model.objects.get_or_create(username=uid)
            
            # Update user data if newly created
            if created:
                user.email = decoded_token.get('email', '')
                user.first_name = decoded_token.get('name', '').split(' ')[0]
                user.set_unusable_password()  # No password needed for Firebase auth
                user.save()
                
            return (user, None)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))