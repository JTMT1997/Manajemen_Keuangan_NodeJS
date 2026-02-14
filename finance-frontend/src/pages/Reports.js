import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboard();
  }, [year]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get(`/transactions/dashboard?year=${year}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load Reports data");
    }
  };

  const formatCurrency = (value) => {
    return "Rp " + Number(value || 0).toLocaleString("id-ID");
  };

  // ===== STYLE =====
  const container = {
    padding: "30px",
    fontFamily: "Arial, sans-serif"
  };

  const card = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    marginBottom: "25px"
  };

  const summaryBox = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  };

  const summaryItem = (bgColor) => ({
    flex: "1",
    minWidth: "200px",
    background: bgColor,
    color: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold"
  });

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    padding: "10px",
    textAlign: "left",
    background: "#f8f9fa",
    borderBottom: "1px solid #ddd"
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee"
  };

  return (
    <div style={container}>
      <h2 style={{ marginBottom: "20px" }}>Reports {year}</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "120px"
          }}
        />
      </div>

      {summary && (
        <>
          {/* SUMMARY CARDS */}
          <div style={summaryBox}>
            <div style={summaryItem("#28a745")}>
              Total Income
              <div>{formatCurrency(summary.totalIncome)}</div>
            </div>

            <div style={summaryItem("#dc3545")}>
              Total Expense
              <div>{formatCurrency(summary.totalExpense)}</div>
            </div>

            <div style={summaryItem("#007bff")}>
              Balance
              <div>{formatCurrency(summary.balance)}</div>
            </div>
          </div>

          {/* MONTHLY INCOME TABLE */}
          <div style={card}>
            <h3 style={{ marginBottom: "15px" }}>Monthly Income</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Month</th>
                  <th style={thStyle}>Income</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.monthlyIncome || {}).map(
                  ([month, value]) => (
                    <tr key={month}>
                      <td style={tdStyle}>{month}</td>
                      <td style={{ ...tdStyle, color: "#28a745", fontWeight: "bold" }}>
                        {formatCurrency(value)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* MONTHLY EXPENSE TABLE */}
          <div style={card}>
            <h3 style={{ marginBottom: "15px" }}>Monthly Expense</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Month</th>
                  <th style={thStyle}>Expense</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.monthlyExpense || {}).map(
                  ([month, value]) => (
                    <tr key={month}>
                      <td style={tdStyle}>{month}</td>
                      <td style={{ ...tdStyle, color: "#dc3545", fontWeight: "bold" }}>
                        {formatCurrency(value)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
