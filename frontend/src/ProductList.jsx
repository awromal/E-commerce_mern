import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { useAuth } from "./context/AuthContext";
import API_URL from "./api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { adminToken } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data ? responseData.data : responseData;
      
      setProducts(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please ensure the backend server is running.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== id && p.id !== id));
        } else {
          alert('Failed to delete product.');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred during deletion.');
      }
    }
  };

  return (
    <div id="products" style={{ paddingTop: '2rem' }}>
      <h2 className="section-title">Our Products</h2>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <h2>Loading products...</h2>
          <p>Gathering the best tech for you.</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-lg)' }}>
          <h2>Internal Server Error</h2>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '1rem' }}>No products found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Click "Add Product" to create your first item.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
