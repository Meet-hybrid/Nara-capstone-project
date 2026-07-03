from django.urls import path
from .views import (
    ContributionListView,
    ContributionMonthDetailView,
    ManualContributionView,
    ContributionStatementView,
)

urlpatterns = [
    path("", ContributionListView.as_view(), name="contribution-list"),
    path("manual/", ManualContributionView.as_view(), name="contribution-manual"),
    path("statement/", ContributionStatementView.as_view(), name="contribution-statement"),
    path("<str:month_year>/", ContributionMonthDetailView.as_view(), name="contribution-month-detail"),
]
