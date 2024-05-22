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
import NewHotelAdmin from './Components/AdminStrict/NewHotelAdmin.jsx';
import NewHotel from './Components/AdminStrict/NewHotel.jsx';
import HotelLists from './Components/AdminStrict/HotelLists.jsx';
import Analysis from './Components/HotelStrict/Analysis.jsx';
import HotelRefactor from './Components/HotelStrict/HotelRefactor.jsx';
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
              <Route path='/site_admin/admin_assign' element={<NewHotelAdmin />} />
              <Route path='/site_admin/hotel_create' element={<NewHotel />} />
              <Route path='/site_admin/hotel_list' element={<HotelLists />} />

              <Route path='/hotel_admin/analysis' element={<Analysis />} />
              <Route path='/hotel_admin/change_hotel' element={<HotelRefactor />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}


export default App;
