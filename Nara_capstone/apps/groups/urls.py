from django.urls import path
from .views import MyGroupView, MyGroupMembersView, GroupDetailView, GroupListView

urlpatterns = [
    path("", GroupListView.as_view(), name="group-list"),
    path("my-group/", MyGroupView.as_view(), name="my-group"),
    path("my-group/members/", MyGroupMembersView.as_view(), name="my-group-members"),
    path("<uuid:group_id>/", GroupDetailView.as_view(), name="group-detail"),
]
