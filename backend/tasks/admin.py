# backend/tasks/admin.py
from django.contrib import admin
from .models import Task, Category

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "task_date", "is_done", "created_at")
    list_filter = ("task_date", "is_done")
    search_fields = ("title", "details")

admin.site.register(Category)