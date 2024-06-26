import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignUp.css';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { UserContext } from '../../UserContext';

const HotelAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = () => {
    console.log('Login:', { email, password });
    fetch('http://localhost:8000/hotel_admin/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email, 
        password: password,
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
      if (data === 'Login Accepted!'){
        loginUser({ username: email, userType: 'hotelAdmin', password: password});
        navigate('/hotel_admin/analysis');
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
      setMessage('Enter an email!');
    } else if (!emailRegex.test(email)) {
      setMessage('Email is not valid!');
    } else if (password === '') {
      setMessage('Enter a password!');
    } else {
      setMessage('');
      login();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleValidation();
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">Admin hotel login</div>
        <div className="underLine"></div>
      </div>
      <form>
        <div className="inputs">
          <div className="input">
            <MdOutlineEmail className="icon" />
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <CiLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div
              className="toggle-password"
              role="button"
              tabIndex="0"
              onClick={togglePassword}
              onKeyDown={handleTogglePasswordKeyDown}
            >
              {showPassword ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />}
            </div>
          </div>
          <p>{message}</p>
        </div>
        <p>Are you a Customer admin?</p>
        <Link to="/login">click here</Link>
        <div className="submit-container">
          <button
            type="submit"
            className="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelAdminLogin;
