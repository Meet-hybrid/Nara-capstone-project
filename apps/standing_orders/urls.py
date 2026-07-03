from django.urls import path
from .views import (
    CreateStandingOrderView,
    MyStandingOrderView,
    PauseStandingOrderView,
    ResumeStandingOrderView,
)

urlpatterns = [
    path("", CreateStandingOrderView.as_view(), name="standing-order-create"),
    path("me/", MyStandingOrderView.as_view(), name="standing-order-me"),
    path("me/pause/", PauseStandingOrderView.as_view(), name="standing-order-pause"),
    path("me/resume/", ResumeStandingOrderView.as_view(), name="standing-order-resume"),
]
