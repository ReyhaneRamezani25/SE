import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types'; // Import prop-types for prop validation
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';
import DatePicker from "react-multi-date-picker";
import RangeDatePicker from "react-multi-date-picker";
import { UserContext } from '../UserContext';
import persian_fa from 'react-date-object/locales/persian_fa';
import persian from 'react-date-object/calendars/persian';

const SearchBar = ({ onSearch }) => {
  const { term, wanted_term } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState(term ? term.term : null);

  console.log("search term is: ", searchTerm)
  console.log("term is: ", term)

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
  onSearch: PropTypes.func.isRequired, // Validate onSearch as a required function
};

const NavigationBar = () => {
  const { user, loginUser } = useContext(UserContext);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { wanted_date, wanted_date_end } = useContext(UserContext);
  console.log("user is: ", user);
  
  const handleSearch = (searchTerm) => {
    wanted_date_end({ end: endDate });
    wanted_date({ start: startDate });
    // loginUser({ start: startDate, end: endDate });
  };

  const handleStartDateChange = (start_date) => {
    setStartDate(start_date);
    const startDateString = start_date.format('YYYY/MM/DD');
    wanted_date({ "start": startDateString });
  };

  const handleEndDateChange = (end_date) => {
    setEndDate(end_date);
    const endDateString = end_date.format('YYYY/MM/DD');
    wanted_date_end({ "end": endDateString });
  };

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
          />
        </li>
        <li className="date-picker-container">
          پایان اقامت
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={endDate}
            onChange={handleEndDateChange}
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
                <li><NavLink to="/">تحلیل</NavLink></li>
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
