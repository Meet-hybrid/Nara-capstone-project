from django.contrib.auth.models import BaseUserManager


class MemberManager(BaseUserManager):

    def create_user(self, email, full_name, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is required")
        if not phone:
            raise ValueError("Phone number is required")

        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_verified", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, full_name, phone, password, **extra_fields)
