from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
            path('customer/signup/', signup_customer, name='signup_customer'),
            path('customer/login/', login_customer, name='login_customer'),
            path('customer/update/', change_password_customer, name='update_customer'),
            
            path('site_admin/update/', change_password_site_admin),
            path('site_admin/login/', login_site_admin),
            path('site_admin/create_hotel/', HotelAPIView.as_view(), name='site_admin_create_hotel'),
            path('site_admin/create_hotel_admin/', HotelAdminAPIView.as_view()),
            path('site_admin/hotel_list/', hotel_list),
            path('site_admin/create_city/', CityAPIView.as_view()),
            path('site_admin/analysis/', site_admin_analysis),

            path('hotel_admin/update/', change_password_hotel_admin),
            path('hotel_admin/signup/', signup_hotel_admin),
            path('hotel_admin/login/', login_hotel_admin),
            path('hotel_admin/analysis/', hotel_admin_analysis),
            path('hotel_admin/create_room', RoomAPIView.as_view()),
            path('hotel_admin/get_hotel/', get_hotel_admin),
            path('hotel_admin/update_hotel/', admin_update_hotel),

            path('upload/', upload_file, name='upload_file'),

            path('get_hotels/', get_hotels),
            path('get_hotel_img/', SpecificImage.as_view()),

            path('home/search/', search),
            path('home/get_hotel_data', HotelDataView.as_view(), name='get_hotel_data'),
            path('home/get_city_hotels', CityHotelsView.as_view()),
            path('home/check_hotels/', CheckHotelsView.as_view()),
            path('get_hotel_rooms/', get_hotel_rooms),
            path('reserve/', get_reserved_rooms),

            path('reserve/add_guest/', GuestAPIView.as_view()),
            path('reserve/create_reserve/', ReservationAPIView.as_view()),
            path('reserve/add_reserve/', AddReservation.as_view()),

            path('test/', Test.as_view()),
            # for testing error handlers
            path('trigger-500/', trigger_500_error, name='trigger-500'),
            path('trigger-400/', trigger_400_error, name='trigger-400'),

        ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
