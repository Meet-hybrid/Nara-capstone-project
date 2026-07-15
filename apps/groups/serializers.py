from rest_framework import serializers
from .models import SavingsGroup, GroupMembership
from apps.members.serializers import MemberProfileSerializer
from apps.contributions.models import Contribution


class GroupMemberContributionSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="member.full_name")
    email = serializers.CharField(source="member.email")
    contributions = serializers.SerializerMethodField()

    class Meta:
        model = GroupMembership
        fields = ["full_name", "email", "rotation_position", "has_collected", "contributions"]

    def get_contributions(self, obj):
        return list(
            Contribution.objects.filter(member=obj.member, group=obj.group)
            .values("month_year", "amount", "status", "deduction_date")
            .order_by("month_year")
        )


class SavingsGroupSerializer(serializers.ModelSerializer):
    monthly_pot = serializers.ReadOnlyField()
    current_collector_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = SavingsGroup
        fields = [
            "id", "name", "goal_type", "contribution_tier", "max_members",
            "current_cycle_month", "status", "reserve_fund", "monthly_pot",
            "current_collector_name", "member_count", "created_at",
        ]

    def get_current_collector_name(self, obj):
        collector = obj.current_collector
        return collector.full_name if collector else None

    def get_member_count(self, obj):
        return obj.members.count()
