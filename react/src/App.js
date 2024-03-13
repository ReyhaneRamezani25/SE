// App.js
import React from 'react';
import NavigationBar from './Components/NavigationBar.jsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/LoginSignUp/SignUp.jsx';
import Login from './Components/LoginSignUp/Login.jsx';

import HotelAdminLogin from './Components/LoginSignUp/HotelAdminLogin.jsx'
import SiteAdminLogin from './Components/LoginSignUp/SiteAdminLogin.jsx'
import Profile from './Components/Profile.jsx'

import HomePage from './Components/Home.jsx'

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <div className='container'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />            
            <Route path='/login-hotel' element={<HotelAdminLogin />}/>
            <Route path='/admin' element={<SiteAdminLogin />}/>
            <Route path='/profile' element={<Profile />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
