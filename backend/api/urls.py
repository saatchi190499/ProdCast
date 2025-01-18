from django.urls import path
from django.contrib import admin
from rest_framework_simplejwt.views import TokenRefreshView
from .views import login_user , dataset_by_sub_data_source, register_event, delete_sub_data_source
from .view.event import object_instances, object_type_properties, sub_data_sources, object_types

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('login/', login_user),
    path('events/', register_event),
    path('event-set/<int:sub_data_source_id>/', dataset_by_sub_data_source),
    path('event-delete/<int:sub_data_source_id>/', delete_sub_data_source),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 

    path('object-types/', object_types, name='object_types'),
    path('object-instances/', object_instances, name='object_instances'),
    path('object-type-properties/', object_type_properties, name='object_type_properties'),
    path('sub-data-sources/', sub_data_sources, name='sub_data_sources'),
]

