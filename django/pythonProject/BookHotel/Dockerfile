FROM python:3.8

WORKDIR /app

RUN pip install django djangorestframework django-cors-headers django-rest-swagger persian
RUN pip install drf-yasg -U

COPY . /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
