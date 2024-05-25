import { useParams } from 'react-router-dom';
import './HotelPage.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';


const Hotel = () => {
  const { index } = useParams();
  const [hotelImage, setHotelImage] = useState('1');

  const [hotelName, setHotelName] = useState('نام');
  const [ownerDetails, setOwnerDetails] = useState('اطلاعات مالک');
  const [hotelAddress, setHotelAddress] = useState('آدرس');
  const [hotelPhoneNumber, setHotelPhoneNumber] = useState('تلفن');
  const [hotelRegulations, setHotelRegulations] = useState('مقررات');
  const [starCount, setStarCount] = useState('تعداد ستاره');
  const [roomImages, setRoomImages] = useState([]);

  const [room, setRoom] = useState([]);
  const handleButtonClick = async () => {
  }

  const fetchImage = async (url, hotel) => {
    try {
        const requestData = {
            url: url,
        };

        const response = await axios.post('http://localhost:8000/get_hotel_img/', requestData, {
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        if (hotel === true){
          setHotelImage(imageUrl);
        }
        else{
          return imageUrl
        }
      } catch (error) {
        console.error('Error fetching image:', error);
    }
  };

  const fetchRooms = async () => {
    fetch('http://localhost:8000/get_hotel_rooms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: index, 
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      setRoom(data.rooms);
      const imageUrls = data.images;
      console.log(imageUrls);
      if (roomImages.length === 0){
        for (const url of imageUrls) {
          fetchImage(url, false);
        }
      }
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
  };
  
  useEffect(() => {
    const fetchHotel = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('index', index);

            const url = `http://localhost:8000/home/get_hotel_data?${queryParams.toString()}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setHotelName(data.name);
                setHotelAddress('آدرس: ' + data.address)
                setStarCount(data.stars + ' تعداد ستاره')
                // setHotelName(data.facilities)
                // setHotelName(data.city_id)
                fetchImage(data.image, true);
                setHotelPhoneNumber(data.phone_number + ' :تلفن')
                // setHotelName(location_x)
                // setHotelName(location_y)
                // setHotelName(rating)
                // setHotelName(number_of_rates)
                // setHotelName(number_of_rooms)
                // setHotelName(facilities)
                // setHotelName(brochure)
                setHotelRegulations('قوانین: ' + data.policies)
                // set_hotel_name(data.data['name'])
                fetchRooms();
            } else {
                console.error('Failed to fetch images:', response.status);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    fetchHotel();
  }, [index]);

  const createNewRoom = () => {
    console.log('Creating new room')
  }

  const handleLogin = (e) => {
    e.preventDefault();
    createNewRoom();
  };

  const handleHotelNameChange = (e) => {
    setHotelName(e.target.value);
  };

  const handleOwnerDetailsChange = (e) => {
    setOwnerDetails(e.target.value);
  };

  const handleHotelAddressChange = (e) => {
    setHotelAddress(e.target.value);
  };

  const handleHotelPhoneNumberChange = (e) => {
    setHotelPhoneNumber(e.target.value);
  };

  const handleHotelRegulationsChange = (e) => {
    setHotelRegulations(e.target.value);
  };


  return (
    <div className='main-container'>
        <div className="container">
          <div className="left-section">

              <div className="">
                {[...Array(1)].map((_, index) => (
                  <i key={index} className="fas fa-star"></i>
                ))}
              </div>

              {hotelImage && (
                <div className="custom-image">
                  <img src={hotelImage} alt="Hotel" className="custom-image" />
                </div>
              )}

              <div className="hotel_page_input2">
                  <div className="right-aligned">{hotelName}</div>
              </div>

              <div className="hotel_page_input2">
                  <div className="right-aligned">{ownerDetails}</div>
              </div>

              <div className="hotel_page_input2">
                  <div className="right-aligned">{hotelAddress}</div>
              </div>

              <div className="hotel_page_input2">
                  <div className="right-aligned">{hotelPhoneNumber}</div>
              </div>

              <div className="hotel_page_input2">
                  <div className="right-aligned">{hotelRegulations}</div>
              </div>

              <div className="hotel_page_input2">
                  <div className="right-aligned">{starCount}</div>
              </div>
          </div>

          <div className="right-section">

            {Object.entries(room).map(([key, value], index) => (
              <div className="hotel_page_input3 room-container" key={key}>
                {typeof value === 'object' ? (
                  <div className="room-info">
                    <div className="room-index"></div>
                    <div className="star-rating">
                      {[...Array(1)].map((_, index) => (
                        <i key={index} className="fas fa-star"></i>
                      ))}
                    </div>
                    {hotelImage && (
                      <div className="custom-image-room">
                        <img src={hotelImage} alt="Hotel" className="custom-image-room" />
                      </div>
                    )}
                    <div className="room-details">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div className="room-detail" key={subKey}>
                          {subValue.toString()}
                          <br /> {/* Add line break after each value */}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  value.toString()
                )}
              </div>
            ))}

            <div className='button-container'>
            <button className="order-button" onClick={() => handleButtonClick()}>رزرو</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Hotel;
