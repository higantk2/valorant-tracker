from django.urls import path
from .views import FavoriteListCreate, FavoriteDelete

urlpatterns = [
    path("", FavoriteListCreate.as_view(), name="favorite-list-create"),
    path("<int:pk>/", FavoriteDelete.as_view(), name="favorite-delete"),
]
