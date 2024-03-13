import React from 'react';
import { Link } from 'react-router-dom'; // Import Link component for routing
import './NavigationBar.css'; // Import CSS file for styling


const NavigationBar = () => {
  return (
    <div className="navigation-bar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login-user">Login</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
}

export default NavigationBar;
