# Generated by Django 3.2 on 2021-11-02 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0024_alter_lot_sell_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='position',
            name='cost_basis',
            field=models.DecimalField(decimal_places=5, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='position',
            name='realized_gain',
            field=models.DecimalField(decimal_places=5, default=0, max_digits=12),
        ),
    ]
