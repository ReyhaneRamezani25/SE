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
  const [ownerDetails, setOwnerDetails] = useState('اطلاعات مالک');
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
        setHotelName(value.substring(4));
        break;
      case 'ownerDetails':
        setOwnerDetails(value.substring(13));
        break;
      case 'hotelAddress':
        setHotelAddress(value.substring(5));
        break;
      case 'hotelPhoneNumber':
        setHotelPhoneNumber(value.substring(5));
        break;
      case 'hotelRegulations':
        setHotelRegulations(value.substring(7));
        break;
      case 'starCount':
        setStarCount(value.substring(6));
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
      facilities: 'یزد',
      brochure: '',
      city: 'یزد',
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
              placeholder={` نام`}
              name="hotelName"
              value={` نام${hotelName}`}
              onChange={handleInputChange}
            />
          </div>
          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              placeholder={`اطلاعات مالک`}
              name="ownerDetails"
              value={` اطلاعات مالک${ownerDetails}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              placeholder=' آدرس'
              name="hotelAddress"
              value={` آدرس${hotelAddress}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              placeholder=' تلفن'
              name="hotelPhoneNumber"
              value={` تلفن${hotelPhoneNumber}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              placeholder=' مقررات'
              name="hotelRegulations"
              value={` مقررات${hotelRegulations}`}
              onChange={handleInputChange}
            />
          </div>

          <div className="hotel_page_input2">
            <input
              className="right-aligned"
              placeholder=' ستاره'
              name="starCount"
              value={` ستاره${starCount}`}
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
              <img alt="room Image" src={newRoomImage} className="custom-image-room" />
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




// import React, { useState } from 'react';
// import axios from "axios";

// const HotelRefactor = () => {

//   const [file, setFile] = useState(null);


//   const handleFileChange = (event) => {
//       setFile(event.target.files);
//       console.log(file)
//   }

//   const handleSubmit = (event) => {
//       event.preventDefault();
//       const data = new FormData();
//       for(var x = 0; x<file.length; x++) {
//           data.append('file', file[x])
//       }
//       axios.post("http://localhost:8000/upload/", data)
//       .then(res => { 
//           console.log(res.statusText)
//         })
//   }

//   return ( 
//       <div className='main-container'>
//         <form >
//           <div className="form-group" >

//               <label htmlFor="file">Upload File:</label>
//               <input 
//               className="form-control-file mb-3" 
//               type="file" id="file" 
//               accept=".jpg"
//               multiple
//               onChange={handleFileChange}
//               />

//               <button 
//               className="btn btn-primary mt-3" 
//               onClick={handleSubmit}
//               >Upload</button>
//           </div>
//         </form>

//         {/* Display Image Here */}
//       </div>
//   );
// }
// export default HotelRefactor;
