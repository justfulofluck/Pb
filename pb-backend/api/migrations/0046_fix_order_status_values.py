from django.db import migrations


def fix_order_statuses(apps, schema_editor):
    Order = apps.get_model('api', 'Order')
    Order.objects.filter(status="Pending").update(status="PENDING")
    Order.objects.filter(status="Processing").update(status="PAID")


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0045_visitorform_require_email_verification'),
    ]

    operations = [
        migrations.RunPython(fix_order_statuses),
    ]
