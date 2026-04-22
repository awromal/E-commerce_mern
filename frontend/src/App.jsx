import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductList from "./ProductList";
import CreateProduct from "./components/CreateProduct";
import UpdateProduct from "./components/UpdateProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import Cart from "./components/Cart";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function HomePage() {
  return (
    <>
      <Hero />
      <ProductList />
    </>
  );
}

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ flexGrow: 1, paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Admin routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><UpdateProduct /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />

          {/* User routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <footer style={{ backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
