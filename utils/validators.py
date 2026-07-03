import re
from rest_framework import serializers

ALLOWED_CONTRIBUTION_TIERS = [200000, 300000, 500000, 800000, 1000000]


def validate_nigerian_phone(phone):
    pattern = r"^(070|080|081|090|091)\d{8}$"
    if not re.match(pattern, phone):
        raise serializers.ValidationError(
            "Enter a valid Nigerian phone number (e.g. 08012345678)."
        )


def validate_account_number(account_number):
    if not re.match(r"^\d{10}$", account_number):
        raise serializers.ValidationError("Account number must be exactly 10 digits.")


def validate_contribution_tier(amount):
    try:
        amount_int = int(amount)
    except (ValueError, TypeError):
        raise serializers.ValidationError("Contribution tier must be a number.")

    if amount_int not in ALLOWED_CONTRIBUTION_TIERS:
        readable = ", ".join(f"₦{t:,}" for t in ALLOWED_CONTRIBUTION_TIERS)
        raise serializers.ValidationError(
            f"Contribution tier must be one of: {readable}."
        )
