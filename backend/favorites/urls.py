from django.urls import path
from .views import FavoriteListCreate, FavoriteDelete, MostFavoritedAgentsView # <-- ADD NEW VIEW

urlpatterns = [
    # NEW: Route for the Top Agents Leaderboard
    path("top/", MostFavoritedAgentsView.as_view(), name="most-favorited-agents"), 
    
    path("", FavoriteListCreate.as_view(), name="favorite-list-create"),
    path("<int:pk>/", FavoriteDelete.as_view(), name="favorite-delete"),
]