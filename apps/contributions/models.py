import uuid
from django.db import models
from apps.members.models import Member
from apps.groups.models import SavingsGroup


class Contribution(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSED", "Processed"),
        ("FAILED", "Failed"),
        ("REVERSED", "Reversed"),
    ]

    METHOD_CHOICES = [
        ("STANDING_ORDER", "Standing Order"),
        ("MANUAL", "Manual"),
        ("USSD", "USSD"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, related_name="contributions")
    group = models.ForeignKey(SavingsGroup, on_delete=models.PROTECT, related_name="contributions")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month_year = models.CharField(max_length=7)  # Format: YYYY-MM e.g. 2025-06
    deduction_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    transaction_ref = models.CharField(max_length=100, blank=True, null=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default="STANDING_ORDER")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contributions"
        unique_together = ["member", "group", "month_year"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.member.full_name} — {self.month_year} — {self.status}"
