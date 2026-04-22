import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserAuth } from '../context/UserAuthContext';

function ProductCard({ product, onDelete }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isUserLoggedIn, userToken } = useUserAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState(null);

  // Resolve image URL — supports both absolute and relative paths
  const imageUrl = product.image && product.image.startsWith('http')
    ? product.image
    : product.image
      ? product.image
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400';

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartMsg(null);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      setCartMsg('✓ Added!');
      setTimeout(() => setCartMsg(null), 2500);
    } catch (err) {
      // Show real error so user can diagnose the issue
      setCartMsg(`✗ ${err.message}`);
      setTimeout(() => setCartMsg(null), 5000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="card">
      <div className="card-image-wrap">
        <img src={imageUrl} alt={product.name} className="card-image" />
      </div>
      <div className="card-content">
        <span className="card-category">{product.category || 'General'}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="card-footer">
          <span className="card-price">₹{product.price?.toLocaleString()}</span>
          <div className="product-management">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock: {product.countInStock || 0}</span>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {/* Add to Cart — visible only when user is logged in */}
              {isUserLoggedIn && (
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', minWidth: '90px' }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {cartMsg || (addingToCart ? '...' : '🛒 Add')}
                </button>
              )}

              {/* Admin controls */}
              {isAuthenticated && (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#eab308', borderColor: '#eab308' }}
                    onClick={() => navigate(`/edit/${product._id || product.id}`, { state: { product } })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
