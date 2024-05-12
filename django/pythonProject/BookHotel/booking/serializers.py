# Implement ClassroomSerializer Here
from rest_framework import serializers
from .models import Hotel, HotelAdmin


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'



class HotelAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelAdmin
        fields = '__all__'
