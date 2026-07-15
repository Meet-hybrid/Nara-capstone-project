from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from datetime import date

from apps.members.models import Member
from apps.groups.models import SavingsGroup, GroupMembership
from apps.contributions.models import Contribution
from apps.standing_orders.models import StandingOrder


def create_member_in_group():
    member = Member.objects.create_user(
        email="contributor@nara.ng",
        full_name="Chidi Okeke",
        phone="08012345678",
        password="securepass123",
    )
    member.is_verified = True
    member.savings_goal = "LAND"
    member.contribution_tier = 300000
    member.bank_name = "GTBank"
    member.account_number = "0123456789"
    member.save()

    group = SavingsGroup.objects.create(
        name="Lagos Land Savers",
        goal_type="LAND",
        contribution_tier=300000,
        max_members=4,
        status="ACTIVE",
        current_cycle_month=1,
        rotation_order=[str(member.id)],
    )
    GroupMembership.objects.create(member=member, group=group, rotation_position=1)
    return member, group


class StandingOrderTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.member, self.group = create_member_in_group()
        self.client.force_authenticate(user=self.member)

    def test_standing_order_is_created_when_member_confirms_their_group_join(self):
        StandingOrder.objects.filter(member=self.member).delete()
        self.client.post("/api/v1/standing-orders/", {
            "bank_name": "GTBank",
            "account_number": "0123456789",
            "amount": "300000.00",
            "deduction_day": 25,
        })
        self.assertTrue(StandingOrder.objects.filter(member=self.member).exists())


class ContributionTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.member, self.group = create_member_in_group()
        self.client.force_authenticate(user=self.member)

    @patch("utils.flutterwave.verify_transaction", return_value=True)
    @patch("utils.flutterwave.initiate_debit")
    def test_contribution_record_is_created_when_monthly_deduction_task_runs(
        self, mock_debit, mock_verify
    ):
        StandingOrder.objects.create(
            member=self.member,
            bank_name="GTBank",
            account_number="0123456789",
            amount=300000,
            deduction_day=25,
        )
        mock_debit.return_value = {"status": "success", "data": {"id": "FLW-REF-001"}}

        from apps.contributions.tasks import process_monthly_deductions
        process_monthly_deductions()

        month_year = date.today().strftime("%Y-%m")
        self.assertTrue(
            Contribution.objects.filter(
                member=self.member,
                group=self.group,
                month_year=month_year,
                status="PROCESSED",
            ).exists()
        )

    @patch("utils.flutterwave.initiate_debit", return_value=None)
    def test_contribution_status_is_marked_as_failed_when_flutterwave_returns_an_error(
        self, mock_debit
    ):
        StandingOrder.objects.create(
            member=self.member,
            bank_name="GTBank",
            account_number="0123456789",
            amount=300000,
            deduction_day=25,
        )

        from apps.contributions.tasks import process_monthly_deductions
        process_monthly_deductions()

        month_year = date.today().strftime("%Y-%m")
        self.assertTrue(
            Contribution.objects.filter(
                member=self.member,
                month_year=month_year,
                status="FAILED",
            ).exists()
        )

    def test_a_member_cannot_have_two_contribution_records_for_the_same_month_in_the_same_group(self):
        month_year = date.today().strftime("%Y-%m")
        Contribution.objects.create(
            member=self.member,
            group=self.group,
            amount=300000,
            month_year=month_year,
            deduction_date=date.today(),
            status="PROCESSED",
            method="STANDING_ORDER",
        )
        response = self.client.post("/api/v1/contributions/manual/", {
            "group_id": str(self.group.id),
            "amount": "300000.00",
            "month_year": month_year,
            "deduction_date": str(date.today()),
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.contributions.tasks.update_reserve_fund")
    @patch("utils.flutterwave.verify_transaction", return_value=True)
    @patch("utils.flutterwave.initiate_debit")
    def test_reserve_fund_increases_by_two_percent_of_contribution_after_each_successful_deduction(
        self, mock_debit, mock_verify, mock_reserve
    ):
        StandingOrder.objects.create(
            member=self.member,
            bank_name="GTBank",
            account_number="0123456789",
            amount=300000,
            deduction_day=25,
        )
        mock_debit.return_value = {"status": "success", "data": {"id": "FLW-REF-002"}}

        from apps.contributions.tasks import process_monthly_deductions
        process_monthly_deductions()

        mock_reserve.delay.assert_called_once_with(str(self.group.id), 300000.0)
