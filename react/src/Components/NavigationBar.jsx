import React, { useState, useContext} from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';
import SearchBar from './SearchBar';
import DatePicker from "react-multi-date-picker";
import  RangeDatePicker  from "react-multi-date-picker";
import { UserContext } from '../UserContext'; // Import UserContext

import persian_fa from 'react-date-object/locales/persian_fa';
import persian from 'react-date-object/calendars/persian';

const NavigationBar = () => {
  const { user, logoutUser } = useContext(UserContext); // Use UserContext

  const [searchResults, setSearchResults] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSearch = (searchTerm) => {
    // Perform search operation here and update searchResults state
    // Example: setSearchResults([...filteredResults]);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="navigation-bar">
      <ul>
        <div className="date-picker-container">
          شروع اقامت
          <RangeDatePicker  
            calendar={persian}
            locale={persian_fa}
            value={startDate} 
            onChange={handleStartDateChange} 
          />
        </div>
        <div className="date-picker-container">
        پایان اقامت
          <DatePicker 
            calendar={persian}
            locale={persian_fa}
            value={endDate}
            onChange={handleEndDateChange} 
          />
        </div>

        <div className='header'>
          <SearchBar onSearch={handleSearch} /> 
        </div>

        {/* Display search results */}
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>

        {/* <li><NavLink to="/">خانه</NavLink></li>
        <li><NavLink to="/profile">پروفایل</NavLink></li>
        <li><NavLink to="/login">ورود</NavLink></li> */}

{/* <li><NavLink to="/">خانه</NavLink></li> */}
        {user ? (
          <>
            {user.userType === 'hotelAdmin' ? (
              <>
                <li><NavLink to="/">هتل</NavLink></li>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/hotel_admin/analysis">تحلیل</NavLink></li>
              </>
            ) : user.userType === 'siteAdmin' ? (
              <>
                <li><NavLink to="/site_admin/hotel_create">هتل</NavLink></li>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/">تحلیل</NavLink></li>
                <li><NavLink to="/site_admin/admin_assign">ادمین</NavLink></li>
                <li><NavLink to='/site_admin/hotel_list' >لیست</NavLink></li>

              </>
            ) : (
              <>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/">خانه</NavLink></li>
                <li><NavLink to="/help">راهنما</NavLink></li>
                <li><NavLink to="/profile">رزروها</NavLink></li>
              </>
            )}
          </>
        ) : (
          <>
            <li><NavLink to="/">خانه</NavLink></li>
            <li><NavLink to="/login">ورود</NavLink></li> 
          </>
        )}
      </ul>
    </div>
  );
}

export default NavigationBar;
