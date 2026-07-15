from cryptography.fernet import Fernet
from django.conf import settings
import base64
import hashlib


def _get_cipher():
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))


def encrypt(plain_text: str) -> str:
    cipher = _get_cipher()
    return cipher.encrypt(plain_text.encode()).decode()


def decrypt(encrypted_text: str) -> str:
    cipher = _get_cipher()
    return cipher.decrypt(encrypted_text.encode()).decode()
