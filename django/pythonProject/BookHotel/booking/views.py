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
        print(request.POST)
        # TODO: Return name, location, free rooms and main image of all similar hotel names.
        # Every hotel has a main image and some sub image.
        return HttpResponse('mashkhar')

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def hotel_data(request):
    # gets a hotel_id and return that hotel's data
    if request.method == 'POST':
        hotel_id = request.POST.get('hotel_id')
        hotel = Hotel.objects.filter(id=hotel_id).values()
        return JsonResponse({'hotel': list(hotel)})

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def get_hotels_of_a_city(request):
    # gets a city_id and return all hotels in that city
    if request.method == 'POST':
        city_id = request.POST.get('city_id')
        hotels = Hotel.objects.filter(city__id=city_id).values()
        return JsonResponse({'hotel': list(hotels)})

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def search(request):
    if request.method == 'POST':
        search_phrase = request.POST.get('search_phrase')
        cities = City.objects.filter(name__contains=search_phrase).values_list('id', 'name')
        hotels = Hotel.objects.filter(name__contains=search_phrase).values_list('id', 'name')
        return JsonResponse({'cities': list(cities), 'hotels': list(hotels)})

    return HttpResponse('Only post method allowed!')
