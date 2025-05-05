import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function UsageChart({ water, electricity }) {
  const data = [
    { name: 'Water', usage: water },
    { name: 'Electricity', usage: electricity }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="usage" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default UsageChart;