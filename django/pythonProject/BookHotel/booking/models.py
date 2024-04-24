from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    username = models.EmailField(unique=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username


class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class SiteAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class City(models.Model):
    name = models.CharField(max_length=150)
    province = models.CharField(max_length=150)


class Hotel(models.Model):
    name = models.CharField(max_length=150)
    location_x = models.FloatField()
    location_y = models.FloatField()
    address = models.CharField(max_length=500)
    stars = models.IntegerField()
    rating = models.FloatField()
    number_of_rooms = models.IntegerField()
    facilities = models.CharField(max_length=500)
    brochure = models.FileField()
    image = models.FileField()
    city = models.ForeignKey(City, on_delete=models.CASCADE)


class Room(models.Model):
    type = models.CharField(max_length=150)
    number = models.IntegerField()
    level = models.IntegerField()
    capacity = models.IntegerField()
    breakfast = models.BooleanField()
    extera_guest = models.BooleanField()
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)


class Guest(models.Model):
    name = models.CharField(max_length=150)
    identity_code = models.CharField(max_length=10)


class Reservation(models.Model):
    registrar = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    start = models.DateTimeField()
    end = models.DateTimeField()
    guests = models.ManyToManyField(Guest)
    rooms = models.ManyToManyField(Room)


class HotelAdmin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    hotel = models.OneToOneField(Hotel, on_delete=models.CASCADE)
