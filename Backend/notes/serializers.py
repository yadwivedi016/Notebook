from rest_framework import serializers
from .models import Notes, Label

class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ['id', 'title', 'content', 'type']

class LabelSerializer(serializers.ModelSerializer):
    # Explicitly telling DRF that notes expects a list of Primary Keys
    notes = serializers.PrimaryKeyRelatedField(many=True, queryset=Notes.objects.all(), required=False)

    class Meta:
        model = Label
        fields = ['id', 'name', 'notes']
