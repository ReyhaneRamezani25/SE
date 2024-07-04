import './Pardakht.css'
// src/PaymentForm.js
import React, { useState, useEffect } from 'react';

const Pardakht = () => {
const [cardNumber, setCardNumber] = useState({ part1: '', part2: '', part3: '', part4: '' });
  const [expiry, setExpiry] = useState({ month: '', year: '' });
  const [ccv, setCcv] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  let guests = JSON.parse(localStorage.getItem('guests'));
  let user = JSON.parse(localStorage.getItem('user'));
  let index = JSON.parse(localStorage.getItem('index'));
  let room_ids = JSON.parse(localStorage.getItem('room_ids'));

  useEffect(() => {
    console.log("guests", guests);
    console.log("user", user);
    console.log("index", index);
  }, []);


  const handleCardNumberChange = (e) => {
      const { name, value } = e.target;
      if (value.length <= 4) {
        setCardNumber({
          ...cardNumber,
          [name]: value,
        });
      }
    };
  
    const handleExpiryChange = (e) => {
      const { name, value } = e.target;
      if (value.length <= 2) {
        setExpiry({
          ...expiry,
          [name]: value,
        });
      }
    };
    const handleCcvChange = (e) => {
      const { value } = e.target;
      if (value.length <= 3) {
        setCcv(value);
      }
    };
    const handlePasswordChange = (e) => {
      const { value } = e.target;
      if (value.length <= 5) {
        setPassword(value);
      }
    };
  
    const handleCardNumberKeyUp = (e) => {
      const { name, value } = e.target;
      if (value.length === 4) {
        switch (name) {
          case 'part1':
            document.getElementById('part2').focus();
            break;
          case 'part2':
            document.getElementById('part3').focus();
            break;
          case 'part3':
            document.getElementById('part4').focus();
            break;
          default:
            break;
        }
      }
    };
  
    const handleExpiryKeyUp = (e) => {
      const { name, value } = e.target;
      if (value.length === 2) {
        if (name === 'month') {
          document.getElementById('year').focus();
        }
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(({
        registrar: user.username,
        start: "2024-05-01",
        end: "2024-05-010",
        guests: guests,
        rooms: room_ids
      }))
      // Validate the input fields
      if (
        cardNumber.part1.length === 4 &&
        cardNumber.part2.length === 4 &&
        cardNumber.part3.length === 4 &&
        cardNumber.part4.length === 4 &&
        expiry.month.length === 2 &&
        expiry.year.length === 2 &&
        ccv.length === 3 &&
        password.length === 5 &&
        expiry.month<=12 &&
        expiry.month>=1
      ) {
        for (const guest of guests) {
          console.log(guest);
          fetch('http://localhost:8000/reserve/add_guest/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: guest.name,
              identity_code: guest.id
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch(error => {
            alert('Fetch error:', error.message);
            console.error('Fetch error:', error.message);
          });    
        }
        console.log(user);
        fetch('http://localhost:8000/reserve/add_reserve/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrar: user.username,
            start: "2024-05-01",
            end: "2024-05-10",
            guests: guests,
            rooms: [1, 2]
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch(error => {
          alert('Fetch error:', error.message);
          console.error('Fetch error:', error.message);
        });
      } else {
        alert('Please fill in all fields correctly.');
      }
    };

  return (
    <div className='pardakht-container'>
    <form onSubmit={handleSubmit}>
    <h1 className='pardakht-head1'>پرداخت آنلاین</h1>
    <div className='pardakht-cost'>:مبلغ قابل پرداخت</div>
    <div className='pardakht-cardnum'>شماره کارت  </div>
    <div className='pardakht-inputcard'>
        <input
          type="text"
          id="part1"
          name="part1"
          value={cardNumber.part1}
          onChange={handleCardNumberChange}
          onKeyUp={handleCardNumberKeyUp}
          maxLength="4"
          minLength="4"
        />
        <input
          type="text"
          id="part2"
          name="part2"
          value={cardNumber.part2}
          onChange={handleCardNumberChange}
          onKeyUp={handleCardNumberKeyUp}
          maxLength="4"
          minLength="4"
        />
        <input
          type="text"
          id="part3"
          name="part3"
          value={cardNumber.part3}
          onChange={handleCardNumberChange}
          onKeyUp={handleCardNumberKeyUp}
          maxLength="4"
          minLength="4"
        />
        <input
          type="text"
          id="part4"
          name="part4"
          value={cardNumber.part4}
          onChange={handleCardNumberChange}
          onKeyUp={handleCardNumberKeyUp}
          maxLength="4"
          minLength="4"
        />
      </div>
      <div className='pardakht-expirepart'>تاریخ انقضا  </div>
      <div className='pardakht-expirenum'>
      <input
          type="text"
          id="year"
          name="year"
          value={expiry.year}
          onChange={handleExpiryChange}
          maxLength="2"
          minLength="2"
          placeholder="سال"
        />
        <input
          type="text"
          id="month"
          name="month"
          value={expiry.month}
          onChange={handleExpiryChange}
          onKeyUp={handleExpiryKeyUp}
          maxLength="2"
          minLength="2"
          placeholder="ماه"
        /> 
      </div>
      <div className='pardakht-ccvtext'>cvv2</div>
      <div className='pardakht-ccvpart'>
        <input
          type="text"
          id="ccv"
          name="ccv"
          value={ccv}
          onChange={handleCcvChange}
          maxLength="3"
          minLength="3"
          placeholder="CVV2"
        />
      </div>
      <div className='pardakht-inputpass'>رمز کارت</div>
      <div className='pardakht-pass'>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          maxLength="5"
          minLength="5"
          placeholder="Password"
        />
      </div>
      <div className='pardakht-submitbutton'>
        <button type="submit">پرداخت</button>
      </div>
      {/* </div> */}
    </form>
    </div>
  );
};

export default Pardakht;

