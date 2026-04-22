import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { adminToken } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    
    if (!imageFile) {
      setError("Please select an image file to upload.");
      setLoading(false);
      return;
    }

    try {
      // Use FormData to support multipart/form-data for file uploads
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("price", Number(formData.price));
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("countInStock", Number(formData.countInStock));
      submitData.append("image", imageFile);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        },
        body: submitData
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      // Automatically navigate back to the product list (showcase)
      navigate('/');
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="form-container" id="create">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add New Product</h2>
      
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
            <label className="form-label" htmlFor="countInStock">Initial Stock</label>
            <input type="number" id="countInStock" name="countInStock" className="form-control" value={formData.countInStock} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <input type="text" id="category" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="image">Upload Product Image</label>
          <input 
            type="file" 
            id="image" 
            name="image" 
            className="form-control" 
            onChange={handleFileChange} 
            accept="image/*" 
            ref={fileInputRef}
            required 
            style={{ padding: '0.5rem 1rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
