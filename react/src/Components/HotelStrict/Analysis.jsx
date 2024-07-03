import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Analysis.css';
import { UserContext } from '../../UserContext';

const Analysis = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCellContent, setSelectedCellContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { user, loginUser } = useContext(UserContext);

  useEffect(() => {
    if (user !== null && user.userType === 'hotelAdmin'){
      fetchData();
    }
  }, []);

  if (user === null || user.userType === 'customer' || user.userType === 'siteAdmin'){
    console.log("exit");
    return (
        <div className="login-container">
            <div className="header">
                <div className="text">ACCESS DENIED</div>
                <div className="underLine"></div>
            </div>
        </div>
  
    );
  }

  const fetchData = async () => {
    try {
      // Assuming you need to send some data in the request body
      const requestData = {
        username: user.username,
        password: user.password
      };
  
      const response = await axios.post('http://localhost:8000/hotel_admin/analysis/', requestData);
      setData(response.data);
      if (response.data.length > 0) {
        setColumns(Object.keys(response.data[0]));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <div className="list-container">
        <div className="radar_main_content">
        <div className="centered">
            <div>لیست هتل ها</div>
            <br></br>
            <button onClick={downloadCSV}>دانلود اکسل</button>
        </div>

        <div className="table-container">
            <table className="data-table">
            <thead>
                <tr>
                {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                ))}
                </tr>
            </thead>
            <tbody>
                {data.slice(0, 100).map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                    <td key={colIndex} onClick={() => handleCellClick(row[column])}>{row[column]}</td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        {showPopup && (
            <div className="popup">
            <div className="popup-content">
                <button className="close-button" onClick={closePopup}>Close</button>
                <p>{selectedCellContent}</p>
            </div>
            </div>
        )}
        </div>
    </div>    
  );
};

export default Analysis;