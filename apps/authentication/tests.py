from django.test import TestCase
from django.core.cache import cache
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch

from apps.members.models import Member


def create_verified_member(email="test@nara.ng", phone="08012345678", password="securepass123"):
    member = Member.objects.create_user(
        email=email,
        full_name="Test Member",
        phone=phone,
        password=password,
    )
    member.is_verified = True
    member.save(update_fields=["is_verified"])
    return member


class RegistrationTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = "/api/v1/auth/register/"

    @patch("apps.authentication.views.send_otp")
    def test_a_new_member_can_register_with_valid_nigerian_phone_and_receives_otp(self, mock_send_otp):
        response = self.client.post(self.url, {
            "full_name": "Emeka Obi",
            "email": "emeka@nara.ng",
            "phone": "08098765432",
            "password": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        mock_send_otp.assert_called_once_with("08098765432")

    @patch("apps.authentication.views.send_otp")
    def test_registration_fails_when_phone_number_is_not_nigerian_format(self, mock_send_otp):
        response = self.client.post(self.url, {
            "full_name": "Emeka Obi",
            "email": "emeka@nara.ng",
            "phone": "+447911123456",
            "password": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_send_otp.assert_not_called()

    @patch("apps.authentication.views.send_otp")
    def test_registration_fails_when_email_is_already_taken_by_another_member(self, mock_send_otp):
        Member.objects.create_user(
            email="taken@nara.ng", full_name="Existing", phone="08011111111", password="pass123"
        )
        response = self.client.post(self.url, {
            "full_name": "New Person",
            "email": "taken@nara.ng",
            "phone": "08022222222",
            "password": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_send_otp.assert_not_called()


class OTPVerificationTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = "/api/v1/auth/verify-otp/"
        self.member = Member.objects.create_user(
            email="ada@nara.ng", full_name="Ada", phone="08033333333", password="pass123"
        )

    def test_member_account_is_activated_after_entering_correct_otp(self):
        cache.set(f"otp:08033333333", "123456", timeout=600)
        response = self.client.post(self.url, {"phone": "08033333333", "otp": "123456"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertTrue(self.member.is_verified)
        self.assertIn("access", response.data["data"])

    def test_otp_expires_after_ten_minutes_and_cannot_be_used(self):
        # No OTP in cache simulates expiry
        response = self.client.post(self.url, {"phone": "08033333333", "otp": "123456"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_wrong_otp_does_not_verify_the_account(self):
        cache.set("otp:08033333333", "999999", timeout=600)
        response = self.client.post(self.url, {"phone": "08033333333", "otp": "000000"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.member.refresh_from_db()
        self.assertFalse(self.member.is_verified)


class LoginTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = "/api/v1/auth/login/"
        self.member = create_verified_member()

    def test_member_can_login_with_correct_email_and_password_and_receives_jwt_tokens(self):
        response = self.client.post(self.url, {
            "email": "test@nara.ng",
            "password": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_login_fails_when_password_is_wrong(self):
        response = self.client.post(self.url, {
            "email": "test@nara.ng",
            "password": "wrongpassword",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_member_cannot_login_if_account_is_not_yet_verified(self):
        unverified = Member.objects.create_user(
            email="unverified@nara.ng",
            full_name="Unverified",
            phone="08044444444",
            password="securepass123",
        )
        response = self.client.post(self.url, {
            "email": "unverified@nara.ng",
            "password": "securepass123",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
