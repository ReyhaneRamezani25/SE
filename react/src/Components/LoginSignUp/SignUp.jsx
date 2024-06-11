import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignUp.css';
import { GoPerson } from 'react-icons/go';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { UserContext } from '../../UserContext';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(UserContext);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const signUp = () => {
    fetch('http://localhost:8000/customer/signup/', {
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
      console.log(data)
      setMessage(data)
      if (data === 'User created successfully!'){
        loginUser({ username: email, userType: 'customer' });
        navigate('/');
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
    } else if (username === '') {
      setMessage('Enter a UserName!');
    } else if (password === '') {
      setMessage('Enter a password!');
    } else {
      setMessage('');
      signUp();
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    handleValidation();
  };


  return (
    <div className="login-container">
      <div className="header">
        <div className="text">Sign Up</div>
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
            <GoPerson className="icon" />
            <input
              type="text"
              placeholder="User name"
              value={username}
              onChange={handleUsernameChange}
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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash className='toggle-password' /> : <FaRegEye />}
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
            onClick={handleSignUp}
          >
            Sign Up

          </button>
          
          <Link to="/login">
            <button
              className="submit"
            >
              Already have an account?
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
