import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { adminToken } = useAuth(); // We need the existing token to authorize registration

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '400px', marginTop: '5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Generate Sub-Admin</h2>
      
      {error && (
        <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: '#16a34a', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(22, 163, 74, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          Successfully generated sub-admin! Returning...
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">New Admin Username</label>
          <input 
            type="text" 
            id="username" 
            className="form-control" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="password">New Admin Password</label>
          <input 
            type="password" 
            id="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading || success}>
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default Register;
