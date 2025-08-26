from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import RegisterView, MyTokenObtainPairView, FavoritesListCreate

urlpatterns = [
    # ✅ Registration endpoint
    path("register/", RegisterView.as_view(), name="register"),

    # ✅ Login & JWT tokens
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ Favorites endpoint
    path("favorites/", FavoritesListCreate.as_view(), name="favorites"),
]
