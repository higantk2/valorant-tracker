from rest_framework import generics, permissions, status
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
# from .models import Favorite  # This is not needed, we'll use the favorites app

# NEW: Import from the favorites app to get the count
from favorites.models import Favorite 
# NEW: Import the new serializer
from .serializers import UserSerializer, ChangePasswordSerializer 

# ------------------------------
# User Serializer
# ------------------------------
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# ------------------------------
# Register View
# ------------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# ------------------------------
# JWT Login View (using SimpleJWT)
# ------------------------------
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims if needed
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ------------------------------
# NEW: Get User Profile View
# ------------------------------
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        favorites_count = Favorite.objects.filter(user=user).count()
        data = {
            'username': user.username,
            'favorites_count': favorites_count
        }
        return Response(data, status=status.HTTP_200_OK)

# ------------------------------
# NEW: Change Password View
# ------------------------------
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------------
# Unused Favorites API (Your app uses favorites.urls for this)
# ------------------------------
# class FavoriteSerializer(...)
# class FavoritesListCreate(...)