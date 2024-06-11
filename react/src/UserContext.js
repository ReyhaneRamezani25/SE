import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [date, setDate] = useState(() => {
    const startDate = localStorage.getItem('date');
    return startDate ? JSON.parse(startDate) : null;
  });

  const [date_end, set_date_end] = useState(() => {
    const endtDate = localStorage.getItem('date_end');
    return endtDate ? JSON.parse(endtDate) : null;
  });

  const [term, setTerm] = useState(() => {
    const searchTerm = localStorage.getItem('term');
    return searchTerm ? JSON.parse(searchTerm) : null;
  });

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    if (date) {
      localStorage.setItem('date', JSON.stringify(date));
    } else {
      localStorage.removeItem('date');
    }
    if (date_end) {
      localStorage.setItem('date_end', JSON.stringify(date_end));
    } else {
      localStorage.removeItem('date_end');
    }
    if (term) {
      localStorage.setItem('term', JSON.stringify(term));
    } else {
      localStorage.removeItem('term');
    }
  }, [user, date, date_end, term]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
    setDate(null);
    setTerm(null);
    set_date_end(null);
  };

  const wanted_date = (data) => {
    setDate(data);
  }

  const unwanted_date = () => {
    setDate(null);
  }

  const wanted_date_end = (date_end) => {
    set_date_end(date_end);
  }
  const unwanted_date_end = () => {
    set_date_end(null);
  }

  const wanted_term = (term) => {
    setTerm(term);
  }

  const unwanted_term = () => {
    setTerm(null);
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, date, wanted_date, unwanted_date, wanted_term, unwanted_term, term, date_end, unwanted_date_end, wanted_date_end}}>
      {children}
    </UserContext.Provider>
  );
};
