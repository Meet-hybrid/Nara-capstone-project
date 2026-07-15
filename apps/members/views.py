from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from apps.contributions.models import Contribution
from apps.groups.models import GroupMembership
from utils.responses import success_response, error_response
from .serializers import MemberProfileSerializer, UpdateProfileSerializer


class MemberProfileView(APIView):

    def get(self, request):
        serializer = MemberProfileSerializer(request.user)
        return success_response("Profile retrieved.", data=serializer.data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("Update failed.", errors=serializer.errors)
        serializer.save()
        return success_response("Profile updated.", data=serializer.data)


class MemberDashboardView(APIView):

    def get(self, request):
        member = request.user

        membership = GroupMembership.objects.filter(
            member=member,
            group__status__in=["FORMING", "ACTIVE"],
        ).select_related("group").first()

        group_data = None
        if membership:
            group = membership.group
            total_contributed = Contribution.objects.filter(
                member=member,
                group=group,
                status="PROCESSED",
            ).count()

            group_data = {
                "group_name": group.name,
                "goal_type": group.goal_type,
                "contribution_tier": str(group.contribution_tier),
                "monthly_pot": str(group.monthly_pot),
                "current_cycle_month": group.current_cycle_month,
                "months_remaining": group.max_members - group.current_cycle_month,
                "rotation_position": membership.rotation_position,
                "has_collected": membership.has_collected,
                "total_months_contributed": total_contributed,
            }

        recent_contributions = Contribution.objects.filter(
            member=member,
        ).order_by("-created_at")[:5].values(
            "month_year", "amount", "status", "method", "created_at"
        )

        return success_response(
            "Dashboard data retrieved.",
            data={
                "group": group_data,
                "recent_activity": list(recent_contributions),
            },
        )


class MemberNotificationsView(APIView):

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return success_response("Notifications retrieved.", data=serializer.data)


class MarkNotificationsReadView(APIView):

    def patch(self, request):
        updated = Notification.objects.filter(
            recipient=request.user,
            is_read=False,
        ).update(is_read=True)
        return success_response(f"{updated} notification(s) marked as read.")
