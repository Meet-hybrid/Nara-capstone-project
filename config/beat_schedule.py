from celery.schedules import crontab

# All times are Lagos time (Africa/Lagos, UTC+1)
CELERY_BEAT_SCHEDULE = {
    # Deduct contributions on the 25th of every month at 6:00am
    "process-monthly-deductions": {
        "task": "apps.contributions.tasks.process_monthly_deductions",
        "schedule": crontab(hour=6, minute=0, day_of_month=25),
    },
    # Check for failed deductions every day at 9:00am
    "check-failed-deductions": {
        "task": "apps.contributions.tasks.check_failed_deductions",
        "schedule": crontab(hour=9, minute=0),
    },
    # Trigger pot disbursements on the last day of each month at 5:00pm
    "trigger-pot-disbursement": {
        "task": "apps.contributions.tasks.trigger_pot_disbursement",
        "schedule": crontab(hour=17, minute=0, day_of_month="last"),
    },
    # Send deduction reminders every day at 8:00am (task checks if deduction day is in 3 days)
    "send-deduction-reminders": {
        "task": "apps.contributions.tasks.send_deduction_reminders",
        "schedule": crontab(hour=8, minute=0),
    },
    # Check grace periods every day at 8:00am
    "check-grace-periods": {
        "task": "apps.contributions.tasks.check_grace_periods",
        "schedule": crontab(hour=8, minute=30),
    },
}
