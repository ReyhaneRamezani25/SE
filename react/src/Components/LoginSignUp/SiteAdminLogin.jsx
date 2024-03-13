import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignUp.css';
import { GoPerson } from 'react-icons/go';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const SiteAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
      setMessage('Enter an email!');
    } else if (!emailRegex.test(email)) {
      setMessage('Email is not valid!');
    } else if (password === '') {
      setMessage('Enter a password!');
    } else if (password.length < 6) {
      setMessage('Password should be at least 6 characters!');
    } else {
      setMessage('OK');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleValidation();

    // Add login logic here
    console.log('Login:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">Master login</div>
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
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />} {/* Eye icons */}
            </div>
          </div>
          <p>{message}</p>
        </div>
        <p>Are you a Hotel admin?</p>
        <Link to="/login-hotel">click here</Link>
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

export default SiteAdminLogin;
