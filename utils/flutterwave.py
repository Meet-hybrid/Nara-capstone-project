import hashlib
import hmac
import logging
import requests
from django.conf import settings

logger = logging.getLogger("nara")


def initiate_debit(account_number, bank_code, amount, narration, reference):
    payload = {
        "account_bank": bank_code,
        "account_number": account_number,
        "amount": str(amount),
        "narration": narration,
        "currency": "NGN",
        "reference": reference,
        "debit_currency": "NGN",
    }
    try:
        response = requests.post(
            f"{settings.FLUTTERWAVE_BASE_URL}/charges?type=debit-ng-account",
            json=payload,
            headers={"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        logger.error("Flutterwave debit failed — ref: %s | error: %s", reference, str(exc))
        return None


def initiate_transfer(account_number, bank_code, amount, narration, reference):
    payload = {
        "account_bank": bank_code,
        "account_number": account_number,
        "amount": str(amount),
        "narration": narration,
        "currency": "NGN",
        "reference": reference,
    }
    try:
        response = requests.post(
            f"{settings.FLUTTERWAVE_BASE_URL}/transfers",
            json=payload,
            headers={"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        logger.error("Flutterwave transfer failed — ref: %s | error: %s", reference, str(exc))
        return None


def verify_transaction(transaction_id):
    # Always verify with Flutterwave before marking a contribution PROCESSED.
    # Skipping verification means a failed transaction could be recorded as successful,
    # causing the pot disbursement to fire with money that never arrived.
    try:
        response = requests.get(
            f"{settings.FLUTTERWAVE_BASE_URL}/transactions/{transaction_id}/verify",
            headers={"Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}"},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("data", {}).get("status") == "successful"
    except requests.RequestException as exc:
        logger.error("Flutterwave verification failed — id: %s | error: %s", transaction_id, str(exc))
        return False


def verify_webhook_signature(request_body: bytes, signature_header: str) -> bool:
    # Flutterwave signs webhook payloads with your secret key.
    # Skipping this check means anyone on the internet can send fake payment
    # success events to your API and trigger fraudulent disbursements.
    expected = hmac.new(
        settings.FLUTTERWAVE_SECRET_KEY.encode(),
        request_body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature_header)
