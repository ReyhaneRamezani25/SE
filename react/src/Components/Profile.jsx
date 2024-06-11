import './Profile.css'
import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { GoPerson } from 'react-icons/go';
import { CiLock } from 'react-icons/ci';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { UserContext } from '../UserContext';

const Profile = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [prevPassword, setPrevPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPrevPassword, setShowPrevPassword] = useState(false);

  const { logoutUser } = useContext(UserContext);
  const { user, loginUser, unwanted_date_end, unwanted_date, unwanted_term } = useContext(UserContext);
  const navigate = useNavigate();


  const handlePasswordChange1 = (e) => {
    setPassword1(e.target.value);
  };
  const handlePrevPasswordChange = (e) => {
    setPrevPassword(e.target.value);
  };
  const handlePasswordChange2 = (e) => {
    setPassword2(e.target.value);
  };

  const change_pass = async () => {
    console.log(user.username);
    console.log('Change Password:', { password1, password2 });
    let url = '';
    if (user.userType === 'customer') {
      url = 'http://localhost:8000/customer/update/';
    } else if (user.userType === 'hotelAdmin') {
      url = 'http://localhost:8000/hotel_admin/update/';
    } else {
      url = 'http://localhost:8000/site_admin/update/';
    }
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: prevPassword,
          new_password: password1,
          username: user.username,
        }),
      });
  
      if (!response.ok) {
        throw new Error(response.statusText);
      }
  
      const data = await response.text();
      console.log(data);
      setMessage(data);
  
      if (data === 'Password changed successfully!') {
        logoutUser();
        unwanted_date_end();
        unwanted_date();
        unwanted_term();
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      setMessage(error.message);
    }
  };
  
  const handleValidation = () => {
    setMessage('');
    if (password1 === '') {
      setMessage('First Password field required!');
    } else if (password2 === '') {
      setMessage('Second Password field required!');
    } else if (password1 !== password2) {
      setMessage('Passwords are not the same');
    }
    else {
      change_pass();
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleValidation();
  };

  const logout = () => {
    logoutUser();
    navigate('/login');
    window.location.reload();

  }

  return (
    <div className="profile-container">
      <div className="header">
        <div className="text">تغییر رمز عبور</div>
        <div className="underLine"></div>
      </div>
      <form>

        <div className="inputs">
          <div className="input">
            <CiLock className="icon" />
              <input
                type={showPrevPassword ? 'text' : 'password'}
                placeholder="رمز فعلی"
                value={prevPassword}
                onChange={handlePrevPasswordChange}
              />
          <div
            className="toggle-password"
            onClick={() => setShowPrevPassword(!showPrevPassword)}
          >
            {showPrevPassword ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />} {/* Eye icons */}
          </div>
        </div>

        {/* The new password */}

        <div className="input">
          <CiLock className="icon" />
          <input
            type={showPassword1 ? 'text' : 'password'}
            placeholder="رمز جدید"
            value={password1}
            onChange={handlePasswordChange1}
          />
          <div
            className="toggle-password"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />} {/* Eye icons */}
            </div>
          </div>

        {/* Repeat new password */}

        <div className="input">
          <CiLock className="icon" />
          <input
            type={showPassword2 ? 'text' : 'password'}
            placeholder="تکرار رمز جدید"
            value={password2}
            onChange={handlePasswordChange2}
          />
          <div
            className="toggle-password"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />}
          </div>
        </div>

        <p>{message}</p>

        </div>
        <div className="submit-container">
          <button
            type="submit"
            className="submit"
            onClick={handleLogin}
          >
            ذخیره

          </button>

          {/* <Link to="/login"> */}
          <button
            className="submit"
            onClick={logout} // Call logoutUser function when clicked
          >
            خروج
          </button>
          {/* </Link> */}
        </div>
      </form>
    </div>
  );
};

export default Profile;