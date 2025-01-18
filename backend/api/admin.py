from django.contrib import admin
from .models import (
    UnitCategory,
    UnitType,
    UnitDefinition,
    ObjectType,
    ObjectTypeProperty,
    ObjectInstance,
    DataSource,
    SubDataSource,
    DataSet
)


@admin.register(UnitCategory)
class UnitCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "unit_category_name", "created_date", "modified_date")
    search_fields = ("unit_category_name",)
    ordering = ("-created_date",)


@admin.register(UnitType)
class UnitTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "unit_type_name", "unit_category", "created_date", "modified_date")
    search_fields = ("unit_type_name", "unit_category__unit_category_name")
    list_filter = ("unit_category",)
    ordering = ("-created_date",)


@admin.register(UnitDefinition)
class UnitDefinitionAdmin(admin.ModelAdmin):
    list_display = ("id", "unit_definition_name", "unit_type", "scale_factor", "offset", "precision")
    search_fields = ("unit_definition_name", "unit_type__unit_type_name")
    list_filter = ("unit_type",)
    ordering = ("-modified_date",)


@admin.register(ObjectType)
class ObjectTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "object_type_name", "description", "created_date", "modified_date")
    search_fields = ("object_type_name", "description")
    ordering = ("-created_date",)


@admin.register(ObjectTypeProperty)
class ObjectTypePropertyAdmin(admin.ModelAdmin):
    list_display = ("id", "object_type_property_name", "object_type", "alarm_priority", "alarm_enabled", "alarm_sounds_enabled")
    search_fields = ("object_type_property_name", "object_type__object_type_name")
    list_filter = ("object_type", "alarm_enabled", "alarm_sounds_enabled")
    ordering = ("-id",)


@admin.register(ObjectInstance)
class ObjectInstanceAdmin(admin.ModelAdmin):
    list_display = ("id", "object_instance_name", "object_type", "created_date", "modified_date")
    search_fields = ("object_instance_name", "object_type__object_type_name")
    list_filter = ("object_type",)
    ordering = ("-created_date",)


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ("id", "data_source_name", "created_date", "modified_date")
    search_fields = ("data_source_name",)
    ordering = ("-created_date",)


@admin.register(SubDataSource)
class SubDataSourceAdmin(admin.ModelAdmin):
    list_display = ("id", "sub_data_source_name", "data_source", "created_date", "modified_date")
    search_fields = ("sub_data_source_name", "data_source__data_source_name")
    list_filter = ("data_source",)
    ordering = ("-created_date",)


@admin.register(DataSet)
class DataSetAdmin(admin.ModelAdmin):
    list_display = ("id", "object_instance", "object_type_property", "sub_data_source", "alarm_enabled", "alarm_priority")
    search_fields = ("object_instance__object_instance_name", "object_type_property__object_type_property_name", "sub_data_source__sub_data_source_name")
    list_filter = ("alarm_enabled", "log_alarm", "log_trigger_condition_change")
    ordering = ("-created_date",)
