from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count # <-- ADD THIS IMPORT
from .models import Favorite
from .serializers import FavoriteSerializer

class FavoriteListCreate(generics.ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteDelete(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

# ------------------------------
# NEW: View for Most Favorited Agents
# ------------------------------
class MostFavoritedAgentsView(APIView):
    # Allow unauthenticated users to view the public leader board
    permission_classes = [permissions.AllowAny] 

    def get(self, request, format=None):
        # Annotate each distinct agent_name with a count of favorites
        top_agents = Favorite.objects.values(
            'agent_name', 
            'agent_uuid'
        ).annotate(
            count=Count('agent_name')
        ).order_by('-count')[:10] # Sort by count descending and limit to top 10

        return Response(top_agents, status=status.HTTP_200_OK)