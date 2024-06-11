import { useParams } from 'react-router-dom';
import './HotelPage.css';
import React, { useState, useEffect, useContext } from 'react';
import axios, { all } from 'axios';
import { useNavigate } from "react-router-dom";


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
  const [roomCount, setRoomCount] = useState([]);
  const [roomInputs, setRoomInputs] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  let totalGuest = 0;
  
  const persianToEnglishDigitMap = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9'
  };
  
  const convertPersianToEnglishNumbers = (input) => {
    return input.replace(/[۰-۹]/g, (match) => persianToEnglishDigitMap[match]);
  };  

  const [room, setRoom] = useState([]);

  // Reyhane code

  const [guests, setGuests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  let navigate = useNavigate(); 

  const nationalIdCheck = (index, field, value) => {
    const newGuests = [...guests];
    if (field === 'id') {
      if (/^\d{0,10}$/.test(value)) {
        newGuests[index][field] = value;
      }
    } else {
      newGuests[index][field] = value;
    }
    setGuests(newGuests);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = guests.every(guest => 
      guest.id.length === 10 &&
      guest.name.trim() !== '' &&
      guest.lastName.trim() !== ''
    );

    if (isValid) {
      console.log('Guests:', guests);
      // Submit the guests data to your backend or perform other actions
      routeChange(); // Corrected the onClick event
    } else {
      alert('لطفا مشخصات تمامی میهمانان را وارد کنید');
    }
  };

  const routeChange = () => { 
    let path = '../pardakht'; 
    navigate(path);
  }

// Reyhane code
  const handleInputChange = (e, roomIndex) => {
    const value = e.target.value;
    setRoomInputs(prevState => ({
      ...prevState,
      [roomIndex]: value,
    }));  
  };

  const handleButtonClick = async () => {
    let flag = false;
    Object.keys(roomInputs).forEach((key, index) => {
      const input = roomInputs[key];
      if(input >= 1) {
        flag = true;
      }
      let capacity = room[index]['capacity'];
      capacity = convertPersianToEnglishNumbers(capacity);
      capacity = parseInt(capacity.match(/\d+/)[0]);
      totalGuest += input * capacity;
    });

    const newGuests = Array.from({ length: totalGuest }, () => ({
      name: '',
      lastName: '',
      id: ''
    }));
    if (flag){
      setGuests(newGuests);
      console.log(totalGuest);
      setShowPopup(true);  
    }
    else{
      alert('باید حداقل یک اتاق را انتخاب کنید')
    }
  }

  const handleCellClick = (content) => {
    // setSelectedCellContent(content);
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
    .then(async data => {
      setRoom(data.rooms);
      const imageUrls = data.images;
      console.log(imageUrls);
      if (roomImages.length === 0){
        for (const url of imageUrls) {
          const fetchedImages = await Promise.all(imageUrls.map(url => fetchImage(url, false)));
          setRoomImages(fetchedImages);
          // console.log(r)
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
                setHotelAddress('آدرس: ' + data.address);
                setStarCount(data.stars + ' تعداد ستاره');
                fetchImage(data.image, true);
                setHotelPhoneNumber(data.phone_number + ' :تلفن');
                setHotelRegulations('قوانین: ' + data.policies);
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
                      value={roomInputs[index] || ''}
                      onChange={(e) => handleInputChange(e, index)}
                    />

                    {roomImages && (
                      <div className="custom-image-room">
                        <img src={roomImages[index]} alt="Room" className="custom-image-room" />
                      </div>
                    )}
                    <div className="room-details">
                      {Object.entries(value).map(([subKey, subValue], inner_index) => (
                        
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
            <button className="order-button" onClick={() => handleButtonClick()}>رزرو</button>
            </div>
          </div>
        </div>
        {showPopup && (
          <div className="reserve-popup">
            <div className="reserve-popup-content">
              <form onSubmit={handleSubmit}>
                <div className='reserve-popup-content-scrollable'>
                  <div className='reyhane-container'>
                    <h1 className='reyhane-header'>رزرو آنلاین</h1>
                    <div className='reyhane-room-container'>اتاق های انتخابی</div>
                    <div className='reyhane-information-header'>لطفا مشخصات تمامی میهمانان را وارد کنید</div>
                    <div className='reyhane-information-tail'>
                      {guests.map((guest, index) => (
                        <div className='reyhane-guest-row' key={index}>
                          <label>
                            <input
                              type="text"
                              value={guest.id}
                              onChange={(e) => nationalIdCheck(index, 'id', e.target.value)}
                            />{/* Explicit space */}
                            {' '}
                            کد ملی
                          </label>
                          <label>
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => nationalIdCheck(index, 'name', e.target.value)}
                            />{/* Explicit space */}
                            {' '}
                            نام خانوادگی
                          </label>
                          <label>
                            <input
                              type="text"
                              value={guest.lastName}
                              onChange={(e) => nationalIdCheck(index, 'lastName', e.target.value)}
                            />{/* Explicit space */}
                            {' '}
                            نام
                          </label>
                          <h3>مهمان {index + 1}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='button-container'>
                    <button className="close-button">تایید</button>
                  </div>
                  <div className='button-container'>
                    <button className="close-button" onClick={closePopup}>بازگشت</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default Hotel;
