import uuid
from django.db import models


class SavingsGroup(models.Model):

    GOAL_CHOICES = [
        ("LAND", "Land"),
        ("CAR", "Car"),
        ("HOUSE", "House"),
        ("BUSINESS", "Business Capital"),
        ("SCHOOL_FEES", "School Fees"),
        ("FLEXIBLE", "Flexible"),
    ]

    STATUS_CHOICES = [
        ("FORMING", "Forming"),
        ("ACTIVE", "Active"),
        ("COMPLETE", "Complete"),
        ("SUSPENDED", "Suspended"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    goal_type = models.CharField(max_length=20, choices=GOAL_CHOICES)
    contribution_tier = models.DecimalField(max_digits=12, decimal_places=2)
    max_members = models.PositiveIntegerField(default=6)
    current_cycle_month = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="FORMING")
    reserve_fund = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    # Ordered list of member UUIDs (as strings) — determines who collects in which month
    rotation_order = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "savings_groups"

    @property
    def monthly_pot(self):
        return self.contribution_tier * self.members.count()

    @property
    def current_collector(self):
        if not self.rotation_order:
            return None
        idx = self.current_cycle_month - 1
        if idx < 0 or idx >= len(self.rotation_order):
            return None
        from apps.members.models import Member
        return Member.objects.filter(id=self.rotation_order[idx]).first()

    def __str__(self):
        return f"{self.name} — ₦{self.contribution_tier}/month"


class GroupMembership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(
        "members.Member",
        on_delete=models.PROTECT,
        related_name="memberships",
    )
    group = models.ForeignKey(
        SavingsGroup,
        on_delete=models.PROTECT,
        related_name="members",
    )
    rotation_position = models.PositiveIntegerField()
    has_collected = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "group_memberships"
        unique_together = ["member", "group"]
        ordering = ["rotation_position"]

    def __str__(self):
        return f"{self.member.full_name} in {self.group.name} (pos {self.rotation_position})"
