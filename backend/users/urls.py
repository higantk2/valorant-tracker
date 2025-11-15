from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
# UPDATED: Import the new views
from users.views import RegisterView, MyTokenObtainPairView, ProfileView, ChangePasswordView
# This view is not used here, it's handled by the 'favorites' app
# from users.views import FavoritesListCreate 

urlpatterns = [
    # ✅ Registration endpoint
    path("register/", RegisterView.as_view(), name="register"),

    # ✅ Login & JWT tokens
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ NEW: Profile endpoints
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),

    # ❗ This path is unused, as /api/favorites/ is handled by favorites.urls
    # path("favorites/", FavoritesListCreate.as_view(), name="favorites"),
]