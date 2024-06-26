import { useParams } from 'react-router-dom';
import './HotelRefactor.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';


const HotelRefactor = () => {

  const { user } = useContext(UserContext);
  console.log("username: ", user.username)
  console.log("userType: ", user.userType)
  console.log("password: ", user.password)
  
  
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
  const [roomInputs, setRoomInputs] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [guests, setGuests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = guests.every(guest => 
      guest.id.length === 10 &&
      guest.name.trim() !== '' &&
      guest.lastName.trim() !== ''
    );

  };

  const handleInputChange = (e, roomIndex) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
      setRoomInputs(prevState => ({
        ...prevState,
        [roomIndex]: value,
      }));
    }
  };

  const handleButtonClick = async () => {
    let flag = false;
    Object.keys(roomInputs).forEach((key, index) => {
      const input = roomInputs[key];
      if(input >= 1) {
        flag = true;
      }
      let capacity = room[index]['capacity'];
    //   capacity = convertPersianToEnglishNumbers(capacity);
    //   capacity = parseInt(capacity.match(/\d+/)[0]);
    //   totalGuest += input * capacity;
    });

    if (flag){
      setShowPopup(true);  
    }
    else{
      alert('باید حداقل یک اتاق را انتخاب کنید')
    }
  }

  const handleCellClick = (content) => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
          return imageUrl;
        }
      } catch (error) {
        console.error('Error fetching image:', error);
    }
  };

  const fetchRooms = async () => {
    fetch('http://localhost:8000/hotel_admin/get_hotel/', {
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
    .then(async data => {
      setRoom(data.rooms);
      const imageUrls = data.images;
      console.log(imageUrls);
      if (roomImages.length === 0){
        for (const url of imageUrls) {
          const fetchedImages = await Promise.all(imageUrls.map(url => fetchImage(url, false)));
          setRoomImages(fetchedImages);
        }
      }
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
    });
  };

  useEffect(() => {
    fetch('http://localhost:8000/hotel_admin/get_hotel/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: user.username,
            password: user.password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json(); 
    })
    
    .then(data => {  
        setHotelName('نام: ' + data.name);
        setHotelAddress(data.address + ' :آدرس');
        setStarCount(data.stars + ' تعداد ستاره:');
        fetchImage(data.image, true);
        setHotelPhoneNumber(data.phone_number + ' :تلفن');
        setHotelRegulations(data.policies + ' :مقررات');
    })
    .catch(error => {
        // Handle error
        console.error('Fetch error:', error.message);
    });
}, []); // Ensure useEffect runs on component mount

  const createNewRoom = () => {
    console.log('Creating new room');
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
              <img alt="hotel" src={hotelImage} className="custom-image"/>
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
                    {[...Array(5)].map((_, index) => (
                      <i key={index} className="fas fa-star"></i>
                    ))}
                  </div>

                  <input
                    className='reyhane'
                    type='number'
                    min='0'
                    value={roomInputs[index] || ''}
                    onChange={(e) => handleInputChange(e, index)}
                  />

                  {roomImages && (
                    <div className="custom-image-room">
                      <img src={roomImages[index]} alt="Room" className="custom-image-room" />
                    </div>
                  )}
                  <div className="room-details">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div className="room-detail" key={subKey}>
                        {subValue.toString()}
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
            <button className="order-button" onClick={handleButtonClick}>رزرو</button>
          </div>
        </div>
      </div>

      {showPopup}
    </div>
  );
};

export default HotelRefactor;
