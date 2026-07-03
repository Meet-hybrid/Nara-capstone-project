import uuid
from django.db import models
from apps.members.models import Member


class Notification(models.Model):

    TYPE_CHOICES = [
        ("DEDUCTION", "Contribution Deducted"),
        ("GROUP_UPDATE", "Group Update"),
        ("POT_MONTH", "Pot Month"),
        ("INSURANCE", "Insurance Update"),
        ("SYSTEM", "System"),
    ]

    CHANNEL_CHOICES = [
        ("IN_APP", "In App"),
        ("SMS", "SMS"),
        ("WHATSAPP", "WhatsApp"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="notifications")
    notif_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=150)
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="IN_APP")

    class Meta:
        db_table = "notifications"
        ordering = ["-sent_at"]

    def __str__(self):
        return f"{self.recipient.full_name} — {self.title}"
