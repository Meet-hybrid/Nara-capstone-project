# NARA

Backend for a Nigerian fintech platform that brings the traditional Ajo/Esusu savings model online. Groups of salary earners contribute a fixed amount monthly and take turns collecting the full pot.

## What it does

NARA connects people into savings circles based on how much they want to save and what they're saving for — land, a car, a house, business, school fees, or just flexible savings. Each group has 4-10 members. Every month, standing orders deduct contributions automatically before anyone can spend the money, and one member collects everything.

There's also micro-insurance built in (covers death or job loss with a 60-day grace period), a waitlist system for backfill, and a reserve fund that covers missed payments. NARA doesn't hold money directly — a licensed microfinance bank does that. This backend handles the logic, matching, notifications, and payment orchestration.

## Apps

The project is split into 10 Django apps:

- **authentication** — registration, OTP via SMS, JWT login/logout, password reset
- **members** — user profile, dashboard, onboarding flow
- **groups** — savings groups, rotation scheduling, the matching algorithm that places people together
- **contributions** — contribution records, monthly deductions, PDF statements
- **standing_orders** — bank standing order management via Flutterwave
- **disbursements** — pot payout to the monthly collector
- **insurance** — micro-insurance cover and claims processing
- **waitlist** — queue for members waiting to be placed in a group
- **notifications** — in-app, SMS, and WhatsApp notifications
- **admin_panel** — admin config and audit log (append-only, CBN-compliant)

## Tech stack

- Django 4.2 + Django REST Framework
- MySQL for the database
- Redis for caching, OTP storage, and Celery broker
- Celery + Celery Beat for background tasks and scheduling
- Flutterwave v3 for payments and standing orders
- Termii for SMS and WhatsApp
- ReportLab for PDF generation
- SimpleJWT for authentication (access + refresh tokens)
- Gunicorn for serving, WhiteNoise for static files

## Setup

You'll need Python 3.11+, MySQL, and Redis running locally.

```bash
# virtual environment
python -m venv venv
venv\Scripts\activate    # Windows

# dependencies
pip install -r requirements.txt
```

Create a MySQL database:

```sql
CREATE DATABASE nara_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copy `.env.example` to `.env` and fill in the values (at minimum SECRET_KEY and DB credentials). Then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

For background tasks, start Celery in a separate terminal:

```bash
celery -A config worker --loglevel=info
celery -A config beat --loglevel=info   # for scheduled tasks
```

## API

All endpoints live under `/api/v1/`. The admin panel is at `/admin/`.

Key endpoints:

- `POST /api/v1/auth/register/` — create account, triggers OTP
- `POST /api/v1/auth/verify-otp/` — verify phone, get JWT
- `POST /api/v1/auth/login/` — email + password login
- `GET /api/v1/members/me/` — your profile
- `POST /api/v1/onboarding/goal/` — set savings goal
- `POST /api/v1/onboarding/tier/` — set contribution amount
- `GET /api/v1/onboarding/match/` — find best group match
- `POST /api/v1/onboarding/confirm/` — join the group
- `GET /api/v1/groups/my-group/` — your group and rotation schedule
- `GET /api/v1/contributions/` — your contribution history
- `GET /api/v1/contributions/statement/` — download PDF statement

## Tests

```bash
python manage.py test apps
```

Or per app:

```bash
python manage.py test apps.authentication
python manage.py test apps.contributions
```

## Deployment

The repo includes a `Procfile` for Render with three process types — web (gunicorn), worker (celery), and beat (celery beat). Set `DJANGO_SETTINGS_MODULE=config.settings.prod` and configure environment variables on the hosting dashboard.
# Force Vercel redeployment
