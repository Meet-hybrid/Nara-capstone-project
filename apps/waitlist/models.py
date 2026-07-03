import uuid
from django.db import models
from apps.members.models import Member


class Waitlist(models.Model):

    STATUS_CHOICES = [
        ("WAITING", "Waiting"),
        ("PROMOTED", "Promoted to Group"),
        ("CANCELLED", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="waitlist_entries")
    goal_type = models.CharField(max_length=20)
    contribution_tier = models.DecimalField(max_digits=12, decimal_places=2)
    joined_at = models.DateTimeField(auto_now_add=True)
    priority = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="WAITING")

    class Meta:
        db_table = "waitlist"
        ordering = ["priority"]

    def __str__(self):
        return f"{self.member.full_name} — waiting for {self.goal_type} group at ₦{self.contribution_tier}"
