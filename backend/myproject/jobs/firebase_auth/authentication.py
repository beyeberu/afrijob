import firebase_admin
from firebase_admin import auth, credentials
from rest_framework import authentication, exceptions

# Initialize Firebase app only once
try:
    cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already exists, use the existing app
    pass

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
            
            # Here you can get or create a Django user if needed
            # For example:
            # user, created = User.objects.get_or_create(username=uid)
            # return (user, None)
            
            return (None, None)  # For now, just verify the token
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))