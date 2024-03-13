import React from 'react';
import './Menu.css';

const Menu = () => {
  // Generate an array of 1000 placeholder image links
  const placeholderLinks = Array.from({ length: 1000 }, (_, index) => `https://via.placeholder.com/150?text=Image${index}`);

  return (

    <div className='menu-container'>
        <div className='header'>
            {/* Render the placeholder image links in 5 columns */}
            <div className="menu-columns">
                {placeholderLinks.map((link, index) => (
                <div key={index} className="menu-item">
                    <img src={link} alt={`Placeholder ${index}`} />
                </div>
                ))}
            </div>
        </div>
    </div>

  );
};

export default Menu;
