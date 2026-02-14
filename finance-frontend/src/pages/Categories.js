import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(function () {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoading(true);
    setError('');
    API.get('/categories')
      .then(function (res) { setCategories(res.data); })
      .catch(function (err) {
        console.error(err);
        setError('Gagal mengambil data kategori.');
      })
      .finally(function () { setLoading(false); });
  }

  function addCategory() {
    if (!name.trim()) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    setError('');
    API.post('/categories', { name })
      .then(function () {
        setName('');
        fetchCategories();
      })
      .catch(function (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Gagal menambahkan kategori.');
      });
  }

  function deleteCategory(id) {
    setError('');
    API.delete('/categories/' + id)
      .then(fetchCategories)
      .catch(function (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Gagal menghapus kategori.');
      });
  }

  function startEdit(category) {
    setEditingCategory(category);
    setEditingName(category.name);
    setError('');
  }

  function cancelEdit() {
    setEditingCategory(null);
    setEditingName('');
    setError('');
  }

  function updateCategory() {
    if (!editingName.trim()) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    setError('');
    API.put('/categories/' + editingCategory.id, { name: editingName })
      .then(function () {
        setEditingCategory(null);
        setEditingName('');
        fetchCategories();
      })
      .catch(function (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Gagal mengubah kategori.');
      });
  }

  // ===== STYLE =====
  const containerStyle = {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    background: '#f4f6f9',
    minHeight: '100vh'
  };

  const cardStyle = {
    background: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
    maxWidth: '600px',
    margin: 'auto'
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flex: 1
  };

  const buttonPrimary = {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '10px'
  };

  const buttonWarning = {
    background: '#ffc107',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  const buttonDanger = {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const buttonSecondary = {
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '5px'
  };

  return React.createElement(
    'div',
    { style: containerStyle },

    React.createElement(
      'div',
      { style: cardStyle },

      React.createElement('h2', { style: { marginBottom: '20px' } }, 'Categories'),

      error &&
        React.createElement(
          'div',
          {
            style: {
              background: '#ffe6e6',
              color: '#cc0000',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px'
            }
          },
          error
        ),

      // Add new
      React.createElement(
        'div',
        { style: { marginBottom: '25px', display: 'flex', alignItems: 'center' } },
        React.createElement('input', {
          placeholder: 'New category',
          value: name,
          onChange: function (e) { setName(e.target.value); },
          style: inputStyle
        }),
        React.createElement('button', { onClick: addCategory, style: buttonPrimary }, 'Add')
      ),

      loading
        ? React.createElement('p', null, 'Loading...')
        : React.createElement(
            'div',
            null,
            categories.length === 0
              ? React.createElement('p', { style: { textAlign: 'center', color: '#777' } }, 'No categories found')
              : categories.map(function (c) {
                  return React.createElement(
                    'div',
                    {
                      key: c.id,
                      style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        borderBottom: '1px solid #eee'
                      }
                    },

                    editingCategory?.id === c.id
                      ? React.createElement(
                          React.Fragment,
                          null,
                          React.createElement('input', {
                            value: editingName,
                            onChange: function (e) { setEditingName(e.target.value); },
                            style: { ...inputStyle, marginRight: '10px' }
                          }),
                          React.createElement('div', null,
                            React.createElement('button', { onClick: updateCategory, style: buttonPrimary }, 'Save'),
                            React.createElement('button', { onClick: cancelEdit, style: buttonSecondary }, 'Cancel')
                          )
                        )
                      : React.createElement(
                          React.Fragment,
                          null,
                          React.createElement('span', { style: { fontWeight: '500' } }, c.name),
                          React.createElement(
                            'div',
                            null,
                            React.createElement('button', { onClick: function () { startEdit(c); }, style: buttonWarning }, 'Edit'),
                            React.createElement('button', { onClick: function () { deleteCategory(c.id); }, style: buttonDanger }, 'Delete')
                          )
                        )
                  );
                })
          )
    )
  );
}
