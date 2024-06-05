udo systemctl start elasticsearch.service
sudo docker stop react_container
sudo docker rm react_container
sudo docker build -t react_image .
sudo docker run \
    --name react_container -p 3000:80 react_image


