from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                  path('customer/signup/', signup_customer, name='signup_customer'),
                  path('customer/login/', login_customer, name='login_customer'),
                  path('customer/update/', change_password_customer, name='update_customer'),

                  path('site_admin/update/', login_site_admin),
                  path('site_admin/login/', login_site_admin),
                  path('site_admin/create_hotel/', HotelAPIView.as_view()),
                  path('site_admin/create_hotel_admin/', HotelAdminAPIView.as_view()),
                  path('site_admin/hotel_list/', hotel_list),

                  path('hotel_admin/update/', change_password_hotel_admin),
                  path('hotel_admin/signup/', signup_hotel_admin),
                  path('hotel_admin/login/', login_hotel_admin),
                  path('hotel_admin/analysis/', hotel_admin_analysis),

                  path('get_hotels/', get_hotels),
                  path('get_hotel_img/', get_specific_image),

<<<<<<< HEAD
                  path('home/search/', search),
                  path('home/get_hotel_data', hotel_data),
                  path('home/get_city_hotels', get_hotels_of_a_city),
                  path('home/check_hotels/',check_hotels)
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
=======
                path('home/search/', search),
                path('home/get_hotel_data', hotel_data),
                path('home/get_city_hotels', get_hotels_of_a_city),
                path('get_hotel_rooms/', get_hotel_rooms),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
>>>>>>> 31ecd5b009e9f187d120e862eae05e3bf41f0b9b
