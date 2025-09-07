import React, { useEffect, useState } from "react";
import API from "../api";
import BalanceChart from "../components/BalanceChart";

export default function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const demoUserId = "68bd3e283aa5dd5a5a3e8a97"; // replace with real user id from seed or auth

  useEffect(() => {
    // call backend forecast stub
    async function load() {
      try {
        const res = await API.post("/api/forecast/run", { userId: demoUserId, days: 30 });
        setForecast(res.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  if (!forecast) return <div>Loading forecast...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>SME Cashflow Forecast</h2>
      <p>Current balance: £{forecast.currentBalance.toFixed(2)}</p>
      {forecast.alertDates.length > 0 && <div style={{ color: "red" }}>⚠️ Alerts: negative balance on {forecast.alertDates.join(", ")}</div>}
      <BalanceChart data={forecast.dailyBalances} />
    </div>
  );
}
