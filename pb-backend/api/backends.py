from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Check if username is an email
            user = UserModel.objects.filter(email=username).first()
            if not user:
                 user = UserModel.objects.filter(username=username).first()
            
            if user and user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None
        return None
