import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../api';

function UpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const { adminToken } = useAuth();
  
  // Try to use product from router state, otherwise you would want to fetch it from backend if user navigated directly.
  const productData = location.state?.product || {};

  const [formData, setFormData] = useState({
    name: productData.name || '',
    price: productData.price || '',
    description: productData.description || '',
    category: productData.category || '',
    countInStock: productData.countInStock || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback fetch if there's no state provided (direct URL visit)
  useEffect(() => {
    if (!productData._id) {
       // Since the backend GET / route fetches all products, and we don't have a GET /:id route, 
       // returning to homepage is the simplest fallback.
       navigate('/');
    }
  }, [productData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", Number(formData.price));
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("countInStock", Number(formData.countInStock));
      
      // Only append the image if they chose a new one to upload
      if (imageFile) {
        submitData.append("image", imageFile);
      } else {
         // Pass the old string back purely to fulfill required schema validations conditionally if they didn't upload a new image
         if (productData.image) {
            submitData.append("image", productData.image); 
         }
      }

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        },
        body: submitData
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      // Navigate back to showcase
      navigate('/');
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="form-container" id="update">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Update Product Details</h2>
      
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Product Name</label>
          <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="price">Price (₹)</label>
            <input type="number" id="price" name="price" className="form-control" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="countInStock">Inventory Stock</label>
            <input type="number" id="countInStock" name="countInStock" className="form-control" value={formData.countInStock} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <input type="text" id="category" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="image">Upload New Image (Optional)</label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            className="form-control" 
            onChange={handleFileChange} 
            accept="image/*" 
            ref={fileInputRef}
            style={{ padding: '0.5rem 1rem' }}
          />
          <small style={{ color: 'var(--text-secondary)' }}>Leave blank to keep the current image.</small>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#eab308' }} disabled={loading}>
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
