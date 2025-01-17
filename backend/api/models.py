from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    last_modified = models.DateTimeField(auto_now=True)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class EventSet(models.Model):
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name="event_set")
    data = models.JSONField(default=dict)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"EventSet for {self.event.name}"