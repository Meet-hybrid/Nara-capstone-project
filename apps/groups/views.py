from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

from apps.groups.models import SavingsGroup, GroupMembership
from utils.responses import success_response, error_response
from .serializers import SavingsGroupSerializer, GroupMemberContributionSerializer


class MyGroupView(APIView):

    def get(self, request):
        membership = GroupMembership.objects.filter(
            member=request.user,
            group__status__in=["FORMING", "ACTIVE"],
        ).select_related("group").first()

        if not membership:
            return error_response("You are not currently in an active group.", status_code=404)

        group = membership.group
        rotation = []
        for position, member_id in enumerate(group.rotation_order, start=1):
            from apps.members.models import Member
            member = Member.objects.filter(id=member_id).first()
            rotation.append({
                "position": position,
                "member_name": member.full_name if member else "Unknown",
                "is_current_collector": position == group.current_cycle_month,
            })

        serializer = SavingsGroupSerializer(group)
        return success_response(
            "Group retrieved.",
            data={
                **serializer.data,
                "rotation_schedule": rotation,
                "your_position": membership.rotation_position,
            },
        )


class MyGroupMembersView(APIView):

    def get(self, request):
        membership = GroupMembership.objects.filter(
            member=request.user,
            group__status__in=["FORMING", "ACTIVE"],
        ).select_related("group").first()

        if not membership:
            return error_response("You are not currently in an active group.", status_code=404)

        members = GroupMembership.objects.filter(
            group=membership.group,
        ).select_related("member")

        serializer = GroupMemberContributionSerializer(members, many=True)
        return success_response("Group members retrieved.", data=serializer.data)


class GroupDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, group_id):
        try:
            group = SavingsGroup.objects.get(id=group_id)
        except SavingsGroup.DoesNotExist:
            return error_response("Group not found.", status_code=404)
        serializer = SavingsGroupSerializer(group)
        return success_response("Group retrieved.", data=serializer.data)


class GroupListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        groups = SavingsGroup.objects.all().order_by("-created_at")
        serializer = SavingsGroupSerializer(groups, many=True)
        return success_response("Groups retrieved.", data=serializer.data)
