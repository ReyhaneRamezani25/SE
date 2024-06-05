import React from 'react';
import { useLocation } from 'react-router-dom';
import Menu from './Menu'; // Import the Menu component

const SearchPage = () => {
  // Get the query parameters from the URL
  const query = new URLSearchParams(useLocation().search);
  const searchTerm = query.get('term');
  const startDate = query.get('start');
  const endDate = query.get('end');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Search Term: {searchTerm}</p>
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <Menu /> {/* Render the Menu component */}
    </div>
  );
};

export default SearchPage;
