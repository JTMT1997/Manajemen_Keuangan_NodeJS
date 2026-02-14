import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: {},
    monthlyExpense: {}
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchDashboard(year);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchDashboard(year);
    // eslint-disable-next-line
  }, [year]);

  const fetchDashboard = async (selectedYear) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const res = await API.get(`/transactions?year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;

      const monthlyIncome = {};
      const monthlyExpense = {};
      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach(item => {
        const itemDate = new Date(item.date);
        const itemYear = itemDate.getFullYear();
        if (itemYear !== parseInt(selectedYear)) return;

        const month = itemDate.toLocaleString('default', { month: 'short' });

        if (item.type === 'income') {
          monthlyIncome[month] = (monthlyIncome[month] || 0) + item.amount;
          totalIncome += item.amount;
        } else if (item.type === 'expense') {
          monthlyExpense[month] = (monthlyExpense[month] || 0) + item.amount;
          totalExpense += item.amount;
        }
      });

      const balance = totalIncome - totalExpense;

      setSummary({ totalIncome, totalExpense, balance, monthlyIncome, monthlyExpense });
      setLoading(false);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(summary.monthlyIncome),
    datasets: [
      {
        label: 'Income',
        data: Object.values(summary.monthlyIncome),
        backgroundColor: '#28a745',
        borderRadius: 6
      },
      {
        label: 'Expense',
        data: Object.values(summary.monthlyExpense),
        backgroundColor: '#dc3545',
        borderRadius: 6
      }
    ]
  };

  // ===== STYLE =====
  const container = {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    background: '#f4f6f9',
    minHeight: '100vh'
  };

  const card = {
    background: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
    marginBottom: '25px'
  };

  const summaryContainer = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '25px'
  };

  const summaryBox = (bg) => ({
    flex: '1',
    minWidth: '200px',
    background: bg,
    color: '#fff',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px'
  });

  return (
    <div style={container}>
      <h2 style={{ marginBottom: '20px' }}>Dashboard {year}</h2>

      <div style={{ marginBottom: '25px' }}>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            width: '120px'
          }}
        />
      </div>

      {/* SUMMARY CARDS */}
      <div style={summaryContainer}>
        <div style={summaryBox('#28a745')}>
          Total Income
          <div style={{ fontSize: '22px', marginTop: '5px' }}>
            {summary.totalIncome}
          </div>
        </div>

        <div style={summaryBox('#dc3545')}>
          Total Expense
          <div style={{ fontSize: '22px', marginTop: '5px' }}>
            {summary.totalExpense}
          </div>
        </div>

        <div style={summaryBox('#007bff')}>
          Balance
          <div style={{ fontSize: '22px', marginTop: '5px' }}>
            {summary.balance}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div style={card}>
        <h3 style={{ marginBottom: '20px' }}>
          Grafik Income & Expense /Month
        </h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
