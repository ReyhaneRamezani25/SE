from django.shortcuts import render
from drf_yasg import openapi
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as dj_login
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import CustomerSignUpForm
from django.core.exceptions import SuspiciousOperation
from rest_framework.views import APIView
from django.http import JsonResponse

from .models import Hotel, HotelAdmin, Room, Reservation, SiteAdmin, Customer
from .serializers import HotelSerializer, HotelAdminSerializer, CitySerializer, GuestSerializer, RoomSerializer, \
    ReservationSerializer
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth import update_session_auth_hash
import json
import persian
import os


# ------------------------- error handlers ----------------------#
def error_404_view(request, exception):
    return render(request, '404.html', status=404)


def error_400_view(request, exception):
    return render(request, '400.html', status=400)


def error_500_view(request):
    return render(request, '500.html', status=500)


# -------------------------- Check Error Handlers ---------------#

def trigger_400_error(request):
    raise SuspiciousOperation("This is a test 400 error!")


def trigger_500_error(request):
    raise Exception("This is a test 500 error!")


# -------------------------- REST -------------------------- #

class HotelAPIView(APIView):
    @swagger_auto_schema(request_body=HotelSerializer)
    def post(self, request):
        hotel_serializer = HotelSerializer(data=request.data)
        if hotel_serializer.is_valid():
            hotel_serializer.save()
            return Response({'message': 'Hotel added successfully!'})

        print(hotel_serializer.errors)
        return Response({'message': hotel_serializer.errors})


class HotelAdminAPIView(APIView):
    @swagger_auto_schema(request_body=HotelAdminSerializer)
    def post(self, request):
        hotel_admin_serializer = HotelAdminSerializer(data=request.data)
        if hotel_admin_serializer.is_valid():
            hotel_admin_serializer.save()
            return Response({'message': 'HotelAdmin added successfully!'})

        return Response({'message': hotel_admin_serializer.errors})


class CityAPIView(APIView):
    @swagger_auto_schema(request_body=CitySerializer)
    def post(self, request):
        city_serializer = CitySerializer(data=request.data)
        if city_serializer.is_valid():
            city_serializer.save()
            return Response({'message': 'City added successfully!'})

        return Response({'message': city_serializer.errors})


class GuestAPIView(APIView):
    @swagger_auto_schema(request_body=GuestSerializer)
    def post(self, request):
        guest_serializer = GuestSerializer(data=request.data)
        if guest_serializer.is_valid():
            guest_serializer.save()
            return Response({'message': 'Guest added successfully!'})

        return Response({'message': guest_serializer.errors})


class RoomAPIView(APIView):
    @swagger_auto_schema(request_body=RoomSerializer)
    def post(self, request):
        room_serializer = RoomSerializer(data=request.data)
        if room_serializer.is_valid():
            room_serializer.save()
            return Response({'message': 'Room added successfully!'})

        return Response({'message': room_serializer.errors})


class ReservationAPIView(APIView):
    @swagger_auto_schema(request_body=ReservationSerializer)
    def post(self, request):
        reservation_serializer = ReservationSerializer(data=request.data)
        if reservation_serializer.is_valid():
            reservation_serializer.save()
            return Response({'message': 'Reservation added successfully!'})

        return Response({'message': reservation_serializer.errors})


class Test(APIView):
    def post(self, request):
        return Response({'message': 'Hi'})


# -------------------------- Customer -------------------------- #
@csrf_exempt
def signup_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']

        form = CustomerSignUpForm(data)
        if form.is_valid():
            form.save()
            return HttpResponse('User created successfully!', status=200)

        if form.errors:
            print(f'form error {form.errors}')
            return HttpResponse(f"User with the username {username} already exist", status=200)

    return HttpResponse('Only post method allowed!', status=200)


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
            return HttpResponse('Password changed successfully!', status=200)
        else:
            return HttpResponse('Current password is incorrect', status=200)

    return HttpResponse('Please change password with post method', status=200)


