from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from datetime import date

from apps.members.models import Member
from apps.groups.models import SavingsGroup, GroupMembership
from apps.contributions.models import Contribution
from apps.disbursements.models import PotDisbursement
from apps.notifications.models import Notification


def build_active_group_with_members():
    members = []
    for i in range(4):
        m = Member.objects.create_user(
            email=f"member{i}@nara.ng",
            full_name=f"Member {i}",
            phone=f"0801234567{i}",
            password="pass123",
        )
        m.is_verified = True
        m.account_number = f"012345678{i}"
        m.save()
        members.append(m)

    group = SavingsGroup.objects.create(
        name="Abuja Savers",
        goal_type="HOUSE",
        contribution_tier=500000,
        max_members=4,
        status="ACTIVE",
        current_cycle_month=1,
        rotation_order=[str(m.id) for m in members],
    )
    for i, m in enumerate(members):
        GroupMembership.objects.create(member=m, group=group, rotation_position=i + 1)

    return group, members


class DisbursementTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.group, self.members = build_active_group_with_members()
        self.admin = Member.objects.create_superuser(
            email="admin@nara.ng",
            full_name="Admin",
            phone="08099990000",
            password="adminpass123",
        )
        self.client.force_authenticate(user=self.admin)

    def _create_all_contributions_processed(self):
        month_year = date.today().strftime("%Y-%m")
        for member in self.members:
            Contribution.objects.create(
                member=member,
                group=self.group,
                amount=500000,
                month_year=month_year,
                deduction_date=date.today(),
                status="PROCESSED",
            )

    @patch("utils.flutterwave.initiate_transfer")
    def test_pot_is_disbursed_to_the_correct_member_based_on_the_rotation_order(
        self, mock_transfer
    ):
        self._create_all_contributions_processed()
        mock_transfer.return_value = {"data": {"id": "FLW-TRANS-001"}}

        response = self.client.post("/api/v1/disbursements/process/", {
            "group_id": str(self.group.id)
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        disbursement = PotDisbursement.objects.get(group=self.group)
        self.assertEqual(disbursement.recipient, self.members[0])

    def test_disbursement_does_not_trigger_if_any_contribution_in_the_group_is_still_pending(self):
        month_year = date.today().strftime("%Y-%m")
        Contribution.objects.create(
            member=self.members[0],
            group=self.group,
            amount=500000,
            month_year=month_year,
            deduction_date=date.today(),
            status="PENDING",
        )
        response = self.client.post("/api/v1/disbursements/process/", {
            "group_id": str(self.group.id)
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("utils.termii.send_whatsapp")
    @patch("utils.flutterwave.initiate_transfer")
    @patch("apps.contributions.tasks._is_last_day_of_month", return_value=True)
    def test_collector_receives_whatsapp_notification_when_pot_is_sent_to_their_account(
        self, _mock_date, mock_transfer, mock_whatsapp
    ):
        self._create_all_contributions_processed()
        mock_transfer.return_value = {"data": {"id": "FLW-TRANS-002"}}

        from apps.contributions.tasks import trigger_pot_disbursement
        trigger_pot_disbursement()

        mock_whatsapp.assert_called_once()
        self.assertEqual(mock_whatsapp.call_args[0][0], self.members[0].phone)

    @patch("utils.flutterwave.initiate_transfer")
    @patch("apps.contributions.tasks._is_last_day_of_month", return_value=True)
    def test_all_group_members_receive_in_app_notification_when_monthly_pot_is_disbursed(
        self, _mock_date, mock_transfer
    ):
        self._create_all_contributions_processed()
        mock_transfer.return_value = {"data": {"id": "FLW-TRANS-003"}}

        from apps.contributions.tasks import trigger_pot_disbursement
        trigger_pot_disbursement()

        notification_count = Notification.objects.filter(notif_type="POT_MONTH").count()
        self.assertEqual(notification_count, len(self.members))

    @patch("utils.flutterwave.initiate_transfer")
    @patch("apps.contributions.tasks._is_last_day_of_month", return_value=True)
    def test_rotation_advances_to_the_next_member_after_disbursement_is_confirmed(
        self, _mock_date, mock_transfer
    ):
        self._create_all_contributions_processed()
        mock_transfer.return_value = {"data": {"id": "FLW-TRANS-004"}}

        from apps.contributions.tasks import trigger_pot_disbursement
        trigger_pot_disbursement()

        self.group.refresh_from_db()
        self.assertEqual(self.group.current_cycle_month, 2)
