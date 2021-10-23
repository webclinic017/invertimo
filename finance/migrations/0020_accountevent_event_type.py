# Generated by Django 3.2 on 2021-09-27 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0019_auto_20210822_1952'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountevent',
            name='event_type',
            field=models.IntegerField(choices=[(1, 'DEPOSIT'), (2, 'WITHDRAWAL'), (3, 'DIVIDEND')], default=1),
            preserve_default=False,
        ),
    ]
