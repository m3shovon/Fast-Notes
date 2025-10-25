# backend/tasks/serializers.py
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "details", "task_date", "created_at", "is_done", "is_daily"]
        read_only_fields = ["id", "created_at"]
