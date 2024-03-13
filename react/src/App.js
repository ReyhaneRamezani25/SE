// App.js
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignUp from './Components/LoginSignUp/LoginSignUp.jsx';
import HotelAdminLogin from './Components/LoginSignUp/HotelAdminLogin.jsx'
import SiteAdminLogin from './Components/LoginSignUp/SiteAdminLogin.jsx'
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <header>
        </header>
        <Routes>
          <Route path="/" element={<LoginSignUp />} />
          <Route path='/login-hotel' element={<HotelAdminLogin />}/>
          <Route path='/Admin' element={<SiteAdminLogin />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
