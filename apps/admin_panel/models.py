import uuid
from django.db import models
from apps.members.models import Member


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # SET_NULL so audit records survive even if the member account is deleted
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, related_name="audit_logs")
    action = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action} — {self.member} — {self.timestamp}"
