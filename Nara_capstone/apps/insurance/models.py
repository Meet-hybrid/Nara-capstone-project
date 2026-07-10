import uuid
from django.db import models
from apps.members.models import Member
from apps.groups.models import SavingsGroup


class InsuranceCover(models.Model):

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("CLAIMED", "Claimed"),
        ("EXPIRED", "Expired"),
        ("CANCELLED", "Cancelled"),
    ]

    CLAIM_STATUS_CHOICES = [
        ("NONE", "No Claim"),
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    CLAIM_REASON_CHOICES = [
        ("DEATH", "Death"),
        ("JOB_LOSS", "Job Loss"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.OneToOneField(Member, on_delete=models.PROTECT, related_name="insurance")
    group = models.ForeignKey(SavingsGroup, on_delete=models.PROTECT, related_name="insurance_covers")
    provider = models.CharField(max_length=100, default="AXA Mansard")
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)
    coverage_amount = models.DecimalField(max_digits=14, decimal_places=2)
    start_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ACTIVE")
    claim_status = models.CharField(max_length=20, choices=CLAIM_STATUS_CHOICES, default="NONE")
    claim_reason = models.CharField(max_length=20, choices=CLAIM_REASON_CHOICES, null=True, blank=True)
    claim_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "insurance_covers"

    def __str__(self):
        return f"{self.member.full_name} — {self.status}"