@csrf_exempt
def login_customer(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        user = authenticate(request, username=username, password=password)
        if user and isinstance(user.user_type, Customer):

            tmp = HotelAdmin.objects.filter(user__username=username)
            if tmp:
                return HttpResponse('Wrong password or username', status=200)

            dj_login(request, user)
            return HttpResponse('Login Accepted!', status=200)
        return HttpResponse('Wrong password or username', status=200)

    return HttpResponse('Please login with post method', status=200)


# -------------------------- Hotel Admin -------------------------- #

@csrf_exempt
def signup_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        hotel_id = int(data['hotel_id'])
        del data['hotel_id']

        hotel = Hotel.objects.get(id=hotel_id)
        form = CustomerSignUpForm(data)
        if form.is_valid():
            hotel_admin = form.save()
            hotel_admin = HotelAdmin.objects.create(user=hotel_admin, hotel=hotel)
            hotel_admin.save()
            hotel.status = True
            return HttpResponse('Admin Hotel created successfully!', status=200)

        if form.errors:
            print(f'form error {form.errors}')
            return HttpResponse(f"User with the username {username} already exist", status=200)

    return HttpResponse('Only post method allowed!', status=200)


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
                return HttpResponse('Wrong password or username', status=200)

            user = authenticate(request, username=username, password=current_password)
            if user:
                user.set_password(new_password)
                user.save()
                # Update the session with the new password hash
                update_session_auth_hash(request, user)
                return HttpResponse('Password changed successfully!', status=200)
            else:
                return HttpResponse('Current password is incorrect', status=200)
        except:
            return HttpResponse('Wrong password or username', status=200)
    return HttpResponse('Please login with post method', status=200)


@csrf_exempt
def change_password_site_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        current_password = data['current_password']
        new_password = data['new_password']

        try:
            tmp = SiteAdmin.objects.filter(user__username=username)
            if not tmp:
                return HttpResponse('Wrong password or username', status=200)

            user = authenticate(request, username=username, password=current_password)
            if user:
                user.set_password(new_password)
                user.save()
                # Update the session with the new password hash
                update_session_auth_hash(request, user)
                return HttpResponse('Password changed successfully!', status=200)
            else:
                return HttpResponse('Current password is incorrect', status=200)
        except:
            return HttpResponse('Wrong password or username', status=200)
    return HttpResponse('Please login with post method', status=200)


@csrf_exempt
def login_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        try:
            user = authenticate(request, username=username, password=password)
            if not user:
                return HttpResponse('Wrong password or username', status=200)
            tmp = HotelAdmin.objects.filter(user__username=username)
            if not tmp:
                return HttpResponse('Wrong password or username', status=200)
            dj_login(request, user)
            return HttpResponse('Login Accepted!', status=200)
        except:
            return HttpResponse('Wrong password or username', status=200)
    return HttpResponse('Please login with post method', status=200)


@csrf_exempt
def hotel_admin_analysis(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        user = HotelAdmin.objects.filter(user__username=username)[0]
        hotel = user.hotel
        city = 'null'
        province = 'null'

        try:
            if hotel.city:
                city = str(hotel.city.name)
                province = city = str(hotel.city.province)
            result = {
                'نام': hotel.name,
                'طول جغرافیایی': hotel.location_x,
                'عرض جغرافیایی': hotel.location_y,
                'آدرس': hotel.address,
                'تعداد ستاره': hotel.stars,
                # 'ریت': hotel.rating,
                # '': hotel.number_of_rates,
                'تعداد اتاق': hotel.number_of_rooms,
                # '': hotel.facilities,
                'استان': province,
                # '': hotel.brochure,
                # '': hotel.image,
                'شهر': city
            }
            return JsonResponse([result], safe=False)
        except Exception as e:
            print(e)
            return JsonResponse([{
                "": "",
            }], safe=False)


@csrf_exempt
def get_hotel_admin(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        user = authenticate(request, username=data['username'], password=data['password'])
        if not user:
            return HttpResponse('Only Admin can call this API', status=200)
        admin = HotelAdmin.objects.filter(user__username=data['username'])[0]
        hotel = Hotel.objects.filter(id=admin.hotel.id).values()[0]
        hotel['image'] = Hotel.objects.filter(id=admin.hotel.id)[0].image.path
        print(hotel)
        print(type(hotel))
        return JsonResponse(hotel)

    return HttpResponse('Only post method allowed!', status=200)    


# -------------------------- OTHERS -------------------------- #
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


# -------------------------- Site Admin -------------------------- #

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
                return HttpResponse('Login Accepted!', status=200)
        except SiteAdmin.DoesNotExist:
            return HttpResponse('Wrong password or username', status=200)

    return HttpResponse('Please login with post method', status=200)


@csrf_exempt
def hotel_search(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(data['searchItem'])
        return HttpResponse('mashkhar', status=200)

    return HttpResponse('Only post method allowed!', status=200)


@csrf_exempt
def hotel_data(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        hotel_id = data.get('hotel_id')
        hotel = Hotel.objects.filter(id=hotel_id).values()
        return JsonResponse({'hotel': list(hotel)})
    if request.method == 'GET':
        query_params = request.GET
        query_id = int(query_params.get('index'))
        hotel = Hotel.objects.filter(id=query_id).values()[0]
        hotel['image'] = Hotel.objects.filter(id=query_id)[0].image.path
        return JsonResponse(hotel)
    return HttpResponse('Only post method allowed!', status=200)


class HotelDataView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'hotel_id': openapi.Schema(
                    type=openapi.TYPE_STRING),
            }
        )
    )
    def post(self, request):
        hotel_id = request.data.get('hotel_id')
        print(hotel_id)
        hotel = Hotel.objects.filter(id=hotel_id).values()

        print(hotel)
        return JsonResponse({'hotel': list(hotel)})

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('index', openapi.IN_QUERY, type=openapi.TYPE_STRING),
        ]
    )
    def get(self, request):
        query_params = request.GET
        query_id = int(query_params.get('index'))
        hotel = Hotel.objects.filter(id=query_id).values()[0]
        hotel['image'] = Hotel.objects.filter(id=query_id)[0].image.path
        return JsonResponse(hotel)


