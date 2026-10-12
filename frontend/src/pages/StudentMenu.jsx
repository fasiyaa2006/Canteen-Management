import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuApi } from '../api/client';
import { useCart } from '../context/CartContext';
import MenuCard from '../components/MenuCard';
import { Search, ShoppingBag, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export default function StudentMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const { cart, totalAmount, totalItemsCount } = useCart();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await menuApi.getAll({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        availableOnly: availableOnly ? true : undefined,
      });
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items', err);
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

      {/* Menu Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading fresh dishes...</p>
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
