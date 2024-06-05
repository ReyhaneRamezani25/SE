import { useParams } from 'react-router-dom';
import './Reserves.css';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Reserve = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCellContent, setSelectedCellContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [imageSrcs, setImageSrcs] = useState([]);
  const { user, loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const requestData = {
        username: user.username
      };
  
      const response = await axios.post('http://localhost:8000/reserve/', requestData);
      const fetchedData = response.data;
      setData(fetchedData);
      if (fetchedData.length > 0) {
        const imageUrls = fetchedData.map(item => item.hotel_room_images);
        setColumns(Object.keys(fetchedData[0]).filter(key => key !== 'hotel_room_images'));
        fetchAndSetImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchImage = async (url) => {
    try {
      const requestData = { url: url };

      const response = await axios.post('http://localhost:8000/get_hotel_img/', requestData, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const fetchAndSetImages = async (imageUrls) => {
    try {
      const fetchedImages = await Promise.all(imageUrls.map(url => fetchImage(url)));
      setImageSrcs(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [columns.join(",")].concat(
        data.map((row) => columns.map((col) => JSON.stringify(row[col])).join(","))
      ).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    // Clean up
    URL.revokeObjectURL(url);
  };

  const handleCellClick = (content) => {
    setSelectedCellContent(content);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="reserves-main-container">
      <div className="reserves-centered">
        <div>رزرو ها</div>
        <br />
        <button onClick={downloadCSV}>دانلود اکسل</button>
      </div>

      <div className="reserves-table-container">
        <table className="reserves-data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>
                  <h6 className='reserves-right-aligned'>{column}</h6>
                </th>
              ))}
              <th>
                <h6 className='reserves-right-aligned'>تصویر</h6>
              </th> 
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 100).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} onClick={() => handleCellClick(row[column])}>
                    <h6 className='reserves-right-aligned'> {row[column]}</h6>
                  </td>
                ))}
                <td>
                  {imageSrcs[rowIndex] && (
                    <img src={imageSrcs[rowIndex]} alt={`Room ${rowIndex}`} className="reserves-room-image" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="reserves-popup">
          <div className="reserves-popup-content">
            <button className="reserves-close-button" onClick={closePopup}>Close</button>
            <p>{selectedCellContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserve;
