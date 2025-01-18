from django.db import models
from django.contrib.auth.models import User

class UnitCategory(models.Model):
    unit_category_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.unit_category_name

    class Meta:
        db_table = "UnitCategory" 
        ordering = ["-id"]

class UnitType(models.Model):
    unit_category = models.ForeignKey(UnitCategory, on_delete=models.CASCADE)
    unit_type_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.unit_type_name

    class Meta:
        db_table = "UnitType" 
        ordering = ["-id"]

class UnitDefinition(models.Model):
    unit_type = models.ForeignKey(UnitType, on_delete=models.CASCADE)
    unit_definition_name = models.CharField(max_length=255)
    scale_factor = models.FloatField()
    offset = models.FloatField()
    precision = models.IntegerField()
    alias_text = models.CharField(max_length=255)
    modified_date = models.DateTimeField(auto_now=True)
    calculation_method = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.unit_definition_name

    class Meta:
        db_table = "UnitDefinition" 
        ordering = ["-id"]

class ObjectType(models.Model):
    object_type_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.object_type_name

    class Meta:
        db_table = "ObjectType" 
        ordering = ["-id"]

class ObjectTypeProperty(models.Model):
    object_type = models.ForeignKey(ObjectType, on_delete=models.CASCADE)
    object_type_property_name = models.CharField(max_length=255)
    alarm_priority = models.IntegerField(null=True, blank=True)
    alarm_enabled = models.BooleanField(default=False)
    alarm_sounds_enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.object_type_property_name

    class Meta:
        db_table = "ObjectTypeProperty" 
        ordering = ["-id"]


class ObjectInstance(models.Model):
    object_type = models.ForeignKey(ObjectType, on_delete=models.CASCADE)
    object_instance_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.object_instance_name

    class Meta:
        db_table = "ObjectInstance" 
        ordering = ["-id"]


class DataSource(models.Model):
    data_source_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.data_source_name

    class Meta:
        db_table = "DataSource" 
        ordering = ["-id"]


class SubDataSource(models.Model):
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE)
    sub_data_source_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.sub_data_source_name

    class Meta:
        db_table = "SubDataSource" 
        ordering = ["-id"]


class DataSet(models.Model):
    object_instance = models.ForeignKey(ObjectInstance, on_delete=models.CASCADE)
    object_type_property = models.ForeignKey(ObjectTypeProperty, on_delete=models.CASCADE)
    sub_data_source = models.ForeignKey(SubDataSource, on_delete=models.CASCADE)
    alarm_enabled = models.BooleanField(default=False)
    alarm_priority = models.IntegerField(null=True, blank=True)
    log_alarm = models.BooleanField(default=False)
    log_trigger_condition_change = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"DataSet {self.id}"

    class Meta:
        db_table = "DataSet" 
        ordering = ["-id"]