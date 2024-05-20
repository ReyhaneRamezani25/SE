// App.js
import React from 'react';
import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar.jsx';

import SignUp from './Components/LoginSignUp/SignUp.jsx';
import Login from './Components/LoginSignUp/Login.jsx';
import HotelAdminLogin from './Components/LoginSignUp/HotelAdminLogin.jsx'
import SiteAdminLogin from './Components/LoginSignUp/SiteAdminLogin.jsx'
import Profile from './Components/Profile.jsx'
import Hotel from './Components/HotelPage.jsx'; // Import the Hotel component
import HomePage from './Components/Home.jsx'
import Help from './Components/Help.jsx';
// import Exit from './Components/Exit.jsx';

import './App.css';

function App() {
  return (
    <UserProvider>
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
              <Route path='/hotel/:index' element={<Hotel />} />
              <Route path='/help' element={<Help />} />
              {/* <Route path='/exit' element={<Exit />} /> */}
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}


export default App;
