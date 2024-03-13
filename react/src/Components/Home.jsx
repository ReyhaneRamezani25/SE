import './Home.css';
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import DatePicker from "react-multi-date-picker";
import persian_fa from 'react-date-object/locales/persian_fa';
import persian from 'react-date-object/calendars/persian';

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, setValue] = useState(new Date());
  const value2 = value;

  
  const handleSearch = (searchTerm) => {
    // Perform search operation here and update searchResults state
    // Example: setSearchResults([...filteredResults]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="">
      <div className='header'>
        <SearchBar onSearch={handleSearch} />
        <div className="date-picker-container">
          <h2>Start</h2>
          <DatePicker 
            calendar={persian}
            locale={persian_fa}
            value={value} 
            onChange={handleDateChange} 
            // calendarPosition="bottom-right"
          />
        </div>
        <div className="date-picker-container">
          <h2>End</h2>
          <DatePicker 
            calendar={persian}
            locale={persian_fa}
            value={value2}
            onChange={handleDateChange} 
          />
        </div>
      </div>
      {/* Display search results */}
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
