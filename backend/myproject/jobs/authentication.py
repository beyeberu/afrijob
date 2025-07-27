from rest_framework import authentication, exceptions
from firebase_admin import auth, credentials
from django.contrib.auth import get_user_model
from django.conf import settings
import firebase_admin

User = get_user_model()

# ✅ Move Firebase initialization here to guarantee it's ready when needed
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        raise exceptions.AuthenticationFailed(f"Firebase init failed: {str(e)}")


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Firebase.
    Validates Firebase ID tokens and retrieves or creates a user.
    """

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None  # No token provided

        id_token = auth_header.split('Bearer ')[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
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

            if user.password:
                user.set_unusable_password()
                user.save()

            return (user, None)

        except auth.InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid Firebase ID token.')
        except auth.ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase ID token has expired.')
        except auth.RevokedIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase ID token has been revoked.')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed: {str(e)}')
