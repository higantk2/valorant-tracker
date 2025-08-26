from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # All user-related endpoints (register, login/token, refresh, favorites)
    path("api/users/", include("users.urls")),

    # If you have a completely separate favorites app (not inside users)
    path("api/favorites/", include("favorites.urls")),
]
