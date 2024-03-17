from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser,Customer, SiteAdmin, HotelAdmin


class CustomerSignUpForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')

    def save(self, commit=True):
        user = super().save(commit=commit)
        Customer.objects.create(user=user)
        return user


class SiteAdminSignUpForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=commit)
        SiteAdmin.objects.create(user=user)
        return user


class HotelAdminSignUpForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')

    def save(self, commit=True):
        user = super().save(commit=commit)
        HotelAdmin.objects.create(user=user)
        return user