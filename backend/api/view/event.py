from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import ObjectType, ObjectInstance, ObjectTypeProperty, SubDataSource

@api_view(['GET'])
def object_instances(request):
    instances = ObjectInstance.objects.all()
    data = [{"object_instance_name": instance.object_instance_name} for instance in instances]
    return Response(data)

@api_view(['GET'])
def object_types(request):
    instances = ObjectType.objects.all()
    data = [{"object_type_name": instance.object_type_name} for instance in instances]
    return Response(data)

@api_view(['GET'])
def object_type_properties(request):
    properties = ObjectTypeProperty.objects.all()
    data = [{"object_type_property_name": prop.object_type_property_name} for prop in properties]
    return Response(data)

@api_view(['GET'])
def sub_data_sources(request):
    sources = SubDataSource.objects.all()
    data = [{"sub_data_source_name": source.sub_data_source_name} for source in sources]
    return Response(data)