@csrf_exempt
def get_hotels(request):
    data = json.loads(request.body.decode('utf-8'))
    hotels = Hotel.objects.all().order_by('id')

    if data['search_phrase']:
        if data['search_phrase']['term']:
            hotels = Hotel.objects.filter(name__contains=data['search_phrase']['term']).order_by('id')

    hotel_img_urls = []
    hotel_ids = []
    hotel_names = []
    for hotel in hotels:
        try:
            hotel_img_urls.append(hotel.image.path)
            hotel_ids.append(hotel.id)
            hotel_names.append(hotel.name)
        except Exception:
            # Maybe, one Hotel has not any Image at all
            continue
    print(hotel_img_urls)
    return JsonResponse({'image_urls': hotel_img_urls, 'id': hotel_ids, 'names': hotel_names})


def room_to_values(room):
    room_dict = room.__dict__.copy()
    del room_dict['_state']
    return {
        'type': room_dict['type'],
        # 'number': persian.enToPersianNumb(str(room_dict['number'])) + ' تعداد اتاق ',
        'capacity': ' ظرفیت ' + persian.enToPersianNumb(str(room_dict['capacity'])) + ' نفره ',
        'breakfast': 'همراه صبحانه' if room_dict['breakfast'] else 'فاقد صبحانه',
        'price': ' قیمت ' + persian.enToPersianNumb(str(room_dict['price'])) + ' تومان ',
    }


@csrf_exempt
def get_hotel_rooms(request):
    data = json.loads(request.body.decode('utf-8'))
    rooms = Room.objects.filter(hotel__id=data['id'])
    rooms = rooms.filter(capacity__gt=0)
    rooms_list = [room_to_values(room) for room in rooms]

    room_images = []
    for room in rooms:
        try:
            room_images.append(room.room_image.path)
        except Exception:
            continue

    response_data = {'rooms': rooms_list, 'images': room_images}
    print(room_images)
    return JsonResponse(response_data)


