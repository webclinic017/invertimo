# Generated by Django 3.2 on 2021-10-23 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0021_auto_20210929_1246'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountevent',
            name='withheld_taxes',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=18),
        ),
    ]
