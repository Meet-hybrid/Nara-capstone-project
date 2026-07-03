from django.urls import path
from .views import JoinWaitlistView, WaitlistPositionView, LeaveWaitlistView

urlpatterns = [
    path("", JoinWaitlistView.as_view(), name="waitlist-join"),
    path("position/", WaitlistPositionView.as_view(), name="waitlist-position"),
    path("leave/", LeaveWaitlistView.as_view(), name="waitlist-leave"),
]
