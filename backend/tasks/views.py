# backend/tasks/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import DateField
from django.db.models.functions import Cast
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.order_by("-created_at")
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # optional: filter by query params
        date = self.request.query_params.get("date")
        if date:
            return qs.filter(task_date=date).order_by("-created_at")
        return qs

    @action(detail=False, methods=["get"])
    def dates(self, request):
        # return all distinct task_date values and a count per date
        qs = Task.objects.all().annotate(d=Cast("task_date", DateField()))
        dates = qs.values("task_date").order_by("-task_date").distinct()
        # add counts
        result = []
        from django.db.models import Count
        counts = qs.values("task_date").annotate(count=Count("id")).order_by("-task_date")
        for c in counts:
            result.append({"date": c["task_date"], "count": c["count"]})
        return Response(result)

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        task = self.get_object()
        task.is_done = not task.is_done
        task.save()
        return Response(self.get_serializer(task).data)
    
    
    @action(detail=False, methods=["get"])
    def daily(self, request):  # ✅ new endpoint
        qs = Task.objects.filter(is_daily=True).order_by("-created_at")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
