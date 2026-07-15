# Celery beat schedule - disabled for Vercel deployment
# To enable, add 'celery' and 'django-celery-beat' to requirements.txt

"""
from celery.schedules import crontab

# Celery Beat schedule configuration
CELERY_BEAT_SCHEDULE = {
    # Monthly deductions - 25th of every month at 6am WAT (Lagos time)
    "process-monthly-deductions": {
        "task": "apps.contributions.tasks.process_monthly_deductions",
        "schedule": crontab(hour=6, minute=0, day_of_month=25),
        "options": {"queue": "deductions"},
    },
    # Failed deduction reminders - every day at 9am
    "check-failed-deductions": {
        "task": "apps.contributions.tasks.check_failed_deductions",
        "schedule": crontab(hour=9, minute=0),
        "options": {"queue": "reminders"},
    },
    # Pot disbursement - last day of month at 5pm
    "trigger-pot-disbursement": {
        "task": "apps.contributions.tasks.trigger_pot_disbursement",
        "schedule": crontab(hour=17, minute=0, day_of_month="last"),
        "options": {"queue": "disbursements"},
    },
    # Deduction reminders - run daily to check who has deductions in 3 days
    "send-deduction-reminders": {
        "task": "apps.contributions.tasks.send_deduction_reminders",
        "schedule": crontab(hour=8, minute=0),
        "options": {"queue": "reminders"},
    },
    # Grace period checks - daily at 8am
    "check-grace-periods": {
        "task": "apps.contributions.tasks.check_grace_periods",
        "schedule": crontab(hour=8, minute=0),
        "options": {"queue": "insurance"},
    },
}
"""