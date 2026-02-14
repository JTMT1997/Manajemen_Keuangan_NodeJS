import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', { username, password });
      alert('Register sukses! Silakan login.');
      navigate('/login'); // otomatis ke login setelah berhasil
    } catch (err) {
      alert(err.response?.data?.error || 'Register gagal');
    }
  };

  // ======= CSS Internal =======
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
      backgroundColor: '#28a745',
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
        <h2 style={styles.title}>Register</h2>

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

        {/* Tombol Register */}
        <button
          style={styles.buttonPrimary}
          onClick={handleRegister}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#218838')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#28a745')}
        >
          Register
        </button>

        {/* Tombol Login */}
        <button
          style={styles.buttonSecondary}
          onClick={() => navigate('/login')}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#007bff';
          }}
        >
          Sudah punya akun? Login
        </button>
      </div>
    </div>
  );
}
