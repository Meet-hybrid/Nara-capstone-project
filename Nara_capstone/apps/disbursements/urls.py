from django.urls import path
from .views import DisbursementListView, ProcessDisbursementView

urlpatterns = [
    path("", DisbursementListView.as_view(), name="disbursement-list"),
    path("process/", ProcessDisbursementView.as_view(), name="disbursement-process"),
]
