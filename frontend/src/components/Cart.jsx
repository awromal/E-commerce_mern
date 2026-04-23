import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import API_URL from '../api';

function Cart() {
  const { userToken, isUserLoggedIn } = useUserAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCart(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (isUserLoggedIn) fetchCart();
    else setLoading(false);
  }, [isUserLoggedIn, fetchCart]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;
    try {
      const res = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (data.success) setCart({ items: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.items?.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0) || 0;

  if (!isUserLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h2 style={{ marginBottom: '1rem' }}>Your Cart</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Please log in to view and manage your cart.
        </p>
        <Link to="/user/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-secondary)' }}>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger-color)' }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Browse our products and add items to get started.
        </p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Cart <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 400 }}>({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span></h2>
        <button onClick={clearCart} className="btn" style={{ color: 'var(--danger-color)', border: '1px solid var(--danger-color)', backgroundColor: 'transparent', padding: '0.4rem 1rem' }}>
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cart.items.map((item) => {
          const product = item.productId;
          if (!product) return null;
          const imageUrl = product.image?.startsWith('http') ? product.image : `${product.image}`;
          return (
            <div key={item._id} className="card" style={{ flexDirection: 'row', alignItems: 'center', padding: '0', overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ width: '130px', minWidth: '130px', height: '130px', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Details */}
              <div style={{ flex: 1, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h3>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{product.category}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                    ₹{(product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', border: '1px solid var(--border-color)' }}>
                    <button onClick={() => updateQuantity(product._id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.3rem' }}>−</button>
                    <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(product._id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.3rem' }}>+</button>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>₹{product.price} each</span>
                  <button onClick={() => removeItem(product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', fontSize: '0.85rem' }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="card" style={{ marginTop: '2rem', flexDirection: 'column', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Subtotal</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Delivery</span>
          <span style={{ color: '#16a34a' }}>Free</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
          <span>Total</span>
          <span style={{ color: 'var(--primary-color)' }}>₹{total.toLocaleString()}</span>
        </div>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem' }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
