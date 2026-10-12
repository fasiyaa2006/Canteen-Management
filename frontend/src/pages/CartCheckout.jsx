import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/client';
import { Trash2, Plus, Minus, Clock, ShoppingBag, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CartCheckout() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to format ISO string for pickup time
  const getDefaultPickupTime = (minutesAhead = 30) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + minutesAhead);
    // Format YYYY-MM-DDTHH:mm
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [pickupTime, setPickupTime] = useState(getDefaultPickupTime(30));
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePresetTime = (mins) => {
    setPickupTime(getDefaultPickupTime(mins));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        userId: user.id,
        pickupTime: pickupTime,
        specialInstructions: specialInstructions.trim(),
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await orderApi.create(payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-cart-card">
          <ShoppingBag size={48} className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Explore the canteen menu and pre-order your favorite meal now.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container checkout-container">
      <div className="checkout-header">
        <Link to="/" className="link-back">
          <ArrowLeft size={18} /> Continue Ordering
        </Link>
        <h2>Your Pre-Order Cart ({cart.length} unique items)</h2>
      </div>

      {error && (
        <div className="auth-error-banner">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="checkout-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-card">
          <h3>Order Items</h3>
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'}
                  alt={item.name}
                  className="cart-item-thumb"
                />

                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <span className="cart-item-unit-price">${Number(item.price).toFixed(2)} each</span>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="qty-btn"
                    title="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="qty-btn"
                    title="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="cart-item-subtotal">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn-trash"
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pickup Time, Instructions & Summary */}
        <div className="checkout-sidebar">
          {/* Pickup Time Selection */}
          <div className="checkout-card">
            <div className="card-heading-icon">
              <Clock size={18} />
              <h3>Select Pickup Time</h3>
            </div>
            <p className="card-subtext">When will you arrive at the counter?</p>

            <div className="preset-times">
              <button type="button" onClick={() => handlePresetTime(15)} className="preset-pill">
                +15 mins
              </button>
              <button type="button" onClick={() => handlePresetTime(30)} className="preset-pill active">
                +30 mins
              </button>
              <button type="button" onClick={() => handlePresetTime(45)} className="preset-pill">
                +45 mins
              </button>
              <button type="button" onClick={() => handlePresetTime(60)} className="preset-pill">
                +1 hour
              </button>
            </div>

            <div className="form-group mt-3">
              <label>Custom Date & Time</label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="datetime-input"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="checkout-card">
            <h3>Special Instructions (Optional)</h3>
            <textarea
              rows={3}
              placeholder="e.g. Extra napkins, less spicy, pack takeaway..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="instructions-textarea"
            />
          </div>

          {/* Payment & Total Summary */}
          <div className="checkout-card summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Canteen Pre-Order Fee:</span>
              <span className="free-text">$0.00 (Free)</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Payable at Pickup:</span>
              <span className="total-number">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary btn-block btn-lg mt-4"
            >
              {loading ? (
                'Placing Order...'
              ) : (
                <>
                  <CheckCircle2 size={18} /> Confirm Pre-Order (${totalAmount.toFixed(2)})
                </>
              )}
            </button>
            <p className="summary-footnote">
              Pay upon pickup at the canteen express pre-order counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
