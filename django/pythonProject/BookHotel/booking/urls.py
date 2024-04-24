from django.urls import path
from .views import signup_customer, signup_site_admin, signup_hotel_admin, login, hotel_search, hotel_data, get_hotels

urlpatterns = [
    path('customer/signup/', signup_customer),
    path('customer/login/', login),

    path('site_admin/signup/', signup_site_admin),
    path('site_admin/login/', login),

    path('hotel_admin/signup/', signup_hotel_admin),
    path('hotel_admin/login/', login),

    path('hotel/search/', hotel_search),
    path('hotel/get_data', hotel_data),

    path('get_hotels', get_hotels),

]