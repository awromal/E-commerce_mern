import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product, onDelete }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // If product.image is invalid or not provided, use a placeholder
  const imageUrl = product.image && product.image.startsWith('http') 
    ? product.image 
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400';

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
          <span className="card-price">₹{product.price}</span>
          <div className="product-management">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Stock: {product.countInStock || 0}</span>
            {isAuthenticated && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
