# Generated by Django 4.2.1 on 2023-06-01 02:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_name', models.CharField(max_length=50)),
                ('user_type', models.CharField(max_length=50)),
                ('is_employee', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=255)),
                ('company_address', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=2)),
                ('city', models.CharField(max_length=255)),
                ('zip', models.CharField(max_length=10)),
                ('is_uninitialized', models.BooleanField(default=False)),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Accounts.role')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
