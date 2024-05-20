import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignUp.css';
import { GoPerson } from 'react-icons/go';
import { CiLock } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { UserContext } from '../../UserContext';

const Login = () => {
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
    fetch('http://localhost:8000/customer/login/', {
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

  return (
    <div className="login-container">
      <div className="header">
        <div className="text">Login</div>
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
          
          <Link to="/sign-up">
            <button
              className="submit"
            >
              Don't have any account?
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;