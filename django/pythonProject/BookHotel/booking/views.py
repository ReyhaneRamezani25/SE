from django.shortcuts import render

from django.contrib.auth import authenticate, login as dj_login
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user:
            dj_login(request, user)
            return HttpResponse('Login completed!')
        return HttpResponse('Wrong password/username')

    return HttpResponse('Please login with post method')