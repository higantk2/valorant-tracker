from django.urls import path
from .views import (
    FavoriteListCreate, 
    FavoriteDelete, 
    MostFavoritedAgentsView, 
    UserFavoritesSearchView # <-- NEW
)

urlpatterns = [
    path("top/", MostFavoritedAgentsView.as_view(), name="most-favorited-agents"), 
    
    # NEW: Route for searching users
    path("search/", UserFavoritesSearchView.as_view(), name="search-favorites"),

    path("", FavoriteListCreate.as_view(), name="favorite-list-create"),
    path("<int:pk>/", FavoriteDelete.as_view(), name="favorite-delete"),
]