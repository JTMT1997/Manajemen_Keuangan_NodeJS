import React, { useEffect, useState } from 'react';
import API from '../api/api';
import moment from 'moment';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [form, setForm] = useState({
    id: null,
    type: '',
    amount: '',
    description: '',
    date: '',
    categoryId: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [page, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      let url = `/transactions/filter?page=${page}&limit=${limit}`;
      if (startDate && endDate)
        url += `&startDate=${startDate}&endDate=${endDate}`;
      const res = await API.get(url);
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch transactions");
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get('/transactions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to export Excel");
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'type') {
      setErrors(prev => ({
        ...prev,
        type: !['income','expense'].includes(value) && value !== '' 
          ? 'Type must be income or expense' 
          : ''
      }));
    }

    if (name === 'amount') {
      setErrors(prev => ({
        ...prev,
        amount: value === '' || isNaN(value)
          ? 'Amount must be a number'
          : ''
      }));
    }
  };

  const handleCreateOrUpdate = async () => {
    const { id, type, amount, description, date, categoryId } = form;

    const newErrors = {};
    if (!type || !['income','expense'].includes(type))
      newErrors.type = 'Type must be income or expense';
    if (!amount || isNaN(amount))
      newErrors.amount = 'Amount is required and must be number';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const payload = {
        type,
        amount: Number(amount),
        description: description || null,
        date,
        categoryId: categoryId ? Number(categoryId) : null
      };

      if (isEditing) {
        await API.put(`/transactions/${id}`, payload);
        alert('Transaction updated!');
      } else {
        await API.post('/transactions', payload);
        alert('Transaction added!');
      }

      setForm({ id:null, type:'', amount:'', description:'', date:'', categoryId:'' });
      setIsEditing(false);
      setErrors({});
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save transaction");
    }
  };

  const handleEdit = (t) => {
    setForm({
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description || '',
      date: moment(t.date).format('YYYY-MM-DD'),
      categoryId: t.categoryId || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const totalPages = Math.ceil(total / limit);

  // ===== STYLE =====
  const card = {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
    marginBottom: '25px'
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    marginBottom: '10px'
  };

  const buttonPrimary = {
    padding: '8px 15px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  const buttonDanger = {
    padding: '5px 10px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const buttonWarning = {
    padding: '5px 10px',
    background: '#ffc107',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Transactions</h2>

      {/* Filter */}
      <div style={card}>
        <input type="date" value={startDate}
          onChange={e=>setStartDate(e.target.value)} style={inputStyle} />
        <input type="date" value={endDate}
          onChange={e=>setEndDate(e.target.value)} style={inputStyle} />
        <button style={buttonPrimary}
          onClick={()=>{setPage(1); fetchTransactions();}}>
          Filter
        </button>
        <button style={{...buttonPrimary, background:'#28a745'}}
          onClick={handleExport}>
          Export Excel
        </button>
      </div>

      {/* Form */}
      <div style={card}>
        <h3>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h3>

        <select name="type" value={form.type}
          onChange={handleFormChange} style={inputStyle}>
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <div style={{color:'red'}}>{errors.type}</div>}

        <input name="amount" placeholder="Amount"
          value={form.amount} onChange={handleFormChange}
          style={inputStyle} />
        {errors.amount && <div style={{color:'red'}}>{errors.amount}</div>}

        <input name="description" placeholder="Description"
          value={form.description} onChange={handleFormChange}
          style={inputStyle} />

        <input type="date" name="date"
          value={form.date} onChange={handleFormChange}
          style={inputStyle} />

        <input name="categoryId" placeholder="Category ID"
          value={form.categoryId} onChange={handleFormChange}
          style={inputStyle} />

        <div>
          <button style={buttonPrimary} onClick={handleCreateOrUpdate}>
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={card}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8f9fa' }}>
              <th>ID</th><th>Type</th><th>Amount</th>
              <th>Description</th><th>Date</th>
              <th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign:'center', padding:'20px'}}>
                  No transactions found
                </td>
              </tr>
            ) : transactions.map(t=>(
              <tr key={t.id} style={{borderTop:'1px solid #eee'}}>
                <td>{t.id}</td>
                <td>{t.type}</td>
                <td>Rp {t.amount}</td>
                <td>{t.description || '-'}</td>
                <td>{moment(t.date).format('YYYY-MM-DD')}</td>
                <td>{t.categoryId || '-'}</td>
                <td>
                  <button style={buttonWarning}
                    onClick={()=>handleEdit(t)}>Edit</button>
                  <button style={buttonDanger}
                    onClick={()=>handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ textAlign:'center' }}>
        <button disabled={page<=1}
          onClick={()=>setPage(page-1)} style={inputStyle}>
          Prev
        </button>
        Page {page} of {totalPages}
        <button disabled={page>=totalPages}
          onClick={()=>setPage(page+1)} style={inputStyle}>
          Next
        </button>
      </div>
    </div>
  );
}
