// export default Menu;
import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  // Generate an array of 1000 placeholder image links
  const placeholderLinks = Array.from({ length: 1000 }, (_, index) => `https://via.placeholder.com/150?text=Image${index}`);

  const handleClick = (index) => {
    // Navigate to Hotel component with index as parameter
    window.location.href = `/hotel/${index}`;
  };

  return (
    <div className='menu-container'>
      <div className='header'>
        {/* Render the placeholder image links in 5 columns */}
        <div className="menu-columns">
          {placeholderLinks.map((link, index) => (
            <div key={index} className="menu-item" onClick={() => handleClick(index)}>
              <img src={link} alt={`Placeholder ${index}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
