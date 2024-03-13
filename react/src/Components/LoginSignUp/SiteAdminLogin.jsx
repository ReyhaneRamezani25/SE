import React from 'react';
import './LoginSignUp.css';

const SiteAdminLogin = () => {
  return (
    <div className='login-container'>
      <div className='header'>
        <div className='text'>Master login</div>
        <div className='underLine'></div>
      </div>
      <form >
        <div className='inputs'>
          <div className='input'>
            <img src={require('./icon_user.png')} alt='' />
            <input
              type='text'
              placeholder='UserName'
            />
          </div>

          <div className='input'>
            <img src={require('./icon_pass.png')} alt='' />
            <input
              type='password'
              placeholder='Password'
            />
          </div>
        </div>

        <div className='submit-container'>
          <div
            className='submit'
          >
            Login
          </div>
        </div>
      </form>
    </div>
  );
};

export default SiteAdminLogin;
