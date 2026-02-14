// src/components/Navbar.js
import React from 'react';

const Navbar = ({ user, logout }) => {
  return (
    <div className="navbar" style={{ padding: '10px 20px', background: '#f3f4f6', marginLeft: '220px' }}>
      <span>Welcome, {user?.username}</span>
      <button onClick={logout} style={{ float: 'right' }}>Logout</button>
    </div>
  );
};

export default Navbar;
