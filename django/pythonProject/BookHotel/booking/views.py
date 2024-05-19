from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as dj_login
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomerSignUpForm, SiteAdminSignUpForm, HotelAdminSignUpForm
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import *
from .serializers import *

import json


@csrf_exempt
def signup_customer(request):
    if request.method == 'POST':
        # data = json.loads(request.body.decode('utf-8'))
        data = request.POST
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


# @csrf_exempt
# def signup_site_admin(request):
#     if request.method == 'POST':
#         form = SiteAdminSignUpForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return HttpResponse('User created successfully!')
#
#         return HttpResponse(f"{form.errors}")
#
#     return HttpResponse('Only post method allowed!')


# @csrf_exempt
# def signup_hotel_admin(request):
#     if request.method == 'POST':
#         form = HotelAdminSignUpForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return HttpResponse('User created successfully!')
#
#         return HttpResponse(f"{form.errors}")
#
#     return HttpResponse('Only post method allowed!')

class HotelAPIView(APIView):
    def post(self, request):
        hotel_serializer = HotelSerializer(data=request.data)
        if hotel_serializer.is_valid():
            hotel_serializer.save()
            return Response({'message': 'Hotel added successfully!'})

        return Response({'message': hotel_serializer.errors})


class HotelAdminAPIView(APIView):
    def post(self, request):
        hotel_admin_serializer = HotelAdminSerializer(data=request.data)
        if hotel_admin_serializer.is_valid():
            hotel_admin_serializer.save()
            return Response({'message': 'Hotel added successfully!'})

        return Response({'message': hotel_admin_serializer.errors})


@csrf_exempt
def login_customer(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # if not username and not password:
        #     data = json.loads(request.body)
        #     username = data.get('username')
        #     password = data.get('password')

        user = authenticate(request, username=username, password=password)
        print(username, password)
        if user and isinstance(user.user_type, Customer):
            dj_login(request, user)
            return HttpResponse('Login Accepted!')
        return HttpResponse('Wrong password or username')

    return HttpResponse('Please login with post method')


@csrf_exempt
def login_site_admin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = SiteAdmin.objects.filter(user__username=username).get(user__password=password)
        print(username, password)
        print(user)
        if user:
            dj_login(request, user.user)
            return HttpResponse('Login Accepted!')
        return HttpResponse('Wrong password or username')

    return HttpResponse('Please login with post method')


@csrf_exempt
def login_hotel_admin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        print(username, password)
        if user and isinstance(user.user_type, HotelAdmin):
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
    if request.method == 'POST':  # GET
        hotel_id = request.POST.get('hotel_id')
        hotel = Hotel.objects.filter(id=hotel_id).values()
        return JsonResponse({'hotel': list(hotel)})

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
        data = json.loads(request.body.decode('utf-8'))
        search_phrase = data['search_phrase']
        cities = City.objects.filter(name__contains=search_phrase).values_list('id', 'name')
        hotels = Hotel.objects.filter(name__contains=search_phrase).values_list('id', 'name')
        return JsonResponse({'cities': list(cities), 'hotels': list(hotels)})
    return HttpResponse('Only post method allowed!')
"""
{
    "name" : "random hotel",
    "location_x" : "1",
    "location_y" : "1",
    "address": "ad",
    "stars" : "1",
    "rating" : "1",
    "number_of_rates" : "1",
    "number_of_rooms" : "1",
    "facilities" :"sample"
}
"""