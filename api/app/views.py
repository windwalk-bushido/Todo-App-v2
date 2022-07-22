from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *


@api_view(['GET'])
def get_todos(request):
    try:
        queryset = Todo.objects.all().order_by('id')
        todos = TodoSerializer(queryset, many=True)
        return Response(todos.data)
    except:
        return Response({'message': 'Getting todos -> FAILED'})


@api_view(['GET'])
def get_todo_by_id(request, id):
    try:
        queryset = Todo.objects.get(id=id)
        todo = TodoSerializer(queryset, many=False)
        return Response(todo.data)
    except:
        return Response({'message': 'Getting todo by ID -> FAILED'})


@api_view(['POST'])
def add_todo(request):
    try:
        new_todo = TodoSerializer(data=request.data)
        if new_todo.is_valid():
            new_todo.save()
        return Response(new_todo.data)
    except:
        return Response({'message': 'Adding -> FAILED'})


@api_view(['PUT'])
def update_todo(request, id):
    try:
        todo = Todo.objects.get(id=id)
        updated_todo = TodoSerializer(instance=todo, data=request.data)
        if updated_todo.is_valid():
            updated_todo.save()
        return Response(updated_todo.data)
    except:
        return Response({'message': 'Updating -> FAILED'})


@api_view(['DELETE'])
def delete_todo(request, id):
    try:
        todo = Todo.objects.get(id=id)
        todo.delete()
        return Response({'message': 'Deleting todo was successfull'})
    except:
        return Response({'message': 'Deleting -> FAILED'})
