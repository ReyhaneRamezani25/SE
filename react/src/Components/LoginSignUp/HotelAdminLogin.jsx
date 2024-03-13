import React, { useState } from 'react';
import './LoginSignUp.css';
import { GoPerson } from "react-icons/go";
import { CiLock } from "react-icons/ci";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const HotelAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false); // State variable to toggle password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login-container'>
      <div className='header'>
        <div className='text'>hotel admin login</div>
        <div className='underLine'></div>
      </div>
      <form>
        <div className='inputs'>
          <div className='input'>
            <GoPerson className="icon"/>
            <input
              type='text'
              placeholder='UserName'
            />
          </div>

          <div className='input'>
            <CiLock className="icon"/>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between 'password' and 'text'
              placeholder='Password'
            />
            {/* Toggle button to show/hide password */}
            <div className='toggle-password' onClick={togglePasswordVisibility}>
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </div>
          </div>
        </div>

        <div className='submit-container'>
          <div className='submit'>
            Login
          </div>
        </div>
      </form>
    </div>
  );
};

export default HotelAdminLogin;
