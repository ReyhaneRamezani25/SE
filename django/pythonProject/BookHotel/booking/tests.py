from django.test import TestCase

# Create your tests here.
# tests.py
from django.test import Client
from django.urls import reverse
import json

class FormViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def customer_user_test_signup_login_update(self):
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
        
    def hotel_admin_test_signup_login_update(self):
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
        
        