from django.urls import path
from .onboarding_views import (
    SaveGoalView,
    SaveTierView,
    MatchGroupView,
    ConfirmGroupJoinView,
)

urlpatterns = [
    path("goal/", SaveGoalView.as_view(), name="onboarding-goal"),
    path("tier/", SaveTierView.as_view(), name="onboarding-tier"),
    path("match/", MatchGroupView.as_view(), name="onboarding-match"),
    path("confirm/", ConfirmGroupJoinView.as_view(), name="onboarding-confirm"),
]
