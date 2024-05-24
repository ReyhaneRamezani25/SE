// export default Menu;
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Menu.css';
import axios from 'axios';
import { UserContext } from '../UserContext';

const Menu = () => {
  const [imageSrcs, setImageSrcs] = useState([]);
  const {term, date, date_end} = useContext(UserContext);
  console.log(term, date, date_end);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchImage = async (url) => {
    try {
        const requestData = {
            url: url,
        };

        const response = await axios.post('http://localhost:8000/get_hotel_img/', requestData, {
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrcs(prevImageSrcs => [...prevImageSrcs, imageUrl]);
      } catch (error) {
        console.error('Error fetching image:', error);
    }
};

  useEffect(() => {
    fetch('http://localhost:8000/get_hotels/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_phrase : term,
        start: date,
        end: date_end,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text(); 
    })
    
    .then(data => {  
      console.log(JSON.parse(data).image_urls)
      const imageUrls = JSON.parse(data).image_urls;
      if (imageSrcs.length === 0){
        for (const url of imageUrls) {
          fetchImage(url);
          delay(500);
        }
      }
    })
    .catch(error => {
      // Handle error
      console.error('Fetch error:', error.message);
      // setMessage(error.message)
    });

  },[]);

  const handleClick = (index) => {
    // Navigate to Hotel component with index as parameter
    window.location.href = `/hotel/${index}`;
  };

  return (
    <div className='menu-container'>
        <div className='header'>
            {/* Render the images */}
            <div className="menu-columns">
                {imageSrcs.map((imageUrl, index) => (
                    <div key={index} className="menu-item" onClick={() => handleClick(index)}>
                        <img src={imageUrl} alt={`Image ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);
};

export default Menu;
