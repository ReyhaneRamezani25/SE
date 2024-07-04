import { useParams } from 'react-router-dom';
import './HotelRefactor.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';

const HotelRefactor = () => {
  const { user } = useContext(UserContext);
  const { index } = useParams();

  const [hotelImage, setHotelImage] = useState('');
  const [hotelImageName, setHotelImageName] = useState('');
  const [hotelName, setHotelName] = useState('نام');
  const [ownerDetails, setOwnerDetails] = useState('شهر ');
  const [hotelAddress, setHotelAddress] = useState('آدرس');
  const [hotelPhoneNumber, setHotelPhoneNumber] = useState('تلفن');
  const [hotelRegulations, setHotelRegulations] = useState('مقررات');
  const [starCount, setStarCount] = useState('تعداد ستاره');
  const [roomImages, setRoomImages] = useState([]);
  const [roomImagesName, setRoomImagesName] = useState([]);
  const help = ['نام ', 'موجود ', 'ظرفیت ', 'صبحانه ', 'قیمت ', 'id']
  const roomFields = ['type', 'number', 'capacity', 'breakfast', 'price']
  
  const [room, setRoom] = useState([]);
  const [newRoom, setNewRoom] = useState({});
  const [warning, setWarning] = useState('');
  const [popup, setPopup] = useState(false);
  const [newRoomImage, setNewRoomImage] = useState();

  let newRoomFields = ['نام', 'تعداد اتاق', 'ظرفیت', 'امکانات', 'قیمت'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'hotelName':
        setHotelName(value);
        break;
      case 'ownerDetails':
        setOwnerDetails(value);
        break;
      case 'hotelAddress':
        setHotelAddress(value);
        break;
      case 'hotelPhoneNumber':
        setHotelPhoneNumber(value);
        break;
      case 'hotelRegulations':
        setHotelRegulations(value);
        break;
      case 'starCount':
        setStarCount(value);
        break;
      default:
        break;
    }
  };

  const handleRoomInputChange = (roomIndex, subKey, value) => {
    console.log('roomIndex', roomIndex, subKey, value)
    const updatedRooms = [...room];
    updatedRooms[roomIndex][subKey] = value;
    setRoom(updatedRooms);
  };

  // const handleNewRoomInputChange = (subKey, value) => {
  //   console.log(roomFields[subKey], subKey, value);
  const handleNewRoomInputChange = (roomIndex, subKey, value) => {
    console.log(roomFields[subKey], subKey, value)
    newRoom[roomFields[subKey]] = value;
    newRoom["status"] = "new";
  };

  const handleImageUpload = async (e, setImageState, imageIndex = null) => {
    try {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      const fileSizeInBytes = file.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);  
      console.log(`Image size: ${fileSizeInMB.toFixed(2)} MB`);
      const maxSizeInMB = 5;
      if (fileSizeInMB > maxSizeInMB) {
        console.log('The selected image is too large. Please select an image smaller than');
        alert(`The selected image is too large. Please select an image smaller than ${maxSizeInMB} MB.`);
        return;
      }

      if (imageIndex !== null) {
        const updatedRoomImages = [...roomImages];
        updatedRoomImages[imageIndex] = imageUrl;
        setRoomImages(updatedRoomImages);
        
        const updatedRoomImagesName = [...roomImagesName];
        updatedRoomImagesName[imageIndex] = file.name;
        setRoomImagesName(updatedRoomImagesName);
      } else {
        setImageState(imageUrl);
        setHotelImageName(file.name);
      }

      const data = new FormData();
      data.append('file', file)
      axios.post("http://localhost:8000/upload/", data)
      .then(res => { 
        console.log(res.statusText)
      })

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      await axios.post("http://localhost:8000/upload/", uploadFormData);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageClick = (inputId) => {
    document.getElementById(inputId).click();
  };

  const fetchImage = async (url, hotel) => {
    try {
      const requestData = { url: url };
      const response = await axios.post('http://localhost:8000/get_hotel_img/', requestData, { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      if (hotel) {
        setHotelImage(imageUrl);
      } else {
        return imageUrl;
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const fetchHotelData = async () => {
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
      .then(async data => {
        setHotelName(data.hotel.name);
        setHotelAddress(data.hotel.address);
        setStarCount(data.hotel.stars);
        fetchImage(data.hotel.image, true);
        setHotelPhoneNumber(data.hotel.phone_number);
        setHotelRegulations(data.hotel.policies);
        setOwnerDetails(data.hotel.city);

        setRoom(data.rooms.rooms);
        const imageUrls = data.rooms.images;
        if (roomImages.length === 0) {
          const fetchedImages = await Promise.all(imageUrls.map(url => fetchImage(url, false)));
          setRoomImages(fetchedImages);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error.message);
      });
  };

  useEffect(() => {
    fetchHotelData();
  }, []);

  const SaveAdminChanges = async () => {
    console.log(room);
    let request = {
      name: hotelName,
      location_x: hotelAddress,
      location_y: hotelAddress,
      address: hotelAddress,
      stars: starCount,
      rating: 5,
      number_of_rates: 4,
      number_of_rooms: 2,
      facilities: '',
      brochure: '',
      city: ownerDetails,
      phone_number: hotelPhoneNumber,
      policies: hotelRegulations,
      status: true,
      hotel_image_name: hotelImageName,
      hotel_room_images_name: roomImagesName,
      username: user.username,
      password: user.password,
    }

    room.forEach((room_data, index) => {
      request[`room_${index + 1}`] = room_data;
    });
  
    fetch('http://localhost:8000/hotel_admin/update_hotel/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then(response => {
        if (!response.ok) {
          alert(response.statusText);
          throw new Error(response.statusText);
        } else {
          alert('اطلاعات هتل آپدیت شد');
        }
      })
  };

  const addRoom = () => {
    console.log(Object.keys(newRoom).length);
    console.log(newRoom);

    if (Object.keys(newRoom).length === 5 || Object.keys(newRoom).length === 6) {
      for (const roomField of Object.keys(newRoom)) {
        if (roomField === "") {
          setWarning("همه‌ی فیلد ها باید پر شده باشند");
          return;
        }
      }
      setRoom(prevRoom => [...prevRoom, newRoom]);
      setRoomImages(prevImage => [...prevImage, newRoomImage]);
      setNewRoomImage('');
      setNewRoom([]);
      setPopup(false);
      setWarning('');
    } else {
      setWarning("همه‌ی فیلد ها باید پر شده باشند");
    }
  }

  const showPopup = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <div className='main-container'>
      <div className="container">
        <div className="left-section">

          <div className="custom-image" onClick={() => handleImageClick('hotelFileInput')}>
            <img alt="hotel" src={hotelImage} className="custom-image" />
            <input
              id="hotelFileInput"
              type="file"
              onChange={(e) => handleImageUpload(e, setHotelImage)}
              style={{ display: 'none' }}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder={` نام`}
              name="hotelName"
              placeholder={` نام${hotelName}`}
              onChange={handleInputChange}
            />
          </div>
          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder={` شهر ${ownerDetails}`}
              name="ownerDetails"
              placeholder={` شهر ${ownerDetails}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder=' آدرس'
              name="hotelAddress"
              placeholder={` آدرس ${hotelAddress}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder=' تلفن'
              name="hotelPhoneNumber"
              placeholder={` تلفن ${hotelPhoneNumber}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder=' مقررات'
              name="hotelRegulations"
              placeholder={` مقررات ${hotelRegulations}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              // placeholder=' ستاره'
              name="starCount"
              placeholder={` ستاره ${starCount}`}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="right-section">
          {room.map((roomDetail, index) => (
            <div className="hotel_page_input3 room-container" key={index}>
              <div className="room-info">
                <div className="star-rating">
                  {[...Array(5)].map((_, starIndex) => (
                    <i key={starIndex} className="fas fa-star"></i>
                  ))}
                </div>

                <div className="custom-image-room" onClick={() => handleImageClick(`fileInput-${index}`)}>
                  <img
                    src={roomImages[index]}
                    alt="Room"
                    className="custom-image-room"
                  />
                  <input
                    id={`fileInput-${index}`}
                    type="file"
                    onChange={(e) => handleImageUpload(e, setRoomImages, index)}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="room-details">
                  {Object.entries(roomDetail).map(([subKey, subValue], helpIndex) => (
                    help[helpIndex] !== 'id' ? (
                      <input
                        className="room-detail-input"
                        placeholder={help[helpIndex] + subValue.toString()}
                        key={subKey}
                        onChange={(e) => handleRoomInputChange(index, subKey, e.target.value)}
                      />
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className='button-container'>
            <button className="order-button" onClick={SaveAdminChanges}>ذخیره</button>
          </div>
          <div className='button-container'>
            <button className="order-button" onClick={showPopup}>افزودن اتاق</button>
          </div>
        </div>
      </div>

      {popup &&
        <div className="reserve-popup">
          <div className="reserve-popup-content">
            <div className="custom-image-room" onClick={() => handleImageClick('newRoomFileInput')}>
              <img alt="rooms" src={newRoomImage} className="custom-image-room" />
              <input
                id="newRoomFileInput"
                type="file"
                onChange={(e) => handleImageUpload(e, setNewRoomImage)}
                style={{ display: 'none' }}
              />
            </div>
            <div className="room-details">
              {Object.entries(newRoomFields).map(([subKey, subValue]) => (
                <div key={subKey} className="room-detail-container">
                  <input
                    className="room-detail"
                    placeholder={subValue.toString()}
                    onChange={(e) => handleNewRoomInputChange(index, subKey, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <h6 style={{ textAlign: 'center' }}>{warning}</h6>
            <div className='button-container'>
              <button type="submit" className="close-button" onClick={addRoom}>تایید</button>
            </div>
            <div className='button-container'>
              <button type="button" className="close-button" onClick={closePopup}>بازگشت</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default HotelRefactor;
