from django.db import models


class Category(models.Model):
    """Task categories (e.g., Work, Personal, Study)"""
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(
        max_length=20, blank=True, null=True,
        help_text="Optional color tag for UI (e.g., #FF5733)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Urgent", "Urgent"),
    ]

    title = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    task_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_done = models.BooleanField(default=False)
    is_daily = models.BooleanField(default=False)

    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="tasks"
    )
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default="Medium"
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} [{self.priority}] - {self.task_date} - {'done' if self.is_done else 'open'}"
