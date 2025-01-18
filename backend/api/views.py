from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from api.models import DataSet, ObjectInstance, ObjectTypeProperty, SubDataSource, DataSource
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
import json
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
def register_event(request):
    if request.method == 'GET':
        # Fetch all events
        events = SubDataSource.objects.all()
        data = [{
            "id": event.id,
            "sub_data_source_name": event.sub_data_source_name,
            "created_date": event.created_date,
            "modified_date": event.modified_date,
            #"created_by": User.username,
        } for event in events]
        return Response(data)

    elif request.method == 'POST':
        # Parse incoming data
        data = JSONParser().parse(request)
        user = request.user
        data_source, created = DataSource.objects.get_or_create(data_source_name="Events")
        # Create a new event
        event = SubDataSource.objects.create(
            data_source = data_source,
            sub_data_source_name=data['name'],
        )

        # Copy related DataSet if specified
        if 'copy_from' in data and data['copy_from']:
            copy_from_event_id = data['copy_from']
            data_sets_to_copy = DataSet.objects.filter(object_instance__id=copy_from_event_id)
            
            for data_set in data_sets_to_copy:
                DataSet.objects.create(
                    object_instance=data_set.object_instance,
                    object_type_property=data_set.object_type_property,
                    sub_data_source=data_set.sub_data_source,
                    alarm_enabled=data_set.alarm_enabled,
                    alarm_priority=data_set.alarm_priority,
                    log_alarm=data_set.log_alarm,
                    log_trigger_condition_change=data_set.log_trigger_condition_change
                )

        return Response({"message": "Event created successfully", "id": event.id}, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT'])
def dataset_by_sub_data_source(request, sub_data_source_id):
    print(sub_data_source_id)
    try:
        # Fetch the SubDataSource instance
        sub_data_source = SubDataSource.objects.get(id=sub_data_source_id)
    except SubDataSource.DoesNotExist:
        return Response(
            {"error": "SubDataSource not found."}, status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        # Filter DataSet by the given SubDataSource
        data_sets = DataSet.objects.filter(sub_data_source=sub_data_source)

        response_data = [
            {
                "id": data_set.id,
                "object_type": data_set.object_instance.object_type.object_type_name,
                "object_instance": data_set.object_instance.object_instance_name,
                "object_type_property": data_set.object_type_property.object_type_property_name,
                "sub_data_source": data_set.sub_data_source.sub_data_source_name,
            }
            for data_set in data_sets
        ]

        return Response(response_data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        try:
            # Parse the request body
            data = json.loads(request.body)

            for item in data:
                if "id" in item:  # Update existing DataSet
                    data_set = DataSet.objects.get(id=item["id"])
                    data_set.object_instance = ObjectInstance.objects.get(object_instance_name=item["object_instance"])
                    data_set.object_type_property = ObjectTypeProperty.objects.get(
                        object_type_property_name=item["object_type_property"]
                    )
                    data_set.save()
                else:  # Create new DataSet
                    DataSet.objects.create(
                        object_instance=ObjectInstance.objects.get(object_instance_name=item["object_instance"]),
                        object_type_property=ObjectTypeProperty.objects.get(
                            object_type_property_name=item["object_type_property"]
                        ),
                        sub_data_source=sub_data_source,  # Automatically associate with the provided SubDataSource
                    )

            return Response({"message": "DataSets updated/created successfully"}, status=status.HTTP_200_OK)

        except DataSet.DoesNotExist as e:
            return Response({"error": f"DataSet not found: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectInstance.DoesNotExist as e:
            return Response({"error": f"ObjectInstance not found: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectTypeProperty.DoesNotExist as e:
            return Response({"error": f"ObjectTypeProperty not found: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_sub_data_source(request, sub_data_source_id):
    try:
        event = SubDataSource.objects.get(id=sub_data_source_id)
        event.delete()
        return Response({"message": "Event deleted successfully."}, status=status.HTTP_200_OK)
    except SubDataSource.DoesNotExist:
        return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)