// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import API from './api/api';

function App() {
  const [user, setUser] = useState(null);

  // ==========================
  // Init user from localStorage
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // set axios default Authorization header
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // set user state (opsional bisa decode JWT untuk username)
      setUser({ username: 'User' });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); // hapus token
    API.defaults.headers.common['Authorization'] = null; // hapus header
    setUser(null); // reset state
  };

  return (
    <Router>
      {user && <Sidebar />}
      {user && <Navbar user={user} logout={logout} />}

      <div style={{ marginLeft: user ? '220px' : '0', padding: '20px' }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
               <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
