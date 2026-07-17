from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import NotesView,LabelView

router = DefaultRouter()
router.register(r'notes',NotesView)
router.register(r'labels', LabelView)

urlpatterns = [
    path('',include(router.urls)),

]

