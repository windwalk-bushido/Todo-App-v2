#/bin/bash

docker-compose exec api python manage.py makemigrations
docker-compose exec api python manage.py migrate
