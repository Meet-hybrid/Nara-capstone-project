from django.urls import path
from .views import MyInsuranceCoverView, FileClaimView, ClaimStatusView

urlpatterns = [
    path("me/", MyInsuranceCoverView.as_view(), name="insurance-me"),
    path("claim/", FileClaimView.as_view(), name="insurance-claim"),
    path("claim/status/", ClaimStatusView.as_view(), name="insurance-claim-status"),
]
