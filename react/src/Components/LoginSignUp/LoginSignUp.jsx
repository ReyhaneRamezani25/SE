import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './LoginSignUp.css';

const LoginSignUp = () => {
  const [action, setAction] = useState('Login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      setMessage("Enter an email!");
    } else if (!emailRegex.test(email)) {
      setMessage("Email is not valid!");
    } else if(username===""){
      setMessage("Enter a UserName!")
    } else if (password === "") {
      setMessage("Enter a password!");
    } else if (password.length<6) {
      setMessage("Password should at least 6 character!");
    } else {
      setMessage("OK");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underLine'></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='inputs'>
          {action === 'Login' ? null : (
            <div className='input'>
              <img src={require('./icon_email.png')} alt='' />
              <input
                type='text'
                placeholder='Email address'
                value={email}
                onChange={handleChange}
              />
            </div>
          )}
          <div className='input'>
            <img src={require('./icon_user.png')} alt='' />
            <input
              type='text'
              placeholder='User name'
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className='input'>
            <img src={require('./icon_pass.png')} alt='' />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {action === 'Login' ? null : (
            <p>{message}</p>
          )}
        </div>
          <p> Are you an Hotel admin?</p>
          <Link to="/login-hotel">click here</Link>
        <div className='submit-container'>
          <button
            type='submit'
            className={action === 'Login' ? 'submit gray' : 'submit'}
            onClick={() => setAction('Sign Up')}
          >
            Sign Up
          </button>
          <div
            className={action === 'Sign Up' ? 'submit gray' : 'submit'}
            onClick={() => {
              setAction('Login');
              handleValidation(); // Validate on switch to Login
            }}
          >
            Login
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginSignUp;
