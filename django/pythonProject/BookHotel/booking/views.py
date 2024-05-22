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

from django.contrib.auth import update_session_auth_hash
import json


# -------------------------- Customer -------------------------- #

@csrf_exempt
def signup_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']

        form = CustomerSignUpForm(data)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!')

        if form.errors:
            print(f'form error {form.errors}')
            return HttpResponse(f"User with the username {username} already exist")

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def change_password_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        current_password = data['current_password']
        new_password = data['new_password']

        user = authenticate(request, username=username, password=current_password)
        if user:
            user.set_password(new_password)
            user.save()
            # Update the session with the new password hash
            update_session_auth_hash(request, user)
            return HttpResponse('Password changed successfully!')
        else:
            return HttpResponse('Current password is incorrect')

    return HttpResponse('Please change password with post method')


@csrf_exempt
def login_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        user = authenticate(request, username=username, password=password)
        if user and isinstance(user.user_type, Customer):
            dj_login(request, user)
            return HttpResponse('Login Accepted!')
        return HttpResponse('Wrong password or username')

    return HttpResponse('Please login with post method')


# -------------------------- Hotel Admin -------------------------- #

@csrf_exempt
def signup_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']
        hotel_id = int(data['hotel_id'])
        del data['hotel_id']

        hotel = Hotel.objects.get(id=hotel_id)
        form = CustomerSignUpForm(data)
        if form.is_valid():
            hotel_admin = form.save()
            hotel_admin = HotelAdmin.objects.create(user=hotel_admin, hotel=hotel)
            hotel_admin.save()
            return HttpResponse('Admin Hotel created successfully!')

        if form.errors:
            print(f'form error {form.errors}')
            return HttpResponse(f"User with the username {username} already exist")

    return HttpResponse('Only post method allowed!')


@csrf_exempt
def change_password_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        current_password = data['current_password']
        new_password = data['new_password']

        try:
            tmp = HotelAdmin.objects.filter(user__username=username)
            if not tmp:
                return HttpResponse('Wrong password or username')

            user = authenticate(request, username=username, password=current_password)
            if user:
                user.set_password(new_password)
                user.save()
                # Update the session with the new password hash
                update_session_auth_hash(request, user)
                return HttpResponse('Password changed successfully!')
            else:
                return HttpResponse('Current password is incorrect')
        except:
            return HttpResponse('Wrong password or username')
    return HttpResponse('Please login with post method')


from django.contrib.auth.hashers import make_password
@csrf_exempt
def login_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        try:
            user = authenticate(request, username=username, password=password)
            if not user:
                return HttpResponse('Wrong password or username')
            tmp = HotelAdmin.objects.filter(user__username=username)
            if not tmp:
                return HttpResponse('Wrong password or username')
            dj_login(request, user)
            return HttpResponse('Login Accepted!')                
        except:
            return HttpResponse('Wrong password or username')
    return HttpResponse('Please login with post method')


# -------------------------- OTHERS -------------------------- #


class HotelAPIView(APIView):
    def post(self, request):
        hotel_serializer = HotelSerializer(data=request.data)
        if hotel_serializer.is_valid():
            hotel_serializer.save()
            print('alll')
            return Response({'message': 'Hotel added successfully!'})

        print('none')
        print(hotel_serializer.errors)
        return Response({'message': hotel_serializer.errors})


class HotelAdminAPIView(APIView):
    def post(self, request):
        hotel_admin_serializer = HotelAdminSerializer(data=request.data)
        if hotel_admin_serializer.is_valid():
            hotel_admin_serializer.save()
            return Response({'message': 'Hotel added successfully!'})

        return Response({'message': hotel_admin_serializer.errors})


@csrf_exempt
def hotel_list(request):
    hotels = Hotel.objects.all()

    hotels_data = []

    for hotel in hotels:
        name = 'null'
        province = 'null'
        if hotel.city:
            name = hotel.city.name
            province = hotel.city.province
        hotels_data.append(
            {
                'شناسه': hotel.id,
                'نام': hotel.name,
                'آدرس': hotel.address,
                'ستاره': hotel.rating,
                'شهر': name,
                'استان': province,
            }
        )

    return JsonResponse(hotels_data, safe=False)


@csrf_exempt
def login_site_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        try:
            user = SiteAdmin.objects.filter(user__username=username).get(user__password=password)
            if user:
                dj_login(request, user.user)
                return HttpResponse('Login Accepted!')
        except SiteAdmin.DoesNotExist:
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
    print(hotels)
    image_urls = []
    for hotel in hotels:
        try:
            image_urls.append(hotel.image.path)
        except Exception:
            # Maybe, one Hotel has not any Image at all
            continue
    return JsonResponse({'image_urls': image_urls})


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
