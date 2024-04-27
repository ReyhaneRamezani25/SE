import './SearchBar.css'
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);

    fetch('http://localhost:8000/hotel/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_phrase : searchTerm,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text(); 
    })
    
    .then(data => {  
      console.log(data)
      // setMessage(data)
    })
    .catch(error => {
      // Handle error
      console.error('Fetch error:', error.message);
      // setMessage(error.message)
    });

  };

  return (
    <form className='search-bar' onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
      <button type="submit">جستجو</button>
    </form>
  );
}

export default SearchBar;
