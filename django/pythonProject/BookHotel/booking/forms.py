from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser,Customer, SiteAdmin, HotelAdmin


class CustomerSignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['username', 'password']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
            Customer.objects.create(user=user)
        return user


# class CustomerSignUpForm(UserCreationForm):
#     class Meta:
#         model = CustomUser
#         fields = ('username', 'password1', 'password2')

#     def save(self, commit=True):
#         user = super().save(commit=commit)
#         Customer.objects.create(user=user)
#         return user


class SiteAdminSignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['username', 'password']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
            Customer.objects.create(user=user)
        return user


# class SiteAdminSignUpForm(UserCreationForm):
#     class Meta:
#         model = CustomUser
#         fields = ('username', 'password1', 'password2')

#     def save(self, commit=True):
#         user = super().save(commit=commit)
#         SiteAdmin.objects.create(user=user)
#         return user


class HotelAdminSignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['username', 'password']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
            Customer.objects.create(user=user)
        return user



# class HotelAdminSignUpForm(UserCreationForm):
#     class Meta:
#         model = CustomUser
#         fields = ('username', 'password1', 'password2')

#     def save(self, commit=True):
#         user = super().save(commit=commit)
#         HotelAdmin.objects.create(user=user)
#         return user
