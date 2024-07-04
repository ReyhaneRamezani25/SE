import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';
import DatePicker from "react-multi-date-picker";
import RangeDatePicker from "react-multi-date-picker";
import { UserContext } from '../UserContext';
import persian_fa from 'react-date-object/locales/persian_fa';
import persian from 'react-date-object/calendars/persian';
import { format, addDays, isBefore } from 'date-fns'; 

const SearchBar = ({ onSearch }) => {
  const { term, wanted_term } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState(term ? term.term : null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    wanted_term({ 'term': searchTerm });
    event.preventDefault();
    onSearch(searchTerm);
    window.location.href = '/';
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="جستوجو"
      />
      <button type="submit">جستجو</button>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

const NavigationBar = () => {
  const { user } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { wanted_date, wanted_date_end } = useContext(UserContext);

  const handleSearch = () => {
    wanted_date_end({ end: endDate });
    wanted_date({ start: startDate });
  };

  const handleStartDateChange = (start_date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedStartDate = new Date(start_date);
    selectedStartDate.setHours(0, 0, 0, 0);

    if (selectedStartDate < today) {
      console.log('Start date cannot be in the past.');
      return;
    }

    setStartDate(selectedStartDate);
    const startDateString = format(selectedStartDate, 'yyyy/MM/dd');
    wanted_date({ "start": startDateString });
    
    
    if (isBefore(endDate, addDays(selectedStartDate, 1))) {
      setEndDate(addDays(selectedStartDate, 1)); 
      const endDateString = format(addDays(selectedStartDate, 1), 'yyyy/MM/dd');
      wanted_date_end({ "end": endDateString });
    }
  };

  const handleEndDateChange = (end_date) => {
    const selectedEndDate = new Date(end_date);
    selectedEndDate.setHours(0, 0, 0, 0);

    
    if (isBefore(selectedEndDate, addDays(startDate, 1))) {
      console.log('End date must be at least one day after start date.');
      return;
    }

    setEndDate(selectedEndDate);
    const endDateString = format(selectedEndDate, 'yyyy/MM/dd');
    wanted_date_end({ "end": endDateString });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="navigation-bar">
      <ul>
        <li className="date-picker-container">
          شروع اقامت
          <RangeDatePicker
            calendar={persian}
            locale={persian_fa}
            value={startDate}
            onChange={handleStartDateChange}
            minDate={today}
          />
        </li>
        <li className="date-picker-container">
          پایان اقامت
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={endDate}
            onChange={handleEndDateChange}
            minDate={addDays(startDate, 1)} 
          />
        </li>
        <li className='header'>
          <SearchBar onSearch={handleSearch} />
        </li>
        {user ? (
          <>
            {user.userType === 'hotelAdmin' ? (
              <>
                <li><NavLink to="/hotel_admin/change_hotel">هتل</NavLink></li>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/hotel_admin/analysis">تحلیل</NavLink></li>
              </>
            ) : user.userType === 'siteAdmin' ? (
              <>
                <li><NavLink to="/site_admin/hotel_create">هتل</NavLink></li>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/admin/analysis">تحلیل</NavLink></li>
                <li><NavLink to="/site_admin/admin_assign">ادمین</NavLink></li>
                <li><NavLink to='/site_admin/hotel_list'>لیست</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/profile">پروفایل</NavLink></li>
                <li><NavLink to="/">خانه</NavLink></li>
                <li><NavLink to="/help">راهنما</NavLink></li>
                <li><NavLink to="/reserve">رزروها</NavLink></li>
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
};

export default NavigationBar;
