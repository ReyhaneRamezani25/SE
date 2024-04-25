// export default Menu;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const [args] = useState('');
  const [placeholderLinks, set_placeholderLinks] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
        try {
            // Construct URL with URLSearchParams
            const queryParams = new URLSearchParams();
            queryParams.append('args', 'args');

            const url = `http://localhost:8000/get_hotels?${queryParams.toString()}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                set_placeholderLinks(data.image_links);
                console.log(data.image_links);
            } else {
                console.error('Failed to fetch images:', response.status);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    fetchImages();
  }, [args]);

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
