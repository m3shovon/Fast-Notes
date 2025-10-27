from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import DateField, Count
from django.db.models.functions import Cast
from .models import Task, Category
from .serializers import TaskSerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.order_by("-created_at")
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get("date")
        category_id = self.request.query_params.get("category")
        priority = self.request.query_params.get("priority")

        if date:
            qs = qs.filter(task_date=date)
        if category_id:
            qs = qs.filter(category_id=category_id)
        if priority:
            qs = qs.filter(priority=priority)

        return qs.order_by("-created_at")

    @action(detail=False, methods=["get"])
    def dates(self, request):
        qs = Task.objects.annotate(d=Cast("task_date", DateField()))
        counts = qs.values("task_date").annotate(count=Count("id")).order_by("-task_date")
        result = [{"date": c["task_date"], "count": c["count"]} for c in counts]
        return Response(result)

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.is_done = not task.is_done
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=False, methods=["get"])
    def daily(self, request):
        qs = Task.objects.filter(is_daily=True).order_by("-created_at")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
