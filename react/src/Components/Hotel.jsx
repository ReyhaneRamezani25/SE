import React from 'react';

const HotelPage = ({ match }) => {
  // Extract the hotelName parameter from the URL
  const hotelName = match.params.hotelName;

  // Generate the image URL based on the hotelName parameter
  const imageUrl = `https://via.placeholder.com/350?text=Image${hotelName.substring(6)}`;

  return (
    <div>

       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>
       <h1>jjj</h1>

      <h2>{hotelName}</h2>
      <img src={imageUrl} alt={`Placeholder ${hotelName}`} />
    </div>
  );
};

export default HotelPage;
