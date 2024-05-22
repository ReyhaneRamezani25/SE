import React, { useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NewHotelAdmin.css';
import { MdOutlineEmail, MdOutlineExpandCircleDown } from 'react-icons/md';
import { UserContext } from '../../UserContext';

const NewHotelAdmin = () => {
  const [email, setEmail] = useState('');
  const [hotelID, setHotelID] = useState('');
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
    setEmail(e.target.value);
  };

  const handleHotelID = (e) => {
    setHotelID(e.target.value);
  };

  const assign_admin = () => {
  }

  const signup = () => {
    console.log('SignUp:', { email, hotelID });
    fetch('http://localhost:8000/hotel_admin/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: email,
        hotel_id: hotelID,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text(); 
    })
    
    .then(data => {  
      console.log(data);
      setMessage(data);
      if (data === 'Admin Hotel created successfully!'){
        setMessage(data);
      }
    })
    .catch(error => {
      // Handle error
      console.error('Fetch error:', error.message);
      setMessage(error.message)
    });
  }

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setMessage('ایمیل ادمین هتل را وارد کنید');
    } else if (!emailRegex.test(email)) {
      setMessage('فرمت ایمیل وارد شده صحیح نمی‌باشد');
    } else if (hotelID === '') {
      setMessage('شناسه هتل را وارد کنید');
    } else {
      setMessage('');
      signup();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleValidation();
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">ساخت ادمین جدید</div>
        <div className="underLine"></div>
      </div>
      <form>
        <div className="inputs">
          <div className="input">
            <MdOutlineEmail className="icon" />
            <input
              type="text"
              placeholder="ایمیل ادمین هتل"
              value={email}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            {/* <MdOutlineEmail className="icon" /> */}
            <input
              type="text"
              placeholder="شناسه هتل"
              value={hotelID}
              onChange={handleHotelID}
            />
          </div>
          <p>{message}</p>
        </div>
        <div className="submit-container">
          <button
            type="submit"
            className="submit"
            onClick={handleLogin}
          >
            ایجاد

          </button>          
        </div>
      </form>
    </div>
  );
};

export default NewHotelAdmin;