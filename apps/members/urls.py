from django.urls import path
from .views import (
    MemberProfileView,
    MemberDashboardView,
    MemberNotificationsView,
    MarkNotificationsReadView,
)

urlpatterns = [
    path("me/", MemberProfileView.as_view(), name="member-profile"),
    path("me/dashboard/", MemberDashboardView.as_view(), name="member-dashboard"),
    path("me/notifications/", MemberNotificationsView.as_view(), name="member-notifications"),
    path("me/notifications/read/", MarkNotificationsReadView.as_view(), name="member-notifications-read"),
]
