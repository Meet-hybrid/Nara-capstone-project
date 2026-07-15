from rest_framework import serializers
from .models import Waitlist


class WaitlistSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.full_name", read_only=True)

    class Meta:
        model = Waitlist
        fields = [
            "id", "member_name", "goal_type", "contribution_tier",
            "joined_at", "priority", "status",
        ]
        read_only_fields = ["id", "joined_at", "priority", "status"]


class JoinWaitlistSerializer(serializers.Serializer):
    goal_type = serializers.ChoiceField(choices=["LAND", "CAR", "HOUSE", "BUSINESS", "SCHOOL_FEES", "FLEXIBLE"])
    contribution_tier = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate_contribution_tier(self, value):
        from utils.validators import validate_contribution_tier
        validate_contribution_tier(value)
        return value
