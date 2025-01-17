from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from api.models import Event, EventSet
from rest_framework import status
from rest_framework.parsers import JSONParser

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET', 'POST'])
def events(request):
    if request.method == 'GET':
        events = Event.objects.all()
        data = [{
            "id": event.id,
            "name": event.name,
            "created_at": event.created_at,
            "last_modified": event.last_modified,
            "created_by": event.created_by.username,
            "comment": event.comment
        } for event in events]
        return Response(data)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        user = request.user
        event = Event.objects.create(
            name=data['name'],
            created_by=user,
            comment=data.get('comment', '')
        )

        if 'copy_from' in data and data['copy_from']:
            copy_from_event = EventSet.objects.filter(event_id=data['copy_from']).first()
            if copy_from_event:
                EventSet.objects.create(
                    event=event,
                    data=copy_from_event.data
                )
        else:
            EventSet.objects.create(event=event, data={})

        return Response({"message": "Event created successfully", "id": event.id}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT'])
def event_set(request, event_id):
    try:
        event_set = EventSet.objects.get(event_id=event_id)
    except EventSet.DoesNotExist:
        return Response({"error": "EventSet not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response({
            "id": event_set.id,
            "event": event_set.event.name,
            "data": event_set.data,
            "last_modified": event_set.last_modified
        })

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        event_set.data = data.get('data', event_set.data)
        event_set.save()
        return Response({"message": "EventSet updated successfully"})