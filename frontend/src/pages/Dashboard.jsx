import React, { useEffect, useState } from "react";
import API from "../api";
import BalanceChart from "../components/BalanceChart";
import Chatbot from "./Chatbot"; // import your chatbot
import "./Dashboard.css";

export default function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const demoUserId = "68bd6507118ecfd09f700f4c"; // replace with real user id

  useEffect(() => {
    async function load() {
      try {
        const res = await API.post("/api/forecast/run", {
          userId: demoUserId,
          days: 30,
        });
        setForecast(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!forecast) return <div className="loading">Loading forecast...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 SME Cashflow Dashboard</h1>
      </header>

      <main className="dashboard-content">
        <div className="balance-card">
          <h2>Current Balance</h2>
          <p className="balance-amount">
            £{forecast.currentBalance.toFixed(2)}
          </p>
        </div>

        {forecast.alertDates.length > 0 && (
          <div className="alert-card">
            ⚠️ Negative balance on {forecast.alertDates.join(", ")}
          </div>
        )}

        <div className="chart-section">
          <h3>30-Day Forecast</h3>
          <BalanceChart data={forecast.dailyBalances} />
        </div>
      </main>

      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button className="chat-toggle-btn" onClick={() => setChatOpen(true)}>
          💬 Chat
        </button>
      )}

      {/* Chatbot Panel */}
      <div className={`chatbot-panel ${chatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>AI Assistant</h3>
          <button className="close-btn" onClick={() => setChatOpen(false)}>
            ✖
          </button>
        </div>
        <Chatbot />
      </div>
    </div>
  );
}
