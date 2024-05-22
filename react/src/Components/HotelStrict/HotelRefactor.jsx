// export default Hotel;
import { useParams } from 'react-router-dom';
import './HotelRefactor.css'
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';

const HotelRefactor = () => {
  const { index } = useParams();
  const [hotel_name, set_hotel_name] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const { user, loginUser } = useContext(UserContext);

  const [hotelName, setHotelName] = useState('');
  const [ownerDetails, setOwnerDetails] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelPhoneNumber, setHotelPhoneNumber] = useState('');
  const [hotelRegulations, setHotelRegulations] = useState('');

  const [roomName, setRoomName] = useState('نام اتاق');


  const collectData = () => {
    setHotelImage(`https://via.placeholder.com/100?text=Image${index}`)
    const fetchImages = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('index', index);

            const url = `http://localhost:8000/hotel/get_data?${queryParams.toString()}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log(data.data);
                set_hotel_name(data.data['name'])
            } else {
                console.error('Failed to fetch images:', response.status);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
  }

  useEffect(() => {
    if (user !== null && user.userType === 'hotelAdmin'){
        collectData();
    }
  }, [index]);

  if (user === null || user.userType === 'customer' || user.userType === 'siteAdmin'){
    console.log("exit");
    return (
        <div className="login-container">
            <div className="header">
                <div className="text">ACCESS DENIED</div>
                <div className="underLine"></div>
            </div>
        </div>
  
    );
  }

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
            {/* {Left section} */}
            <div className="">
                {[...Array(5)].map((_, index) => (
                <i key={index} className="fas fa-star"></i>
                ))}
            </div>
            {hotelImage && (
                <div className="custom-image">
                <img src={hotelImage} alt="Hotel" className="custom-image" />
                </div>
            )}

            <div className="input2">
                <input
                    type="text"
                    placeholder="نام هتل"
                    value={hotelName}
                    onChange={handleHotelNameChange}
                />
            </div>
            <div className="input2">
                <input
                    type="text"
                    placeholder="مشخصات مالک"
                    value={ownerDetails}
                    onChange={handleOwnerDetailsChange}
                />
            </div>
                <div className="input2">
                <input
                    type="text"
                    placeholder="آدرس هتل"
                    value={hotelAddress}
                    onChange={handleHotelAddressChange}
                />
            </div>
                <div className="input2">
                <input
                    type="text"
                    placeholder="شماره تلفن هتل"
                    value={hotelPhoneNumber}
                    onChange={handleHotelPhoneNumberChange}
                />
            </div>
                <div className="input2">
                <input
                    type="text"
                    placeholder="مقررات هتل"
                    value={hotelRegulations}
                    onChange={handleHotelRegulationsChange}
                />
            </div>
        </div>

        <div className="right-section">
            {/* {Rigth section} */}
           <div className='right-section'>
             <div className='room-container'>

                <div className="input3">
                    <input
                        type="text"
                        placeholder="نام اتاق"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="امکانات"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="ظرفیت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="قیمت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>

             </div>
             <div className='room-container'>
             <div className="input3">
                    <input
                        type="text"
                        placeholder="نام اتاق"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="امکانات"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="ظرفیت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="قیمت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
             </div>
             <div className='room-container'>
             <div className="input3">
                    <input
                        type="text"
                        placeholder="نام اتاق"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="امکانات"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="ظرفیت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>
                <div className="input3">
                    <input
                        type="text"
                        placeholder="قیمت"
                        value={hotelRegulations}
                        onChange={handleHotelRegulationsChange}
                    />
                </div>

             </div>

             <div className="submit-container">
                <button
                    type="submit"
                    className="submit"
                    onClick={handleLogin}
                >
                    ایجاد اتاق جدید
                </button>
            </div>

           </div>

        </div>
        </div>
    </div>
  );
};

export default HotelRefactor;
