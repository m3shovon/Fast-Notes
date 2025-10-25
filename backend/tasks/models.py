# backend/tasks/models.py
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    task_date = models.DateField()  
    created_at = models.DateTimeField(auto_now_add=True)
    is_done = models.BooleanField(default=False)
    is_daily = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.task_date} - {'done' if self.is_done else 'open'}"
