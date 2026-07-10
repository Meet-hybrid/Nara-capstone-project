from rest_framework import serializers
from .models import PotDisbursement


class PotDisbursementSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source="recipient.full_name", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = PotDisbursement
        fields = [
            "id", "group_name", "recipient_name", "amount", "month_year",
            "disbursement_date", "status", "bank_reference", "created_at",
        ]
