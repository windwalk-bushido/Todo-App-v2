from rest_framework import serializers as S
from .models import *


class TodoSerializer(S.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
