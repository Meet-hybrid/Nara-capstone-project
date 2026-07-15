# NARA Backend — Developer Documentation

This document contains every explanation given during the build of the NARA backend. It is written for someone who knows basic Python but has never built an API before. Read it top to bottom the first time, then use it as a reference.

---

## Table of Contents

1. [What NARA Is](#1-what-nara-is)
2. [Project Structure](#2-project-structure)
3. [Django Settings — Why We Split Them](#3-django-settings--why-we-split-them)
4. [Every Setting Explained](#4-every-setting-explained)
5. [Django Models — The Basics](#5-django-models--the-basics)
6. [The Member Model](#6-the-member-model)
7. [The SavingsGroup Model](#7-the-savingsgroup-model)
8. [The Contribution Model](#8-the-contribution-model)
9. [The StandingOrder Model](#9-the-standingorder-model)
10. [The InsuranceCover Model](#10-the-insurancecover-model)
11. [The PotDisbursement Model](#11-the-potdisbursement-model)
12. [The Waitlist Model](#12-the-waitlist-model)
13. [The Notification Model](#13-the-notification-model)
14. [The AuditLog Model](#14-the-auditlog-model)
15. [Utility Functions](#15-utility-functions)
16. [Authentication — JWT and OTP](#16-authentication--jwt-and-otp)
17. [API Views — How They Work](#17-api-views--how-they-work)
18. [The Matching Algorithm](#18-the-matching-algorithm)
19. [Background Tasks — Celery](#19-background-tasks--celery)
20. [Security](#20-security)
21. [Automated Tests](#21-automated-tests)
22. [Running the Project Locally](#22-running-the-project-locally)
23. [Deploying to Render](#23-deploying-to-render)

---


## 1. What NARA Is

NARA is a Nigerian fintech platform that formalises the traditional Ajo and Esusu savings culture. It connects salary earners into structured savings circles based on their monthly contribution amount and savings goal.

The platform sells three things:

- **Trust** — through bank standing orders that automatically deduct contributions before the member can spend the money
- **Discipline** — through group accountability where everyone is working toward the same goal
- **Goals** — through asset-based grouping where people saving for land are placed together and people saving for a car are placed together

NARA acts as the middleman between salary earners and partner banks. It does not hold money itself. A licensed microfinance bank holds the funds. NARA manages the logic, the rotation, the notifications and the protection.

### How the savings circle works

A group has between 4 and 10 members. Every member contributes the same fixed amount every month. Each month one member collects the full pot — the sum of all contributions. The rotation continues until every member has collected once. That is one complete cycle.

**Example:** 6 members each contributing ₦300,000 per month. Monthly pot is ₦1,800,000. Each member collects once over 6 months.

The standing order is the key innovation. When a member joins, they authorise their bank to automatically deduct their contribution on salary day before they can touch the money. NARA triggers this through the Flutterwave API.

**If a member dies** after collecting their pot, the micro-insurance policy pays the outstanding balance back to the group.

**If a member loses their job**, they get a 60-day grace period, the group reserve fund covers their slot for up to 3 months, and a waitlisted member steps in if they cannot return.

The reserve fund is 2% of every contribution automatically set aside.

---

## 2. Project Structure

```
nara/
├── config/
│   ├── settings/
│   │   ├── base.py        ← settings shared across all environments
│   │   ├── dev.py         ← settings only for local development
│   │   └── prod.py        ← settings only for production (Render)
│   ├── urls.py            ← master URL router
│   ├── celery.py          ← Celery application configuration
│   └── beat_schedule.py   ← schedule for all recurring tasks
├── apps/
│   ├── authentication/    ← register, OTP, login, logout, password reset
│   ├── members/           ← member profile, dashboard, onboarding
│   ├── groups/            ← savings groups, matching algorithm
│   ├── contributions/     ← contribution records, PDF statement, deduction tasks
│   ├── standing_orders/   ← standing order management
│   ├── disbursements/     ← pot disbursement to monthly collector
│   ├── insurance/         ← micro-insurance cover and claims
│   ├── waitlist/          ← queue for members waiting for a group
│   ├── notifications/     ← in-app, SMS and WhatsApp notifications
│   └── admin_panel/       ← Django admin configuration and AuditLog model
├── utils/
│   ├── encryption.py      ← encrypt/decrypt sensitive data
│   ├── validators.py      ← Nigerian phone, account number, contribution tier
│   ├── flutterwave.py     ← debit, transfer, and webhook verification
│   ├── termii.py          ← SMS, WhatsApp, OTP sending and verification
│   └── responses.py       ← standard API response wrapper
├── requirements.txt       ← all Python packages the project needs
├── manage.py              ← Django's command-line tool
└── Procfile               ← tells Render how to run the app
```

**What each folder is responsible for:**

- `config/` — the control panel. Everything that configures how the whole app behaves lives here. If you change how the database connects, you come here. If you add a new scheduled task, you come here.
- `apps/` — the business logic. Each folder is one self-contained module of the NARA product. The `groups` app only knows about groups. The `contributions` app only knows about contributions. They talk to each other through imports, not through shared files.
- `utils/` — helper functions that multiple apps need. If the same logic would appear in three different apps, it belongs in `utils/`. Keeping it here means you fix a bug once instead of three times.

---


## 3. Django Settings — Why We Split Them

Django settings are a Python file (or files) that tell Django how your application should behave — which database to connect to, which apps are installed, how authentication works, etc. Think of it as the control panel for your entire backend.

### Why three files instead of one

A single settings file creates a serious risk. Development settings like `DEBUG=True`, a local database password, or printing emails to the terminal instead of actually sending them must **never** reach your production server. If you forget to change one value before deploying, you could expose your entire database or secret key to the internet.

By splitting into base/dev/prod:

- `base.py` holds everything that is **identical** in both environments
- `dev.py` adds development-only settings (DEBUG on, local DB, browsable API)
- `prod.py` adds production-only settings (DEBUG off, HTTPS, real secrets from environment variables)

You can never accidentally use dev settings in production because `prod.py` imports `base.py` and only overrides what needs to change. The environments are structurally separate.

### The risk of one file

Imagine you hardcode `DATABASE_URL = "mysql://root:password@localhost/nara"` in a single settings file and deploy it. Your production app now tries to connect to `localhost` (which doesn't exist on Render), crashes, and your `DEBUG=True` setting prints your full stack trace — including your secret key — to every visitor who triggers an error. That is a real security incident.

---

## 4. Every Setting Explained

### `SECRET_KEY`
Django uses this key to cryptographically sign cookies, sessions and tokens. If an attacker gets your `SECRET_KEY`, they can forge authentication tokens and impersonate any user — including admins. It must be long, random, and kept secret. We read it from the `.env` file so it is never in the codebase or version control history.

### `DEBUG`
When `DEBUG=True`, Django shows a detailed error page whenever something breaks. That page includes your settings, environment variables, code paths, and the full traceback. It is incredibly useful for development. In production it must be `False` — that same error page would show an attacker exactly how your code is structured, what database you are using, and potentially expose secret keys.

### `ALLOWED_HOSTS`
Django will only respond to requests for hostnames listed here. This prevents a type of attack called HTTP Host Header Injection where an attacker sends a fake `Host` header to trick your app into generating links pointing at a malicious domain. In development we allow `localhost` and `127.0.0.1`. In production we allow only our real Render domain.

### `INSTALLED_APPS`
This list tells Django which applications exist in your project. Django only loads models, migrations, admin pages and signal handlers for apps listed here. If you create a new app and forget to add it here, its models will not be created in the database and its URLs will not be registered.

### `MIDDLEWARE`
Middleware are functions that run on every single request before it reaches your view, and on every response before it leaves the server. Think of them as airport security checkpoints. The order matters — each middleware wraps the one below it like layers of an onion. The security middleware runs first, the authentication middleware runs later once the request has passed basic checks.

### `DATABASES`
This dictionary tells Django which database engine to use and how to connect to it. We use MySQL because it is what you have installed locally via MySQL Workbench. The `OPTIONS` section turns on strict mode, which means MySQL will refuse to store invalid data instead of silently truncating it. Always use strict mode for financial data.

### `AUTH_USER_MODEL`
Tells Django to use our custom `Member` model instead of its built-in `User` model for authentication. This must be set **before the first migration**. If you try to change this after migrations exist, it becomes very painful because Django's authentication tables are already built around the old model.

### `REST_FRAMEWORK`
Configures how Django REST Framework behaves globally across all your API endpoints. We set `JWTAuthentication` as the default so every endpoint requires a valid token unless that specific view explicitly allows anonymous access.

### `SIMPLE_JWT`
Configures the JWT token settings. We give access tokens a 60-minute lifetime and refresh tokens a 7-day lifetime. `ROTATE_REFRESH_TOKENS=True` means every time a refresh token is used, a new one is issued and the old one is invalidated.

### `CORS_ALLOWED_ORIGINS`
Controls which domains are allowed to make requests to the API from a browser. Without this, every request from your frontend gets blocked by the browser before it even reaches your server. In development we allow all origins. In production we only allow our real app domain.

### `CELERY_BROKER_URL`
The address of the Redis server that Celery uses to pass task messages. When the API wants to run a task in the background, it drops a message into Redis. A Celery worker process picks it up and executes it. Without Redis, Celery has nowhere to put tasks and nowhere to pick them up from.

---


## 5. Django Models — The Basics

A Django model is a Python class that maps directly to a database table. Each attribute on the class is a column in the table. Django auto-generates the SQL to create the table — you never write `CREATE TABLE` manually.

The reason we use models instead of writing raw SQL:

- Models are version-controlled. Every change to the schema is tracked in a migration file.
- Models are readable. You can understand the data structure by reading Python, not SQL.
- Models are safe. Django handles quoting, escaping and parameterisation so you are protected from SQL injection by default.
- Models are portable. If you ever switch from MySQL to PostgreSQL, your models stay exactly the same.

### Field types and what they mean

| Field | What it stores | Database column |
|---|---|---|
| `CharField` | Short text with a maximum length | `VARCHAR(n)` |
| `TextField` | Long text with no length limit | `LONGTEXT` |
| `EmailField` | Text validated as an email address | `VARCHAR(254)` |
| `DecimalField` | Exact decimal numbers — always use this for money, never `FloatField` | `DECIMAL(p,s)` |
| `BooleanField` | True or False | `TINYINT(1)` |
| `DateField` | A calendar date | `DATE` |
| `DateTimeField` | A date and time | `DATETIME` |
| `UUIDField` | A universally unique identifier | `CHAR(32)` |
| `ForeignKey` | A link to another table (many-to-one) | `BIGINT` with index |
| `OneToOneField` | A link to another table (one-to-one) | `BIGINT` with unique index |
| `JSONField` | Any JSON value — list, dict, etc. | `JSON` |
| `PositiveIntegerField` | Whole numbers, zero or greater | `INT UNSIGNED` |
| `GenericIPAddressField` | An IPv4 or IPv6 address | `CHAR(39)` |

**Why `DecimalField` for money and not `FloatField`:** Float uses binary arithmetic which cannot represent all decimal numbers exactly. `0.1 + 0.2` in a float is `0.30000000000000004`. For financial calculations, even a fraction of a kobo error is unacceptable.

---

## 6. The Member Model

**File:** `apps/members/models.py`

### Why we extend `AbstractBaseUser` instead of the default `User` model

Django's default `User` model uses `username` as the login field. NARA members log in with their email address. If we used the default `User`, we would need to work around the username requirement constantly. `AbstractBaseUser` lets us define exactly what fields exist and which one is used for authentication. We set `USERNAME_FIELD = "email"` and that becomes the login field.

### Why UUID instead of auto-incrementing integers for IDs

Auto-increment IDs expose business data. An `id=1` tells any observer that there is only one user. An `id=2` is trivially guessable — an attacker can simply increment and try to access other users' data. UUIDs are 128-bit random values. They are globally unique, impossible to guess, and safe to expose in URLs and API responses.

### What `choices` does on a `CharField`

`choices` is a list of allowed values. Django validates that any value stored in the field is one of the listed options. It also provides a `get_X_display()` method that returns the human-readable label. For example, `member.get_savings_goal_display()` returns `"Land"` instead of `"LAND"`.

### What `db_table` does

By default Django names your database table `appname_modelname` — so `members_member`. `db_table = "members"` overrides this so the table has a clean, predictable name. This matters when you query the database directly in MySQL Workbench.

### What `ordering` does

`ordering = ["-joined_at"]` means whenever you query `Member.objects.all()`, Django adds `ORDER BY joined_at DESC` to the SQL automatically. The `-` means descending. Most recently joined members come first.

### What `__str__` is for

`__str__` defines what Python prints when you convert the object to a string. In the Django admin panel, in shell sessions, and in log output, a Member will display as `Emeka Obi (emeka@nara.ng)` instead of `<Member object (uuid)>`.

---


## 7. The SavingsGroup Model

**File:** `apps/groups/models.py`

### What a `@property` is and why `monthly_pot` is a property instead of a stored field

A `@property` is a method that behaves like an attribute. You call it as `group.monthly_pot` not `group.monthly_pot()`, but Python runs a function behind the scenes.

`monthly_pot` is a property and not a stored column because the value changes every time a member joins or leaves. If it were stored in the database, you would need to update it every time the member count changed. That creates two places to maintain the same piece of information, and they can get out of sync — a bug waiting to happen. By computing it fresh from live data, it is always correct.

### What `JSONField` is and why we use it for `rotation_order`

`JSONField` stores any JSON value — a list, a dictionary, a number — directly in the database column. We store `rotation_order` as a JSON array of member UUID strings: `["uuid-1", "uuid-2", "uuid-3"]`.

The alternative would be a separate `RotationSlot` model with a foreign key and a position number. That would require a join query every time you want to know the rotation. A JSON array preserves order naturally and reads in one database call. It is the right tool for a fixed-length ordered list.

### What the difference is between `auto_now` and `auto_now_add`

- `auto_now_add=True` sets the field to the current time **when the record is first created**. It never changes after that. Use this for `created_at`.
- `auto_now=True` sets the field to the current time **every time the record is saved**. Use this for `updated_at`.

We use `auto_now_add` for `created_at` so we have a permanent record of when the group was formed.

### Why `current_collector` imports `Member` inside the method

The `Member` model lives in `apps/members/models.py`. The `SavingsGroup` model lives in `apps/groups/models.py`. If `groups/models.py` imports `Member` at the top of the file, and `members/models.py` ever needs to import anything from `groups`, Python hits a circular import error — A imports B which imports A, and neither can finish loading.

Importing `Member` inside the `current_collector` method defers the import until the method is actually called, by which time both models are fully loaded into memory. This is the standard Django pattern for avoiding circular imports between models in different apps.

---

## 8. The Contribution Model

**File:** `apps/contributions/models.py`

### What `ForeignKey` is and what `on_delete=models.PROTECT` does

`ForeignKey` creates a relationship between two tables. `member = models.ForeignKey(Member, ...)` means each `Contribution` record belongs to one `Member`, and one `Member` can have many `Contribution` records.

`on_delete` controls what happens when the referenced record is deleted:

- `PROTECT` — Django **refuses** to delete the Member while any Contribution records point to them. This is the right choice for financial records. You cannot delete a member and silently lose their contribution history.
- `CASCADE` — deleting the Member automatically deletes all their Contributions. This would be catastrophic for auditing. You would permanently lose the financial trail.
- `SET_NULL` — the contribution's `member` field would become `NULL`. The record survives but is now orphaned with no owner. Also bad for auditing.

### What `related_name` does and why it matters

`related_name="contributions"` creates a reverse relationship. It lets you write `member.contributions.all()` to get all contributions for a member, instead of the default `member.contribution_set.all()`. It makes the code read like English. It also avoids naming conflicts when a model has multiple foreign keys pointing to the same model.

### What `unique_together` does and why we need it

`unique_together = ["member", "group", "month_year"]` tells the database to enforce that the combination of these three fields is unique. A member can only have one contribution record per group per month.

Without this, a bug in the deduction task could run twice and create two `PENDING` contribution records for the same month, potentially debiting a member twice. The database constraint catches this even if the application code has a bug.

### What `blank=True` versus `null=True` means

- `null=True` — the **database column** can store NULL (no value). Without this, the column requires a value at the database level.
- `blank=True` — the **serializer/form field** is not required. The user does not have to provide a value.

For optional text fields like `transaction_ref`, use both `blank=True, null=True`. For required fields, use neither. Never use `null=True` on a `CharField` alone — you would end up with two representations of "empty": the string `""` and `NULL`.

---

## 9. The StandingOrder Model

**File:** `apps/standing_orders/models.py`

### What `OneToOneField` is and how it differs from `ForeignKey`

`ForeignKey` allows many-to-one: many Contributions can belong to one Member. `OneToOneField` enforces one-to-one: one Member can have exactly one StandingOrder, and one StandingOrder belongs to exactly one Member.

The database enforces this with a unique constraint on the foreign key column. If you try to create a second standing order for the same member, the database will reject it with a unique constraint violation.

### Why a member can only have one standing order

A standing order is an instruction to a bank: "deduct ₦X from this account on day Y every month." You cannot have two different deduction amounts or two different deduction days for the same member in the same group cycle. The OneToOneField prevents this confusion at the data level.

---


## 10. The InsuranceCover Model

**File:** `apps/insurance/models.py`

Each member gets an insurance cover automatically when they join a group. The cover amount is calculated as the contribution tier multiplied by the number of months remaining before the member collects. This represents the maximum loss to the group if the member defaults.

Two separate status fields exist on purpose:

- `status` — the state of the cover itself (Active, Claimed, Expired, Cancelled)
- `claim_status` — the state of a filed claim (None, Pending, Approved, Rejected)

This separation means a cover can be Active while a claim is under review. They track two different things.

---

## 11. The PotDisbursement Model

**File:** `apps/disbursements/models.py`

Every time a monthly pot is sent to a collector, a `PotDisbursement` record is created. This is the paper trail for the most important financial transaction in NARA.

`bank_reference` stores the reference ID that Flutterwave returns when the transfer is initiated. If a member ever disputes a disbursement, you use this reference to look up the transaction directly in the Flutterwave dashboard and prove the payment was made.

---

## 12. The Waitlist Model

**File:** `apps/waitlist/models.py`

When a member completes onboarding but no matching group is available, they join the waitlist. The `priority` field is a number — lower numbers get promoted first. When a new group opens or a slot becomes available, the system picks the member with the lowest priority number for that goal and tier.

`ordering = ["priority"]` means `Waitlist.objects.all()` always returns members in priority order without needing to specify it in every query.

---

## 13. The Notification Model

**File:** `apps/notifications/models.py`

Notifications exist in three channels: `IN_APP` (visible in the mobile app), `SMS`, and `WHATSAPP`. Each notification record has an `is_read` flag so the app can show unread notification counts and the mark-all-as-read endpoint knows which ones to update.

`ordering = ["-sent_at"]` means notifications always come newest first.

---

## 14. The AuditLog Model

**File:** `apps/admin_panel/models.py`

### What an audit log is and why financial applications legally need one

An audit log is an append-only record of every significant action that touched money. Append-only means you can add records but never modify or delete them.

Nigerian fintech regulation under the Central Bank of Nigeria (CBN) guidelines requires financial platforms to maintain records of all transactions. If a dispute happens — "I never got my pot" or "you debited me twice" — the audit log is the legal paper trail. Without it, you cannot prove what happened.

The Django admin is configured to prevent adding, editing, and deleting audit log entries. Only the application itself can create them.

### What information we capture

- `member` — who the action relates to (uses `SET_NULL` so the log survives even if the member is deleted)
- `action` — a short code like `CONTRIBUTION_PROCESSED` or `POT_DISBURSED`
- `amount` — the money involved, if any
- `description` — a plain English description of what happened
- `ip_address` — the IP address of the request, for security investigations
- `timestamp` — when it happened, set automatically and never editable

---


## 15. Utility Functions

### What a utility function is and why we separate them

A utility function is a piece of logic that is useful across multiple parts of the application but does not belong to any one app. The alternative — copying the same function into every app that needs it — means that when you fix a bug, you have to fix it in five places. Miss one, and you have inconsistent behaviour.

If `utils/` did not exist, the Flutterwave integration code would live in `contributions/`, but then `disbursements/` would need to import it from `contributions/`, which makes no sense architecturally. Utilities belong in a neutral location.

---

### `utils/responses.py`

Every endpoint in NARA returns responses in this exact format:

```json
// Success
{
  "status": "success",
  "message": "Contribution retrieved.",
  "data": { ... }
}

// Error
{
  "status": "error",
  "message": "Registration failed.",
  "errors": { ... }
}
```

**Why consistent response formats matter:** The mobile app developer writes code like `if (response.status === "success") { show(response.data) }`. This works for every single endpoint because the format never changes. Without consistency, the mobile app needs different handling code for every endpoint — a maintenance nightmare, and a source of bugs every time a new endpoint is added.

---

### `utils/validators.py`

**What validation is:** Checking that data meets your rules before you try to use it.

**Why we validate on the backend even if the mobile app already validates on the frontend:** The frontend is not trustworthy. Anyone can call your API directly — with Postman, curl, or a script — bypassing the mobile app entirely. Backend validation is the only validation that matters for security. Frontend validation is a convenience for users, not a security control.

- `validate_nigerian_phone` — Nigerian numbers start with 070, 080, 081, 090, or 091 and are exactly 11 digits. A UK number or a random string will fail this check.
- `validate_account_number` — Nigerian bank account numbers are exactly 10 digits. No more, no less.
- `validate_contribution_tier` — Members can only join at allowed tiers: ₦200,000, ₦300,000, ₦500,000, ₦800,000, or ₦1,000,000. A random amount cannot be entered.

---

### `utils/flutterwave.py`

**What a payment gateway is:** A payment gateway is a service that connects your application to the banking system. Instead of building direct integrations with 30 Nigerian banks, you integrate once with Flutterwave and they handle the bank connections.

**What Flutterwave is:** Flutterwave is a Nigerian fintech company that provides payment infrastructure for African markets. It supports direct bank debits, transfers, card payments, mobile money, and USSD.

**Why Nigerian fintechs use Flutterwave instead of Stripe:** Stripe does not support direct Nigerian bank account debits. Flutterwave does. Stripe also does not support USSD payments, which a significant portion of Nigerian mobile users rely on.

**What an API key is and why we never hardcode it:** An API key is a secret password that identifies your application to Flutterwave. If your API key is in your source code and your repository is ever made public (even accidentally), anyone who finds it can initiate transfers from your Flutterwave account. API keys must only ever live in environment variables.

**`initiate_debit`** — debits a member's bank account directly. Called by the Celery task on deduction day.

**`initiate_transfer`** — sends pot money to the collector's account. Called when a member's pot month arrives.

**`verify_transaction`** — confirms with Flutterwave that a transaction actually succeeded. We always verify before marking a contribution as `PROCESSED`. If we skip verification, a failed transaction could be recorded as successful, causing a pot disbursement to fire with money that never actually arrived.

**`verify_webhook_signature`** — Flutterwave signs every webhook payload with your secret key. We verify this signature before processing any webhook. If we skip this check, anyone on the internet can send a fake "payment successful" event to our API and trigger fraudulent disbursements.

---

### `utils/termii.py`

**What Termii is:** Termii is a Nigerian communications API provider. It gives you a single API to send SMS and WhatsApp messages to Nigerian phone numbers.

**Why we use it instead of building our own SMS system:** Building direct integrations with MTN, Airtel, Glo, and 9mobile would require separate contracts, technical integrations, and compliance with each network's requirements. Termii has already done this. We pay per message and focus on our product.

**Cost implication:** Every SMS costs money — typically ₦4 to ₦8 per message in Nigeria. If NARA has 10,000 active members and sends 3 SMS messages per member per month (deduction reminder, deduction confirmation, group update), that is 30,000 messages per month. At ₦5 each, that is ₦150,000 per month just for SMS. This is why the send frequency matters for unit economics.

**`send_otp`** — generates a 6-digit OTP, stores it in Redis with a 10-minute TTL (time-to-live), and sends it to the phone number via SMS.

**Why Redis is better than the database for OTPs:** Redis has native TTL support — you set an expiry time when you store the value and Redis deletes it automatically. In the database, you would need a scheduled job to delete expired OTPs, or your OTP table grows indefinitely. Redis is also significantly faster for this type of short-lived key-value data.

**`verify_otp`** — checks the submitted OTP against what is stored in Redis. If it matches, the OTP is deleted immediately from Redis.

**Why we delete the OTP immediately after successful verification:** An OTP is a one-time password. If we kept it in Redis until it naturally expired, a leaked OTP could be reused within the 10-minute window. Deleting it immediately after use means it can never be used again, even by the person who just used it correctly.

---

### `utils/encryption.py`

Provides `encrypt()` and `decrypt()` functions using the Fernet symmetric encryption algorithm. Used when storing any sensitive data that needs to be readable again later (unlike passwords, which are hashed one-way). The encryption key is derived from Django's `SECRET_KEY` so it is never stored separately.

---


## 16. Authentication — JWT and OTP

### What JWT is

JSON Web Token (JWT) is a way of proving identity without storing sessions on the server. When a member logs in, the server creates a signed token containing their user ID. Every future API request sends this token in the `Authorization` header. The server verifies the signature — if it is valid, the server knows who you are without hitting the database.

The token looks like three Base64-encoded strings separated by dots: `header.payload.signature`. The payload contains the user ID and expiry time in plain text. The signature is a cryptographic hash that proves the payload has not been tampered with.

### Why two tokens instead of one

An **access token** is short-lived (60 minutes in NARA). If it is stolen, the attacker can only use it for at most an hour.

A **refresh token** is longer-lived (7 days). When the access token expires, the mobile app silently sends the refresh token to get a new access token, without the user having to log in again. This gives both security (short access token window) and good user experience (no constant re-login).

The refresh token is stored more securely on the device. If the user logs out, the refresh token is blacklisted in the database so it can never be used again even if someone intercepts it.

### What an OTP is

OTP stands for One-Time Password. It is a 6-digit code that is valid for a single use and expires after a fixed time (10 minutes in NARA). We send it to the member's phone number to prove they own the phone.

### Why OTP via SMS instead of email verification for a Nigerian audience

Mobile phone penetration in Nigeria is significantly higher than email usage, especially among the salary earners NARA targets. Every Nigerian with a bank account has a registered phone number. Not everyone checks email reliably. An SMS reaches the person immediately on the device they always have with them.

### Where OTPs are stored and why not in the database

OTPs are stored in Redis with a 10-minute TTL. The database is the wrong place for OTPs for three reasons:

1. Redis TTL handles expiry automatically. The OTP disappears from Redis after 10 minutes with zero extra code. In the database, you need a cleanup job.
2. Redis is faster. An OTP lookup is a single key-value read — Redis handles this in microseconds.
3. OTPs are temporary data. Storing them in the permanent database creates unnecessary clutter and risk.

### The auth flow step by step

1. Member calls `POST /api/v1/auth/register/` — account is created, OTP is sent to phone
2. Member calls `POST /api/v1/auth/verify-otp/` — OTP is checked in Redis, account is marked verified, JWT tokens are returned
3. On subsequent visits, member calls `POST /api/v1/auth/login/` — credentials are checked, JWT tokens are returned
4. Every API request includes `Authorization: Bearer <access_token>` in the header
5. When the access token expires, the app calls `POST /api/v1/auth/refresh/` with the refresh token to get a new access token
6. When the member logs out, the app calls `POST /api/v1/auth/logout/` — the refresh token is blacklisted

---

## 17. API Views — How They Work

### What a view is in Django REST Framework

A view is a Python function or class that receives an HTTP request and returns an HTTP response. When a request arrives at `/api/v1/auth/login/`, Django looks up which view is registered for that URL and calls it.

### Function-based views vs class-based views

A function-based view is a plain Python function that takes a `request` and returns a `response`. A class-based view is a Python class where each HTTP method (GET, POST, PATCH, DELETE) is a separate method on the class.

We use class-based views throughout NARA because:

- They keep all the logic for one resource in one place. All member profile operations (GET and PATCH) live in `MemberProfileView`.
- They are cleaner when one URL supports multiple HTTP methods. Without class-based views, you would write one function with `if request.method == "GET"` / `elif request.method == "PATCH"` branching.
- DRF's `APIView` base class gives us authentication, permission checking, and content negotiation for free.

### What serialization means

Serialization is converting a Python object (like a Django model instance) into a format that can be sent over the network — specifically, into JSON. Deserialization is the reverse: converting incoming JSON into validated Python data.

A serializer does three things:

1. **Converts model instances to JSON** for API responses
2. **Validates incoming data** before saving it (runs all the field validators)
3. **Creates or updates model instances** from validated data

Without serializers, you would manually write `{"id": str(member.id), "email": member.email, ...}` for every response and manually validate every incoming field. Serializers remove that repetitive work.

---


## 18. The Matching Algorithm

**File:** `apps/groups/matching.py`

When a member completes onboarding, they get matched to a savings group. The algorithm works as follows:

1. Find all groups in `FORMING` status
2. Filter to only groups where `goal_type` matches the member's `savings_goal`
3. Filter further to groups where `contribution_tier` matches the member's `contribution_tier`
4. Remove any group that is already at full capacity
5. From the remaining candidates, return the one with the **highest current member count** (closest to being full)

### Why we pick the fullest group instead of the emptiest

Filling groups faster is better for everyone:

- **For members:** A full group activates sooner. Members start earning their pot sooner. An empty group that takes months to fill means months of waiting before anyone sees any benefit.
- **For the business:** Groups that activate generate revenue. Groups stuck in `FORMING` status are dead capital. The faster groups fill, the faster NARA's business model works.

This is a simple but effective greedy algorithm — at each step, we make the locally optimal choice (put the next member in the fullest available group) which also produces the globally optimal outcome (all groups fill up faster).

### When there is no matching group

If no group matches, the member lands on the waitlist. The API response tells them this and shows their queue position if they are already waiting for the same goal and tier.

---

## 19. Background Tasks — Celery

### What a background task is

A background task is work that runs outside of the request-response cycle. When the API gets a request, it must respond within a few seconds or the client times out. Some work takes longer than that — or should not run during a request at all. Background tasks handle that work.

### Why we cannot run these things inside a regular API view

Imagine a member triggers a deduction for all 500 active standing orders. Processing 500 bank debits takes several minutes. If you did this inside a view, the API would hang for minutes, the client would time out and show an error, and the deductions might run in an inconsistent state. Background tasks let the API respond immediately ("deductions scheduled") and do the actual work in a separate process.

### What Celery is

Celery is a task queue system for Python. It lets you define functions as "tasks" using the `@shared_task` decorator, then call them with `.delay()` to run them in the background. A separate Celery worker process picks them up and executes them.

### What Redis is and why Celery needs it

Redis is an in-memory key-value database. It is extremely fast because it stores everything in RAM instead of on disk. Celery uses Redis as its **message broker** — the API process drops a task message into Redis, and the Celery worker process picks it up. Without Redis, the two processes have no way to communicate.

### Scheduled tasks vs on-demand tasks

- **On-demand:** triggered by an API request. Example: `send_otp.delay(phone)` is called when a user registers.
- **Scheduled:** triggered automatically on a timer by Celery Beat. Example: `process_monthly_deductions` runs on the 25th of every month at 6am.

Celery Beat reads the schedule from the database (managed by `django-celery-beat`) and fires the right tasks at the right time.

### How to read a crontab expression

```python
crontab(hour=6, minute=0, day_of_month=25)
```

This means: run at **6:00am** on the **25th** of every month. Reading it: minute=0 (on the hour), hour=6 (6am), day_of_month=25 (on the 25th).

```python
crontab(hour=9, minute=0)
```

This means: run at **9:00am every day**. No `day_of_month` means it runs daily.

### The tasks in NARA

| Task | When it runs | What it does |
|---|---|---|
| `process_monthly_deductions` | 25th of every month, 6am | Debits every active standing order via Flutterwave, creates Contribution records, sends SMS confirmation |
| `check_failed_deductions` | Every day, 9am | Finds contributions that failed in the last 7 days, sends reminder SMS, suspends members with 3 consecutive failures |
| `trigger_pot_disbursement` | Last day of every month, 5pm | Checks all contributions are processed, transfers pot to that month's collector, sends WhatsApp to collector, sends in-app notification to all group members, advances the cycle |
| `send_deduction_reminders` | Every day, 8am | Checks if any member's deduction day is 3 days away, sends WhatsApp reminder |
| `update_reserve_fund` | Called after every successful contribution | Adds 2% of the contribution amount to the group's reserve fund |
| `check_grace_periods` | Every day, 8:30am | Finds members in grace period whose 60 days have elapsed, triggers waitlist promotion |
| `promote_waitlist_member` | Called when a slot opens | Finds highest-priority matching waitlist member, adds them to the group, sends WhatsApp welcome message |

---


## 20. Security

### JWT authentication

Every endpoint in NARA requires a valid JWT access token except `register`, `verify-otp`, `login`, `forgot-password`, and `reset-password`. Those endpoints must be publicly accessible because the user has no token yet.

The token is sent in the `Authorization` header: `Authorization: Bearer <your_access_token>`.

If the token is missing, expired, or tampered with, Django REST Framework returns a `401 Unauthorized` response and the request never reaches the view code.

### Rate limiting on auth endpoints

**What a brute force attack is:** An attacker writes a script that tries thousands of passwords against a login endpoint. Without rate limiting, the script can try indefinitely.

**How rate limiting stops it:** We limit login and OTP endpoints to 5 attempts per minute per IP address. After 5 attempts, the server returns `429 Too Many Requests`. A script that needs to try 100,000 passwords would take over 13 hours to finish, by which time the account holder would notice and the attacker's IP would be blocked.

We use `django-ratelimit` for this with a custom throttle scope called `auth_login` and `auth_otp`.

### CORS configuration

**What CORS is:** Cross-Origin Resource Sharing. A browser security rule that blocks JavaScript on one domain from making API requests to a different domain. For example, if a malicious website at `evil.com` tries to make an API call to `api.nara.ng` on behalf of a logged-in NARA user, CORS stops it.

**What happens without CORS config:** Every request from your frontend app is blocked by the browser. The app is completely non-functional for web users.

**Why we only allow our own domain:** If we set `CORS_ALLOW_ALL_ORIGINS = True`, any website can make authenticated requests to our API on behalf of our users. In development we allow all origins for convenience. In production we allow only the real NARA app domain.

### Never logging sensitive data

Account numbers, BVN and passwords are never written to log files. This is a CBN compliance requirement. Log files are often stored as plain text, accessible to anyone with server access, and sometimes sent to third-party logging services. A leaked log file should contain zero sensitive customer data. This is enforced by a comment in the logging configuration as a permanent reminder to every developer who works on this codebase.

### Flutterwave webhook signature verification

**What a webhook is:** A webhook is an HTTP request that Flutterwave sends to your server when something happens — like a payment succeeding. Instead of you constantly polling Flutterwave asking "has anything happened?", Flutterwave pushes the update to you.

**What a signature is:** Flutterwave signs every webhook payload with your secret key using HMAC-SHA256. The signature is included in the `verif-hash` header of the webhook request.

**What happens if we skip verification:** Anyone on the internet can send a POST request to your webhook endpoint pretending to be Flutterwave, claiming a payment was successful. Your server would mark the contribution as `PROCESSED` and trigger a pot disbursement — without any real money ever having moved. Verifying the signature ensures the webhook genuinely came from Flutterwave.

---

## 21. Automated Tests

### What automated testing is

You write code that checks your code. Every test describes one specific thing the system should do, runs it, and verifies the result. If the result is wrong, the test fails and you know exactly what broke.

### Why we write tests

Without tests, the only way to know if something works is to manually click through the app after every change. For a financial application, this is not acceptable. A bug in the disbursement logic can send ₦1.8 million to the wrong person. Tests catch that before it reaches production.

Tests also give you confidence to make changes. When you add a new feature, if all existing tests still pass, you know you have not accidentally broken anything that was working before.

### What happens to a financial application without tests

Without tests, every deployment is a gamble. A small change in one part of the codebase can silently break the rotation logic, causing the wrong member to receive the pot. This kind of bug might not be noticed for an entire month cycle, by which time real money has been incorrectly disbursed, trust is broken, and recovery is expensive and complicated.

### Unit test vs integration test

- **Unit test:** Tests one function in isolation. Example: does `validate_nigerian_phone` correctly reject `+447911123456`? The test calls the function directly with specific input and checks the output.
- **Integration test:** Tests multiple parts working together through the full stack. Example: a member registers, verifies their OTP, and the database record is updated correctly. The test makes real HTTP calls through the API and checks both the response and the database state.

NARA's tests are primarily integration tests because the behaviour we care about — "does a member get matched to the right group?" — spans models, serializers, views, and the database all working together.

### How the tests are named

Test names read like specification documents:

- `test_a_new_member_can_register_with_valid_nigerian_phone_and_receives_otp`
- `test_disbursement_does_not_trigger_if_any_contribution_in_the_group_is_still_pending`
- `test_insurance_claim_cannot_be_filed_twice_for_the_same_member`

A non-developer reading these names understands exactly what the system is supposed to do. This makes tests double as documentation.

### Running the tests

```bash
python manage.py test apps
```

To run tests for a specific app:

```bash
python manage.py test apps.authentication
python manage.py test apps.contributions
python manage.py test apps.groups
```

---


## 22. Running the Project Locally

### Prerequisites

- Python 3.11+
- MySQL Server (you have MySQL Workbench)
- Redis (download from redis.io or use Docker: `docker run -d -p 6379:6379 redis`)

### Step-by-step setup

**1. Create a virtual environment**
```bash
cd nara
python -m venv venv
venv\Scripts\activate        # Windows
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Create the database in MySQL Workbench**

Open MySQL Workbench and run:
```sql
CREATE DATABASE nara_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**4. Configure your environment variables**

Copy `.env.example` to `.env` and fill in your values:
```
SECRET_KEY=any-long-random-string-you-make-up
DEBUG=True
DB_NAME=nara_db
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_HOST=localhost
DB_PORT=3306
REDIS_URL=redis://localhost:6379/0
FLUTTERWAVE_SECRET_KEY=     ← leave blank for now
FLUTTERWAVE_PUBLIC_KEY=     ← leave blank for now
TERMII_API_KEY=             ← leave blank for now
TERMII_SENDER_ID=NARA
```

**5. Run migrations** (this creates all the database tables)
```bash
python manage.py migrate
```

**6. Create a superuser** (for the admin panel)
```bash
python manage.py createsuperuser
```

**7. Start the development server**
```bash
python manage.py runserver
```

The API is now available at `http://localhost:8000/api/v1/`
The admin panel is at `http://localhost:8000/admin/`

**8. Start the Celery worker** (in a separate terminal)
```bash
celery -A config worker --loglevel=info
```

**9. Start Celery Beat** (in a third terminal, for scheduled tasks)
```bash
celery -A config beat --loglevel=info
```

---

## 23. Deploying to Render

### What Render is

Render is a cloud hosting platform. You connect your GitHub repository, configure your environment variables, and Render builds and runs your application. It handles HTTPS, domain management, and automatic deployments when you push to your repository.

### The Procfile

The `Procfile` tells Render how to run your application:

```
web: gunicorn config.wsgi:application --workers 2 --threads 2 --bind 0.0.0.0:$PORT
worker: celery -A config worker --loglevel=info --concurrency=2
beat: celery -A config beat --loglevel=info
```

- `web` — the Django API, served by Gunicorn (a production-grade Python web server)
- `worker` — the Celery task processor
- `beat` — the Celery task scheduler

### Environment variables to set on Render

Set these in your Render service's Environment settings. Never commit these values to git:

| Variable | Description |
|---|---|
| `SECRET_KEY` | A long random string. Generate one at: `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | `False` |
| `DJANGO_SETTINGS_MODULE` | `config.settings.prod` |
| `DB_NAME` | Your MySQL database name |
| `DB_USER` | Your MySQL username |
| `DB_PASSWORD` | Your MySQL password |
| `DB_HOST` | Your MySQL host (from your database provider) |
| `DB_PORT` | `3306` |
| `REDIS_URL` | Your Redis URL (Render provides Redis as an add-on) |
| `FLUTTERWAVE_SECRET_KEY` | From your Flutterwave dashboard |
| `FLUTTERWAVE_PUBLIC_KEY` | From your Flutterwave dashboard |
| `TERMII_API_KEY` | From your Termii dashboard |
| `TERMII_SENDER_ID` | `NARA` (or your registered sender ID) |
| `ALLOWED_HOSTS` | `your-app.onrender.com,api.nara.ng` |
| `CORS_ALLOWED_ORIGINS` | `https://nara.ng,https://app.nara.ng` |
| `SENTRY_DSN` | From your Sentry project settings (optional but recommended) |

### Deployment steps

1. Push your code to GitHub: `git push origin main`
2. Create a new Web Service on Render and connect your GitHub repository
3. Set `Build Command` to: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
4. Set `Start Command` to: `gunicorn config.wsgi:application --workers 2 --bind 0.0.0.0:$PORT`
5. Add all environment variables from the table above
6. Create a separate Render Background Worker for Celery using the `worker` command from the Procfile
7. Create another Background Worker for Celery Beat using the `beat` command

### After deployment

- Run `python manage.py createsuperuser` using Render's shell to create your admin account
- Visit `https://your-app.onrender.com/admin/` to access the admin panel
- Test the API at `https://your-app.onrender.com/api/v1/auth/register/`

---

*Documentation generated for NARA v1.0 — July 2026*
