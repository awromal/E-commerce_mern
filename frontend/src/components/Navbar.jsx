import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>TechStore.</Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="nav-link">Home / Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="nav-link">Add Product</Link>
              <Link to="/register" className="nav-link">Gen Sub-Admin</Link>
              <button onClick={logout} className="btn" style={{ padding: '0.4rem 1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)' }}>Logout</button>
            </>
          ) : (
             <Link to="/login" className="nav-link">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
