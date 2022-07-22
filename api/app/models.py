from django.db import models


class Todo(models.Model):
    body = models.TextField(max_length=256)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.body

    class Meta:
        ordering = ['done']
