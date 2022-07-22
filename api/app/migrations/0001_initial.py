# Generated by Django 4.0.6 on 2022-07-18 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField(max_length=256)),
                ('done', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['done'],
            },
        ),
    ]
