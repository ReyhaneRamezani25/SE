import './Home.css';

import React, { useState } from 'react';
import SearchBar from './SearchBar';

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (searchTerm) => {
    // Perform search operation here and update searchResults state
    // Example: setSearchResults([...filteredResults]);
  };

  return (
    <div className="">
        <div className='header'>
            <SearchBar onSearch={handleSearch} />
            {/* Display search results */}
            <ul>
                {searchResults.map((result, index) => (
                <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    </div>
  );
}

export default HomePage;
