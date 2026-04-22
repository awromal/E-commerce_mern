import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { isUserLoggedIn, userInfo, logoutUser } = useUserAuth();

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>TechStore.</Link>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="nav-link">Home</Link>

          {/* User section */}
          {isUserLoggedIn ? (
            <>
              {/* Cart icon with no count badge (count requires separate fetch) */}
              <Link to="/cart" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                🛒 Cart
              </Link>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hi, {userInfo?.name?.split(' ')[0]}</span>
              <button onClick={logoutUser} className="btn" style={{ padding: '0.3rem 0.8rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/user/login" className="nav-link">Sign In</Link>
          )}

          {/* Admin section */}
          {isAuthenticated ? (
            <>
              <Link to="/create" className="nav-link" style={{ color: '#eab308' }}>Add Product</Link>
              <Link to="/register" className="nav-link" style={{ color: '#eab308' }}>Sub-Admin</Link>
              <button onClick={logout} className="btn" style={{ padding: '0.3rem 0.8rem', border: '1px solid #eab308', backgroundColor: 'transparent', color: '#eab308', fontSize: '0.85rem' }}>
                Admin Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link" style={{ opacity: 0.5, fontSize: '0.8rem' }}>Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
