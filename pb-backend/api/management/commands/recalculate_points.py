from django.core.management.base import BaseCommand
from django.db.models import Sum
from api.models import UserProfile, RewardTransaction


class Command(BaseCommand):
    help = "Recalculate UserProfile.points and tier from RewardTransaction records"

    def handle(self, *args, **options):
        profiles = UserProfile.objects.all()
        fixed = 0

        for profile in profiles:
            total = RewardTransaction.objects.filter(user=profile.user).aggregate(
                total=Sum("points_change")
            )["total"] or 0

            if profile.points != total:
                self.stdout.write(
                    f"Fixing {profile.user.username}: {profile.points} -> {total}"
                )
                profile.points = total

                if total >= 3000:
                    profile.tier = "Legend Tier"
                elif total >= 1000:
                    profile.tier = "Pro Elite"
                elif total >= 500:
                    profile.tier = "Pro Member"
                else:
                    profile.tier = "Member"

                profile.save(update_fields=["points", "tier"])
                fixed += 1

        if fixed:
            self.stdout.write(self.style.SUCCESS(f"Fixed {fixed} profile(s)"))
        else:
            self.stdout.write(self.style.SUCCESS("All profiles already correct"))