@csrf_exempt
def get_reserved_rooms(request):
    data = json.loads(request.body.decode('utf-8'))
    result = Reservation.objects.filter(registrar__username=data['username'])[0]
    hotel_rooms = result.rooms.all()
    hotel_room_names = [room.type for room in hotel_rooms]
    hotel_names = [room.hotel.name for room in hotel_rooms]
    image_urls = [room.room_image.path for room in hotel_rooms]
    guests = result.guests.all()
    # guest_id = [guest.identity_code for guest in guests]
    # guest_name = [guest.name for guest in guests]

    hotels_data = []
    for i in range(len(hotel_names)):
        hotels_data.append({
            'نام هتل': hotel_names[i],
            'نام اتاق': hotel_room_names[i],
            'hotel_room_images': image_urls[i],
            # 'guests_name': guest_name[i],
            # 'guests_id': guest_id[i],
            'رزرو کننده': result.registrar.username,
            'تاریخ شروع': result.start,
            'تاریخ پایان': result.end,
        })

    return JsonResponse(hotels_data, safe=False)


@csrf_exempt
def get_specific_image(request):
    data = json.loads(request.body.decode('utf-8'))
    image_path = data.get('url')
    print(image_path)
    if os.path.exists(image_path):
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type='image/jpeg', status=200)
    else:
        return JsonResponse({'error': 'Image not found'}, status=404)


class SpecificImage(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'url': openapi.Schema(
                    type=openapi.TYPE_STRING),
            }
        )
    )
    def post(self, request):
        image_path = request.data.get('url')
        print(image_path)
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                image_data = f.read()
            return HttpResponse(image_data, content_type='image/jpeg', status=200)
        else:
            return JsonResponse({'error': 'Image not found'}, status=404)


@csrf_exempt
def get_hotels_of_a_city(request):
    # gets a city_id and return all hotels in that city
    if request.method == 'POST':
        city_id = request.POST.get('city_id')
        hotels = Hotel.objects.filter(city__id=city_id).values()
        return JsonResponse({'hotel': list(hotels)})

    return HttpResponse('Only post method allowed!', status=200)


class CityHotelsView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'city_id': openapi.Schema(
                    type=openapi.TYPE_STRING),
            }
        )
    )
    def post(self, request):
        city_id = request.data.get('city_id')
        hotels = Hotel.objects.filter(city__id=city_id).values()
        return JsonResponse({'hotel': list(hotels)})


@csrf_exempt
def search(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        search_phrase = data['search_phrase']
        # cities = City.objects.filter(name__contains=search_phrase).values_list('id', 'name')
        hotels = Hotel.objects.filter(name__contains=search_phrase).values_list('id', 'name')

        image_urls = []
        for hotel in hotels:
            try:
                image_urls.append(hotel.image.path)
            except Exception:
                # Maybe, one Hotel has not any Image at all
                continue
        return JsonResponse({'image_urls': image_urls})
        # return JsonResponse({'cities': list(cities), 'hotels': list(hotels)})
    return HttpResponse('Only post method allowed!', status=200)


@csrf_exempt
def check_hotels(request):
    # checks all hotels to see if an admin is assigned to them
    if request.method == 'GET':
        all_admins = HotelAdmin.objects.all()
        has_admin = [admin.hotel for admin in all_admins]
        print(has_admin)
        for hotel in has_admin:
            hotel.status = True
            hotel.save()
        result = Hotel.objects.all().values()
        return JsonResponse({'result': list(result)})

    return HttpResponse('Only get method allowed!', status=200)


class CheckHotelsView(APIView):
    def get(self, request):
        all_admins = HotelAdmin.objects.all()
        has_admin = [admin.hotel for admin in all_admins]
        print(has_admin)
        for hotel in has_admin:
            hotel.status = True
            hotel.save()
        result = Hotel.objects.all().values()
        return JsonResponse({'result': list(result)})
