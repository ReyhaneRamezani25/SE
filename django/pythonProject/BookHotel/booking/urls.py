from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                path('customer/signup/', signup_customer),
                path('customer/login/', login_customer),
                path('customer/update/', change_password),

                # path('site_admin/signup/', signup_site_admin),
                path('site_admin/login/', login_site_admin),
                path('site_admin/create_hotel/', HotelAPIView.as_view()),
                path('site_admin/create_hotel_admin/', HotelAdminAPIView.as_view()),

                # path('hotel_admin/signup/', signup_hotel_admin),
                path('hotel_admin/login/', login_hotel_admin),

                path('get_hotels/', get_hotels),
                path('get_hotel_img/', get_specific_image),

                path('home/search/', search),
                path('home/get_hotel_data', hotel_data),
                path('home/get_city_hotels', get_hotels_of_a_city),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
