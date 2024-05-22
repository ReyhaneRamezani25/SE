import React, { useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NewHotelAdmin.css';
import { MdOutlineEmail, MdOutlineExpandCircleDown } from 'react-icons/md';
import { UserContext } from '../../UserContext';

const NewHotelAdmin = () => {
  const [city, setCity] = useState('');
  const [hotelName, SetHotelName] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { user, loginUser } = useContext(UserContext);

  if (user === null){
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

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleHotelNameChange = (e) => {
    SetHotelName(e.target.value);
  };

  const create = () => {
    const formData = new FormData();
    formData.append('name', hotelName);
    formData.append('location_x', "0");
    formData.append('location_y', "0");
    formData.append('address', "null");
    formData.append('stars', "0");
    formData.append('rating', "0");
    formData.append('number_of_rates', "0");
    formData.append('number_of_rooms', "0");
    formData.append('facilities', "sample");

    fetch('http://localhost:8000/site_admin/create_hotel/', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json(); 
    })
    .then(data => {
      console.log(data);
      setMessage(data.message);
      if (data.message === 'Hotel added successfully!') {
        navigate('/');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error.message);
      setMessage(error.message);
    });

}

  const handleValidation = () => {
    if (hotelName === '') {
      setMessage('Enter The Hotel Name!');
    } else {
      setMessage('');
      create();
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    handleValidation();
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">ساخت هتل جدید</div>
        <div className="underLine"></div>
      </div>
      <form>
        <div className="inputs">
          <div className="input">
            <input
              type="text"
              placeholder="نام هتل"
              value={hotelName}
              onChange={handleHotelNameChange}
            />
          </div>

          <div className="input">
            {/* <MdOutlineEmail className="icon" /> */}
            <input
              type="text"
              placeholder="توضیحات"
              value={city}
              onChange={handleChange}
            />
          </div>
          <p>{message}</p>
        </div>
        <div className="submit-container">
          <button
            type="submit"
            className="submit"
            onClick={handleCreate}
          >
            ایجاد

          </button>          
        </div>
      </form>
    </div>
  );
};

export default NewHotelAdmin;