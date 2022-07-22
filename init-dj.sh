#/bin/bash

docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
docker-compose exec api python manage.py createsuperuser

# Make .env file where django settings.py file is
# Make .env file where next package.json file is
