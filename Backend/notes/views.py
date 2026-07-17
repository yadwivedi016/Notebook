from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import NotesSerializer,LabelSerializer
from .models import Notes,Label


class NotesView(ModelViewSet):
    queryset = Notes.objects.all()
    serializer_class =  NotesSerializer
    
class LabelView(ModelViewSet):
    queryset = Label.objects.all()
    serializer_class =  LabelSerializer