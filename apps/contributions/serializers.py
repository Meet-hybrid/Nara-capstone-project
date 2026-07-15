from rest_framework import serializers
from .models import Contribution


class ContributionSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.full_name", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Contribution
        fields = [
            "id", "member_name", "group_name", "amount", "month_year",
            "deduction_date", "status", "method", "transaction_ref", "created_at",
        ]
        read_only_fields = ["id", "status", "transaction_ref", "created_at"]


class ManualContributionSerializer(serializers.Serializer):
    group_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    month_year = serializers.CharField(max_length=7)
    deduction_date = serializers.DateField()
