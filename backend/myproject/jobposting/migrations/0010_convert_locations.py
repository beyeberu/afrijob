from django.db import migrations

def convert_locations(apps, schema_editor):
    JobPost = apps.get_model('jobposting', 'JobPost')
    Location = apps.get_model('jobs', 'Location')
    for job in JobPost.objects.all():
        # If location is a string (not a Location FK), convert it
        if isinstance(job.location_id, str):
            location, _ = Location.objects.get_or_create(
                name=job.location_id,
                defaults={'slug': job.location_id.lower().replace(' ', '-')}
            )
            job.location_id = location.id
            job.save()

class Migration(migrations.Migration):

    dependencies = [
        ('jobposting', '0009_alter_jobpost_location'),  # Update if needed
    ]

    operations = [
        migrations.RunPython(convert_locations),
    ]