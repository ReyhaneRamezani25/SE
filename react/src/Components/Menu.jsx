// export default Menu;
import React, { useState, useEffect, useContext } from 'react';
import './Menu.css';
import axios from 'axios';
import { UserContext } from '../UserContext';

const Menu = () => {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [hotelIds, setHotelIds] = useState([]);
  const [hotelNames, setHotelNames] = useState([]);
  
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
        return URL.createObjectURL(blob);
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
    
    .then(async data => {
      const imageUrls = JSON.parse(data).image_urls;
      const hotel_names = JSON.parse(data).names;
      const hotel_ids = JSON.parse(data).id;
      setHotelIds(hotel_ids);
      setHotelNames(hotel_names);
      if (imageSrcs.length === 0){
        const fetchedImages = await Promise.all(imageUrls.map(url => fetchImage(url)));
        setImageSrcs(fetchedImages);
      }
    })
    .catch(error => {
      // Handle error
      console.error('Fetch error:', error.message);
      // setMessage(error.message)
    });

  },[]);

  useEffect(() => {
    console.log('Hotel IDs after state update:', hotelIds);
  }, [hotelIds]);

  const handleClick = (index) => {
    window.location.href = `/hotel/${index}`;
  };

return (
  <div className='menu-container'>
    <div className='header'>
      <div className="menu-columns">
        {imageSrcs.map((imageUrl, index) => (
          <div key={index} className="image-columns">
            <div className="menu-item" onClick={() => handleClick(hotelIds[index])}>
              <img src={imageUrl} alt={`Image ${index}`} />
            </div>
            <div className="hotel-id">هتل: {hotelNames[index]}</div> {/* Display hotel ID on the right */}
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default Menu;
