from django.shortcuts import render

from django.contrib.auth import authenticate, login as dj_login
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomerSignUpForm, SiteAdminSignUpForm, HotelAdminSignUpForm

import json

@csrf_exempt
def signup_customer(request):
    if request.method == 'POST':
        form = CustomerSignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!')

        return HttpResponse(f"{form.errors}")

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def signup_site_admin(request):
    if request.method == 'POST':
        form = SiteAdminSignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!')

        return HttpResponse(f"{form.errors}")

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def signup_hotel_admin(request):
    if request.method == 'POST':
        form = HotelAdminSignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!')

        return HttpResponse(f"{form.errors}")

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def login(request):
    if request.method == 'POST':
        
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username and not password:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

        user = authenticate(request, username=username, password=password)
        print(username, password)
        if user:
            dj_login(request, user)
            return HttpResponse('Login Accepted!')
        return HttpResponse('Wrong password/username')

    return HttpResponse('Please login with post method')
