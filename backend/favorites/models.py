from django.db import models
from django.contrib.auth.models import User

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    agent_uuid = models.CharField(max_length=100)  # Valorant agent ID
    agent_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} - {self.agent_name}"
