// export default Hotel;
import { useParams } from 'react-router-dom';
import './HotelPage.css'
import React, { useState, useEffect } from 'react';

const Hotel = () => {
  const { index } = useParams();
  const [hotel_name, set_hotel_name] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
        try {
            // Construct URL with URLSearchParams
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
  }, [index]); // Include index in the dependency array

  return (
    <div className='menu-container'>
      <h2>Hotel Details for Image {index}</h2>
      <h2>Name: {hotel_name}</h2>
    </div>
  );
};

export default Hotel;
