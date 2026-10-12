import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuApi, API_BASE_URL } from '../api/client';
import { useCart } from '../context/CartContext';
import MenuCard from '../components/MenuCard';
import { Search, ShoppingBag, ArrowRight, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

export default function StudentMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const { cart, totalAmount, totalItemsCount } = useCart();

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await menuApi.getAll({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        availableOnly: availableOnly ? true : undefined,
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items', err);
      const msg = err.response?.data?.message || err.message || 'Unable to connect to the backend server.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, availableOnly]);

  const categories = ['All', 'Burgers', 'Meals', 'Snacks', 'Beverages'];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> Campus Food Pre-Order
          </div>
          <h1>Skip the Canteen Queues. Pre-Order Your Favorite Meal.</h1>
          <p>
            Choose your meal, select a pickup time that fits your class break, and pick it up hot & fresh!
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & In-stock toggle */}
        <div className="filter-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search dishes, drinks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <label className="checkbox-toggle">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>

          <button onClick={fetchMenu} className="btn btn-icon" title="Refresh Menu">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Menu Grid / Error / Loading States */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading fresh dishes...</p>
          <small style={{ color: '#94a3b8', marginTop: '0.35rem' }}>
            If the cloud server is waking up, this may take up to 45 seconds.
          </small>
        </div>
      ) : error ? (
        <div
          className="empty-state"
          style={{
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            maxWidth: '560px',
            margin: '2rem auto',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <AlertCircle size={40} color="#ea580c" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ marginBottom: '0.4rem', color: '#1e293b' }}>Server Connecting...</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Calling backend at: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{API_BASE_URL}</code>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            {error}
            <br />
            <em>On free cloud instances (Render), services sleep after inactivity and wake up on the first request.</em>
          </p>
          <button onClick={fetchMenu} className="btn btn-primary">
            <RefreshCw size={16} /> Retry Now
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>No menu items found matching your filters.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Floating Cart Bar (When Cart Has Items) */}
      {totalItemsCount > 0 && (
        <div className="floating-cart-bar">
          <div className="floating-cart-inner">
            <div className="floating-cart-info">
              <span className="cart-pill-count">{totalItemsCount} items</span>
              <span className="cart-pill-total">${totalAmount.toFixed(2)}</span>
            </div>
            <Link to="/cart" className="btn btn-accent btn-sm">
              View Cart & Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
