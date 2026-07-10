import uuid
from django.db import models
from apps.members.models import Member
from apps.groups.models import SavingsGroup


class PotDisbursement(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSED", "Processed"),
        ("FAILED", "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group = models.ForeignKey(SavingsGroup, on_delete=models.PROTECT, related_name="disbursements")
    recipient = models.ForeignKey(Member, on_delete=models.PROTECT, related_name="disbursements")
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    month_year = models.CharField(max_length=7)
    disbursement_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    bank_reference = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pot_disbursements"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient.full_name} collected ₦{self.amount} — {self.month_year}"
