from django.urls import path
from .views import login_user, events, event_set

urlpatterns = [
    path('login/', login_user),
    path('events/', events),
    path('event-set/<int:event_id>/', event_set),
]