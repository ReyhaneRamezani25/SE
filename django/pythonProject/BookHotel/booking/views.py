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
from django.shortcuts import get_object_or_404

from .models import Hotel, HotelAdmin, Room, Reservation, SiteAdmin, Customer, CustomUser, Guest
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


"""
{
  "registrar": "jadid@gmail.com",
  "start": "2024-05-01",
  "end": "2024-05-22",
  "guests": [
    {
      "name": "string",
      "lastName": "string",
      "id": 1
    },
{
      "name": "string",
      "lastName": "string",
      "id": 3
    }
  ],
  "rooms": [
    5,7,9
  ]
}
"""


class AddReservation(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'registrar': openapi.Schema(type=openapi.TYPE_STRING),
            'start': openapi.Schema(type=openapi.TYPE_STRING),
            'end': openapi.Schema(type=openapi.TYPE_STRING),
            'guests': openapi.Schema(type=openapi.TYPE_ARRAY,
                                     items=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                                         'name': openapi.Schema(type=openapi.TYPE_STRING),
                                         'lastName': openapi.Schema(type=openapi.TYPE_STRING),
                                         'id': openapi.Schema(type=openapi.TYPE_INTEGER)})),
            'rooms': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_INTEGER)),

        }
    ))
    def post(self, request):
        registrar_email = request.data.get('registrar')
        start = request.data.get('start')
        end = request.data.get('end')
        guests_data = request.data.get('guests')
        rooms_data = request.data.get('rooms')

        registrar = CustomUser.objects.get(username=registrar_email)

        guests = []
        for guest_data in guests_data:
            guest_id = guest_data.get('id')
            guest = Guest.objects.get(id=guest_id)
            guests.append(guest)

        rooms = []
        for room_id in rooms_data:
            room = Room.objects.get(id=room_id)
            rooms.append(room)

        reservation = Reservation.objects.create(registrar=registrar, start=start, end=end)
        reservation.guests.set(guests)
        reservation.rooms.set(rooms)
        reservation.save()

        return Response({'message': 'Reservation created successfully'})


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

        user = authenticate(request, username=data['username'], password=data['password'])
        if not user:
            return HttpResponse('Only Admin can call this API', status=403)

        admin = get_object_or_404(HotelAdmin, user__username=data['username'])
        hotel = get_object_or_404(Hotel, id=admin.hotel.id)

        data = json.loads(request.body.decode('utf-8'))
        all_reserves = Reservation.objects.all()
        rooms = []
        for reserve in all_reserves:
            rooms.extend(reserve.rooms.all())
        filtered_rooms = [room for room in rooms if room.hotel_id == hotel.id]

        hotel_room_names = [room.type for room in filtered_rooms]
        image_urls = [room.room_image.path for room in filtered_rooms]
        registrars = []

        print(filtered_rooms)
        hotels_data = []
        for i in range(len(filtered_rooms)):
            hotels_data.append({
                'نام اتاق': hotel_room_names[i],
                'hotel_room_images': image_urls[i],
                # 'guests_name': guest_name[i],
                # 'guests_id': guest_id[i],
                # 'رزرو کننده': result.registrar.username,
                # 'تاریخ شروع': result.start,
                # 'تاریخ پایان': result.end,
            })

        return JsonResponse(hotels_data, safe=False)


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

        def room_data(room):
            room_dict = room.__dict__.copy()
            del room_dict['_state']

            return {
                'type': room_dict['type'],
                'number': persian.enToPersianNumb(str(room_dict['number'])),
                'capacity': persian.enToPersianNumb(str(room_dict['capacity'])),
                'breakfast': room_dict['breakfast'],
                'price': persian.enToPersianNumb(str(room_dict['price'])),
                'id': room.id,
            }

        rooms = Room.objects.filter(hotel__id=admin.hotel.id)
        rooms_list = [room_data(room) for room in rooms]

        room_images = []
        for room in rooms:
            try:
                room_images.append(room.room_image.path)
            except Exception:
                continue

        response_data = {'rooms': rooms_list, 'images': room_images}

        return JsonResponse(
            {
                "hotel": hotel,
                "rooms": response_data
            }
        )

    return HttpResponse('Only post method allowed!', status=200)


from django.core.files import File


@csrf_exempt
def admin_update_hotel(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))

        user = authenticate(request, username=data['username'], password=data['password'])
        if not user:
            return HttpResponse('Only Admin can call this API', status=403)

        admin = get_object_or_404(HotelAdmin, user__username=data['username'])
        hotel = get_object_or_404(Hotel, id=admin.hotel.id)

        hotel.name = data['name']
        hotel.address = data['address']
        hotel.stars = data['stars']
        hotel.facilities = data['facilities']
        hotel.phone_number = data['phone_number']
        hotel.policies = data['policies']

        if data['hotel_image_name'] != '':
            image_name = data['hotel_image_name']
            file_path = settings.MEDIA_ROOT + '/' + image_name
            with open(file_path, 'rb') as f:
                file = File(f)
                hotel.image.save(os.path.basename(file_path), file, save=True)

        if data['hotel_room_images_name'] != []:
            images = data['hotel_room_images_name']
            rooms = Room.objects.filter(hotel__id=hotel.id)
            for image, room in zip(images, rooms):
                print(image, room)
                if not image:
                    continue
                file_path = settings.MEDIA_ROOT + '/' + image
                with open(file_path, 'rb') as f:
                    file = File(f)
                    room.room_image.save(os.path.basename(file_path), file, save=True)

        room_fields = {key: value for key, value in data.items() if key.startswith('room_')}

        for field in room_fields:
            values = data[field]
            print(values)
            if "status" in values.keys():
                new_room = Room(
                    type=values['type'],
                    number=values['number'],
                    capacity=values['capacity'],
                    breakfast=True if values['breakfast'] == 'true' else False,
                    hotel=hotel,
                    price=values['price'],
                    level=0,
                    extera_guest=False,
                )
                new_room.save()
                # room_image = values['room_image'],
            else:
                room = Room.objects.filter(id=values['id'])[0]
                room.type = values['type']
                room.number = values['number']
                room.capacity = values['capacity']
                room.breakfast = True if values['breakfast'] == 'true' else False
                room.price = values['price']
                room.save()

        hotel.save()
        return HttpResponse('Data saved!', status=200)

    return HttpResponse('Only POST method allowed!', status=405)
    # Update hotel fields
    # hotel.location_x = data['location_x']
    # hotel.location_y = data['location_y']
    # hotel.rating = data['rating']
    # hotel.number_of_rates = data['number_of_rates']
    # hotel.number_of_rooms = data['number_of_rooms']
    # hotel.brochure = data['brochure']
    # hotel.city_id = data['city']
    # hotel.status = data['status']


from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from django.conf import settings


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)

    files = request.FILES.getlist('file')
    file_urls = []

    for file in files:
        file_path = os.path.join(settings.MEDIA_ROOT, file.name)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        file_urls.append(settings.MEDIA_URL + file.name)

    return JsonResponse({'file_urls': file_urls}, status=200)


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
