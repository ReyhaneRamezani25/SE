import React from 'react';
import { NavLink } from 'react-router-dom'; // Import Link component for routing
import './NavigationBar.css'; // Import CSS file for styling


const NavigationBar = () => {
  return (
    <div className="navigation-bar">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/profile">Profile</NavLink></li>
      </ul>
    </div>
  );
}

export default NavigationBar;
