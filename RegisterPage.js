import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registered Successfully!");
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <button type="submit">Register</button>
        <p onClick={() => navigate('/')}>Already have an account? Login</p>
      </form>
    </div>
  );
}

export default RegisterPage;