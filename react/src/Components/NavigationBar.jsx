import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';
import SearchBar from './SearchBar';
import DatePicker from "react-multi-date-picker";
import  RangeDatePicker  from "react-multi-date-picker";

import persian_fa from 'react-date-object/locales/persian_fa';
import persian from 'react-date-object/calendars/persian';

const NavigationBar = () => {
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

        <li><NavLink to="/">خانه</NavLink></li>
        <li><NavLink to="/profile">پروفایل</NavLink></li>
        <li><NavLink to="/login">ورود</NavLink></li>
      </ul>
    </div>
  );
}

export default NavigationBar;
