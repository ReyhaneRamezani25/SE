from django.test import TestCase

# Create your tests here.
# tests.py
from django.test import Client
from django.urls import reverse
from booking.models import City
import json

class FormViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_customer_signup(self):
        response = self.client.post(
            reverse('signup_customer'),
            json.dumps({'username': 'ss@gmail.com', 'name': 'jack', 'password': 'sss'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'User created successfully!')


    def test_customer_login(self):
        response = self.client.post(
            reverse('signup_customer'),
            json.dumps({'username': 'ss@gmail.com', 'name': 'jack', 'password': 'sss'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'User created successfully!')

        response = self.client.post(
            reverse('login_customer'),
            json.dumps({'username': 'ss@gmail.com', 'password': 'sss'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Login Accepted!')
        
        response = self.client.post(
            reverse('login_customer'),
            json.dumps({'username': 'ss@gmail.com', 'password': 'lshdbljshdbljshdjlhd'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Wrong password or username')


    def test_hotel_create(self):
        city, created = City.objects.get_or_create(id=1, defaults={'name': 'new city', 'province': 'city province'})

        name = "testHotel"
        location_x = 0
        location_y = 0
        address = "null"
        stars = 0
        rating = 0
        number_of_rates = 10
        number_of_rooms = 15
        facilities = "sample"
        response = self.client.post(
            reverse('site_admin_create_hotel'),
            json.dumps({
                'name':name,
                'location_x':location_x,
                'location_y':location_y,
                'address':address,
                'stars':stars,
                'rating':rating,
                'number_of_rates':number_of_rates,
                'number_of_rooms':number_of_rooms,
                'facilities':facilities,
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Hotel added successfully!')

        response = self.client.post(
            reverse('get_hotel_data'),
            json.dumps({
                'hotel_id': "1",
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        hotel = response.json()['hotel'][0]
        
        self.assertEqual(hotel['name'], name)
        self.assertEqual(hotel['location_x'], location_x)
        self.assertEqual(hotel['location_y'], location_y)
        self.assertEqual(hotel['address'], address)
        self.assertEqual(hotel['stars'], stars)
        self.assertEqual(hotel['rating'], rating)
        self.assertEqual(hotel['number_of_rates'], number_of_rates)
        self.assertEqual(hotel['number_of_rooms'], number_of_rooms)
        self.assertEqual(hotel['facilities'], facilities)
