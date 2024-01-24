from django.shortcuts import render
from django.http import JsonResponse
from .models import PushToken
from django.views.decorators.http import require_POST


@require_POST
def save_token(request):
    token = request.POST.get('token')
    user = request.user  # Assuming the user is authenticated
    PushToken.objects.update_or_create(user=user, defaults={'token': token})
    return JsonResponse({'status': 'success'})


@require_POST
def delete_token(request):
    user = request.user  # Assuming the user is authenticated
    PushToken.objects.filter(user=user).delete()
    return JsonResponse({'status': 'success'})
