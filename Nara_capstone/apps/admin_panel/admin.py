from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.members.models import Member
from apps.groups.models import SavingsGroup, GroupMembership
from apps.contributions.models import Contribution
from apps.standing_orders.models import StandingOrder
from apps.disbursements.models import PotDisbursement
from apps.insurance.models import InsuranceCover
from apps.waitlist.models import Waitlist
from apps.notifications.models import Notification
from apps.admin_panel.models import AuditLog


@admin.register(Member)
class MemberAdmin(UserAdmin):
    list_display = ["full_name", "email", "phone", "status", "is_verified", "joined_at"]
    list_filter = ["status", "is_verified", "savings_goal"]
    search_fields = ["full_name", "email", "phone"]
    ordering = ["-joined_at"]
    readonly_fields = ["id", "joined_at"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone", "bank_name", "account_number")}),
        ("Savings Profile", {"fields": ("monthly_income", "contribution_tier", "savings_goal")}),
        ("Status", {"fields": ("status", "is_verified", "is_active", "is_staff", "is_superuser")}),
        ("Timestamps", {"fields": ("joined_at",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "phone", "password1", "password2"),
        }),
    )


@admin.register(SavingsGroup)
class SavingsGroupAdmin(admin.ModelAdmin):
    list_display = ["name", "goal_type", "contribution_tier", "status", "current_cycle_month", "created_at"]
    list_filter = ["status", "goal_type"]
    search_fields = ["name"]
    readonly_fields = ["id", "created_at"]


@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ["member", "group", "rotation_position", "has_collected", "joined_at"]
    list_filter = ["has_collected"]
    search_fields = ["member__full_name", "group__name"]


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ["member", "group", "amount", "month_year", "status", "method", "created_at"]
    list_filter = ["status", "method"]
    search_fields = ["member__full_name", "transaction_ref"]
    readonly_fields = ["id", "created_at"]


@admin.register(StandingOrder)
class StandingOrderAdmin(admin.ModelAdmin):
    list_display = ["member", "amount", "deduction_day", "status", "activation_date"]
    list_filter = ["status"]
    search_fields = ["member__full_name"]


@admin.register(PotDisbursement)
class PotDisbursementAdmin(admin.ModelAdmin):
    list_display = ["recipient", "group", "amount", "month_year", "status", "disbursement_date"]
    list_filter = ["status"]
    search_fields = ["recipient__full_name", "bank_reference"]
    readonly_fields = ["id", "created_at"]


@admin.register(InsuranceCover)
class InsuranceCoverAdmin(admin.ModelAdmin):
    list_display = ["member", "group", "status", "claim_status", "claim_reason", "start_date"]
    list_filter = ["status", "claim_status"]
    search_fields = ["member__full_name"]


@admin.register(Waitlist)
class WaitlistAdmin(admin.ModelAdmin):
    list_display = ["member", "goal_type", "contribution_tier", "priority", "status", "joined_at"]
    list_filter = ["status", "goal_type"]
    search_fields = ["member__full_name"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["recipient", "notif_type", "title", "channel", "is_read", "sent_at"]
    list_filter = ["notif_type", "channel", "is_read"]
    search_fields = ["recipient__full_name", "title"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["action", "member", "amount", "ip_address", "timestamp"]
    list_filter = ["action"]
    search_fields = ["member__full_name", "action", "description"]
    readonly_fields = ["id", "timestamp"]

    def has_add_permission(self, request):
        return False  # Audit logs are append-only — never manually created

    def has_change_permission(self, request, obj=None):
        return False  # Audit logs are immutable

    def has_delete_permission(self, request, obj=None):
        return False  # Audit logs must never be deleted
