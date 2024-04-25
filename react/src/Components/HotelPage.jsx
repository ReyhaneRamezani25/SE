// export default Hotel;
import { useParams } from 'react-router-dom';
import './HotelPage.css'
import React, { useState, useEffect } from 'react';

const Hotel = () => {
  const { index } = useParams();
  const [hotel_name, set_hotel_name] = useState('');
  const [hotelImage, setHotelImage] = useState('');

  useEffect(() => {
    setHotelImage(`https://via.placeholder.com/100?text=Image${index}`)
    const fetchImages = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('index', index);

            const url = `http://localhost:8000/hotel/get_data?${queryParams.toString()}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                console.log(data.data);
                set_hotel_name(data.data['name'])
            } else {
                console.error('Failed to fetch images:', response.status);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    fetchImages();
  }, [index]);

  return (
    <div className='main-container'>

      <div className="">
        {[...Array(5)].map((_, index) => (
          <i key={index} className="fas fa-star"></i>
        ))}
      </div>

      {hotelImage && (
        <div className="custom-image">
          <img src={hotelImage} alt="Hotel" className="custom-image" />
        </div>
      )}

      <h2 className='margin-left-better'>Hotel {hotel_name}</h2>

      <div className='right-section'>
        <div className='room-container'></div>
        <div className='room-container'></div>
        <div className='room-container'></div>
      </div>
    </div>
  );
};

export default Hotel;
