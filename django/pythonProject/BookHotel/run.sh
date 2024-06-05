udo systemctl start elasticsearch.service
sudo docker stop django_container
sudo docker rm django_container
sudo docker build -t django_image .
sudo docker run \
        --name django_container --net=host django_image

