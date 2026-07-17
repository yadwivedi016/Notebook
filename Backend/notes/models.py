from django.db import models

class Notes(models.Model):
    class NotesType(models.TextChoices):
        text = "Tx", "Text"
        list = "Li", "List"

    title = models.CharField(max_length=50)
    content = models.JSONField(default=dict)
    type = models.CharField(
        max_length=2,
        choices=NotesType.choices,
        default=NotesType.text
    )
    
    def __str__(self):
        return self.title
    
class Label(models.Model):
    # Added blank=True to make notes optional in forms/API
    notes = models.ManyToManyField(Notes, blank=True)
    name = models.CharField(max_length=50, blank=False)
