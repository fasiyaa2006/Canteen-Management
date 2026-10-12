import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Utensils, ShoppingCart, Clock, ChefHat, LayoutDashboard, LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchUser } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const demoUsers = [
    { id: 1, name: 'Alex Student', email: 'alex@campus.edu', role: 'STUDENT', phone: '9876543210' },
    { id: 2, name: 'Chef Mario', email: 'mario@canteen.com', role: 'CANTEEN_STAFF', phone: '9876543211' },
    { id: 3, name: 'Admin Sarah', email: 'admin@campus.edu', role: 'ADMIN', phone: '9876543212' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Utensils size={20} />
          </div>
          <div>
            <span className="brand-title">Campus Canteen</span>
            <span className="brand-subtitle">Pre-Order & Pickup</span>
          </div>
        </Link>

        {/* Navigation Links based on active role */}
        <nav className="nav-links">
          {user?.role === 'STUDENT' && (
            <>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <Utensils size={16} /> Menu
              </Link>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                <Clock size={16} /> My Orders
              </Link>
              <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}>
                <ShoppingCart size={16} />
                <span>Cart</span>
                {totalItemsCount > 0 && <span className="cart-badge">{totalItemsCount}</span>}
              </Link>
            </>
          )}

          {user?.role === 'CANTEEN_STAFF' && (
            <>
              <Link to="/staff" className={`nav-link ${isActive('/staff') ? 'active' : ''}`}>
                <ChefHat size={16} /> Kitchen Orders
              </Link>
              <Link to="/staff/menu" className={`nav-link ${isActive('/staff/menu') ? 'active' : ''}`}>
                <Utensils size={16} /> Menu Catalog
              </Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                <LayoutDashboard size={16} /> Operations Overview
              </Link>
              <Link to="/staff" className={`nav-link ${isActive('/staff') ? 'active' : ''}`}>
                <ChefHat size={16} /> Live Orders
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Demo Switcher */}
        <div className="nav-actions">
          {user ? (
            <div className="user-profile-widget">
              {/* Demo Quick Switcher Dropdown */}
              <div className="role-switcher">
                <span className="switcher-label">Demo Role:</span>
                <select
                  value={user.role}
                  onChange={(e) => {
                    const target = demoUsers.find((u) => u.role === e.target.value);
                    if (target) {
                      switchUser(target);
                      if (target.role === 'STUDENT') navigate('/');
                      else if (target.role === 'CANTEEN_STAFF') navigate('/staff');
                      else if (target.role === 'ADMIN') navigate('/admin');
                    }
                  }}
                  className="role-select"
                >
                  <option value="STUDENT">🎓 Student (Alex)</option>
                  <option value="CANTEEN_STAFF">👨‍🍳 Staff (Mario)</option>
                  <option value="ADMIN">🛡️ Admin (Sarah)</option>
                </select>
              </div>

              <div className="user-pill">
                <div className="user-avatar">
                  {user.role === 'ADMIN' ? (
                    <Shield size={14} />
                  ) : user.role === 'CANTEEN_STAFF' ? (
                    <ChefHat size={14} />
                  ) : (
                    <UserIcon size={14} />
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>

              <button onClick={handleLogout} title="Log Out" className="btn-logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
