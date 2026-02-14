import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { username, password });
      const token = res.data.token;

      if (!token) throw new Error('Token tidak ditemukan');

      // Simpan token
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUser({ username });

      // Redirect ke dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Login gagal, coba lagi');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      minWidth: '320px',
    },
    title: {
      marginBottom: '20px',
      textAlign: 'center',
      color: '#333',
    },
    input: {
      marginBottom: '15px',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    buttonPrimary: {
      padding: '12px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      marginBottom: '10px',
      transition: '0.3s',
    },
    buttonSecondary: {
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #007bff',
      backgroundColor: '#fff',
      color: '#007bff',
      fontSize: '16px',
      cursor: 'pointer',
      transition: '0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* Tombol Login */}
        <button
          style={styles.buttonPrimary}
          onClick={handleLogin}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Login
        </button>

        {/* Tombol Register */}
        <button
          style={styles.buttonSecondary}
          onClick={() => navigate('/register')}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#007bff';
          }}
        >
          Belum punya akun? Register
        </button>
      </div>
    </div>
  );
}
