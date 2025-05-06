import firebase_admin
from firebase_admin import auth
from django.http import JsonResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization')  # Expecting token in the Authorization header

        if not token:
            raise AuthenticationFailed('Authorization header is expected.')

        try:
            # Remove the "Bearer " prefix if it exists
            token = token.replace('Bearer ', '')

            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']

            # You can create or fetch the user based on the UID here
            # For simplicity, you can set the user as the Firebase UID
            user = {
                'uid': uid,
                'email': decoded_token.get('email')
            }

            return (user, None)  # Return user, None (no additional authentication needed)

        except Exception as e:
            raise AuthenticationFailed('Invalid or expired Firebase token')

