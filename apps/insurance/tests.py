from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date

from apps.members.models import Member
from apps.groups.models import SavingsGroup, GroupMembership
from apps.insurance.models import InsuranceCover
from apps.standing_orders.models import StandingOrder


def create_member_with_insurance():
    member = Member.objects.create_user(
        email="insured@nara.ng",
        full_name="Ngozi Eze",
        phone="08055555555",
        password="pass123",
    )
    member.is_verified = True
    member.save()

    group = SavingsGroup.objects.create(
        name="Enugu Savers",
        goal_type="BUSINESS",
        contribution_tier=200000,
        max_members=5,
        status="ACTIVE",
        current_cycle_month=1,
        rotation_order=[str(member.id)],
    )
    GroupMembership.objects.create(member=member, group=group, rotation_position=1)
    InsuranceCover.objects.create(
        member=member,
        group=group,
        premium_amount=2000,
        coverage_amount=800000,
    )
    return member, group


class InsuranceTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.member, self.group = create_member_with_insurance()
        self.client.force_authenticate(user=self.member)

    def test_insurance_cover_is_created_automatically_when_member_joins_a_group(self):
        self.assertTrue(InsuranceCover.objects.filter(member=self.member).exists())

    def test_member_can_file_a_claim_with_reason_job_loss_and_grace_period_is_activated(self):
        response = self.client.post("/api/v1/insurance/claim/", {"claim_reason": "JOB_LOSS"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.status, "GRACE_PERIOD")

    def test_grace_period_pauses_the_standing_order_automatically(self):
        StandingOrder.objects.create(
            member=self.member,
            bank_name="Zenith",
            account_number="0987654321",
            amount=200000,
            deduction_day=25,
        )
        self.client.post("/api/v1/insurance/claim/", {"claim_reason": "JOB_LOSS"})
        self.member.standing_order.refresh_from_db()
        self.assertEqual(self.member.standing_order.status, "PAUSED")

    def test_insurance_claim_cannot_be_filed_twice_for_the_same_member(self):
        self.client.post("/api/v1/insurance/claim/", {"claim_reason": "JOB_LOSS"})
        response = self.client.post("/api/v1/insurance/claim/", {"claim_reason": "JOB_LOSS"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_waitlist_member_is_promoted_to_fill_slot_after_sixty_day_grace_period_expires(self):
        from apps.waitlist.models import Waitlist
        from unittest.mock import patch

        waitlisted = Member.objects.create_user(
            email="waiting@nara.ng",
            full_name="Waiting Person",
            phone="08066666666",
            password="pass123",
        )
        Waitlist.objects.create(
            member=waitlisted,
            goal_type="BUSINESS",
            contribution_tier=200000,
            priority=1,
        )

        cover = self.member.insurance
        cover.claim_date = date(2024, 1, 1)  # 60+ days ago
        cover.save(update_fields=["claim_date"])
        self.member.status = "GRACE_PERIOD"
        self.member.save(update_fields=["status"])

        with patch("apps.contributions.tasks.promote_waitlist_member") as mock_promote:
            from apps.contributions.tasks import check_grace_periods
            check_grace_periods()
            mock_promote.delay.assert_called_once_with(str(self.group.id))
