import React, { useState } from 'react';
import UsageChart from '../components/UsageChart';
import './Dashboard.css';

function Dashboard({ user }) {
  const [readings, setReadings] = useState({ prevWater: '', currWater: '', prevElectricity: '', currElectricity: '' });
  const [submitted, setSubmitted] = useState(false);
  const [waterUsage, setWaterUsage] = useState(0);
  const [electricityUsage, setElectricityUsage] = useState(0);

  const handleChange = (e) => {
    setReadings({ ...readings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const water = readings.currWater - readings.prevWater;
    const electricity = readings.currElectricity - readings.prevElectricity;
    setWaterUsage(water);
    setElectricityUsage(electricity);
    if (water > 100) alert("⚠️ High Water Usage!");
    if (electricity > 200) alert("⚠️ High Electricity Usage!");
    setSubmitted(true);
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.username}</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <input type="number" name="prevWater" placeholder="Previous Water Reading" onChange={handleChange} required />
          <input type="number" name="currWater" placeholder="Current Water Reading" onChange={handleChange} required />
          <input type="number" name="prevElectricity" placeholder="Previous Electricity Reading" onChange={handleChange} required />
          <input type="number" name="currElectricity" placeholder="Current Electricity Reading" onChange={handleChange} required />
          <button type="submit">Submit Readings</button>
        </form>
      ) : (
        <>
          <p>Water Usage: {waterUsage} units</p>
          <p>Electricity Usage: {electricityUsage} units</p>
          <p>💧 Estimated Water Bill: ₹{waterUsage * 5}</p>
          <p>⚡ Estimated Electricity Bill: ₹{electricityUsage * 7}</p>
          <UsageChart water={waterUsage} electricity={electricityUsage} />
        </>
      )}
    </div>
  );
}

export default Dashboard;