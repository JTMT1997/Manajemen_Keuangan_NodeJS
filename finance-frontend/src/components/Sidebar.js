import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Finance App</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/transactions">Transaksi</Link></li>
        <li><Link to="/categories">Kategori</Link></li>
        <li><Link to="/reports">Laporan</Link></li>

      </ul>
    </div>
  );
};

export default Sidebar;
