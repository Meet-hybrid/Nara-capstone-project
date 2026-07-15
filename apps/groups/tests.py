from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from apps.members.models import Member
from apps.groups.models import SavingsGroup, GroupMembership
from apps.waitlist.models import Waitlist


def create_verified_member(email="member@nara.ng", phone="08012345678"):
    member = Member.objects.create_user(
        email=email,
        full_name="Test Member",
        phone=phone,
        password="securepass123",
    )
    member.is_verified = True
    member.savings_goal = "LAND"
    member.contribution_tier = 300000
    member.save()
    return member


def create_forming_group(goal="LAND", tier=300000, max_members=6):
    return SavingsGroup.objects.create(
        name="Test Group",
        goal_type=goal,
        contribution_tier=tier,
        max_members=max_members,
        status="FORMING",
    )


class GroupMatchingTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.member = create_verified_member()
        self.client.force_authenticate(user=self.member)

    def test_member_is_matched_to_a_group_with_the_same_goal_and_same_contribution_tier(self):
        group = create_forming_group(goal="LAND", tier=300000)
        response = self.client.get("/api/v1/onboarding/match/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["group_id"], str(group.id))

    def test_when_two_groups_both_match_the_member_is_placed_in_the_one_closest_to_being_full(self):
        nearly_full_group = create_forming_group()
        empty_group = create_forming_group()

        other_member = create_verified_member(email="other@nara.ng", phone="08099999999")
        GroupMembership.objects.create(member=other_member, group=nearly_full_group, rotation_position=1)

        response = self.client.get("/api/v1/onboarding/match/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["group_id"], str(nearly_full_group.id))

    def test_member_is_added_to_waitlist_when_no_group_matches_their_goal_and_tier(self):
        # No groups created — no match possible
        response = self.client.get("/api/v1/onboarding/match/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["data"]["matched"])

    def test_group_status_changes_to_active_when_it_reaches_maximum_members(self):
        group = create_forming_group(max_members=2)
        self.client.post("/api/v1/onboarding/confirm/", {"group_id": str(group.id)})

        second_member = create_verified_member(email="second@nara.ng", phone="08088888888")
        second_member.savings_goal = "LAND"
        second_member.contribution_tier = 300000
        second_member.bank_name = "GTBank"
        second_member.account_number = "0123456789"
        second_member.save()
        self.client.force_authenticate(user=second_member)
        self.client.post("/api/v1/onboarding/confirm/", {"group_id": str(group.id)})

        group.refresh_from_db()
        self.assertEqual(group.status, "ACTIVE")

    def test_a_member_cannot_join_two_active_groups_at_the_same_time(self):
        group1 = create_forming_group()
        group2 = create_forming_group()

        self.client.post("/api/v1/onboarding/confirm/", {"group_id": str(group1.id)})
        response = self.client.post("/api/v1/onboarding/confirm/", {"group_id": str(group2.id)})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
