from django.shortcuts import render

from django.contrib.auth import authenticate, login as dj_login
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomerSignUpForm, SiteAdminSignUpForm, HotelAdminSignUpForm
from django.http import JsonResponse
from .models import *

import json


@csrf_exempt
def signup_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data.get('username')
        password = data.get('password')
        print(username, password)

        form = CustomerSignUpForm(data)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!')

        print(f'form error {form.errors}')
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
        return HttpResponse('Wrong password or username')

    return HttpResponse('Please login with post method')


@csrf_exempt
def hotel_search(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(data['searchItem'])
        # print(request.POST)
        # TODO: Return name, location, free rooms and main image of all similar hotel names.
        # Every hotel has a main image and some sub image.
        return HttpResponse('mashkhar')

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def hotel_data(request):
    if request.method == 'GET':

        # TODO: Return all details of specific hotel by its id.
        index = request.GET.get('index')
        result = {}
        if index is not None:
            result = {'name': f'mashkhar Hotel {index}', 'stars': 5}
            return JsonResponse({'data': result})

    return HttpResponse('Only post method allowed!')


import os

@csrf_exempt
def get_hotels(request):
    hotels = Hotel.objects.all()
    return JsonResponse({'image_urls': [hotel.image.path for hotel in hotels]})


@csrf_exempt
def get_specific_image(request):
    data = json.loads(request.body.decode('utf-8'))
    image_path = data.get('url')
    print(image_path)
    if os.path.exists(image_path):
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type='image/jpeg')
    else:
        return JsonResponse({'error': 'Image not found'}, status=404)


@csrf_exempt
def search(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        search_phrase = data['search_phrase']
        cities = City.objects.filter(name__contains=search_phrase).values_list("name", flat=True)
        hotels = Hotel.objects.filter(name__contains=search_phrase).values_list("name", flat=True)
        print(hotels)
        return JsonResponse({'cities': list(cities), 'hotels': list(hotels)})

    return HttpResponse('Only post method allowed!')
