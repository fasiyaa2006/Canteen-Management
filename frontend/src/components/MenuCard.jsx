import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Check, AlertCircle } from 'lucide-react';

export default function MenuCard({ item }) {
  const { addToCart, cart } = useCart();
  const cartItem = cart.find((c) => c.id === item.id);

  const handleAdd = () => {
    if (item.available) {
      addToCart(item);
    }
  };

  const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';

  return (
    <div className={`menu-card ${!item.available ? 'card-unavailable' : ''}`}>
      <div className="card-image-wrapper">
        <img
          src={item.imageUrl || defaultImg}
          alt={item.name}
          className="card-image"
          onError={(e) => {
            e.target.src = defaultImg;
          }}
        />
        <span className="card-category-badge">{item.category}</span>
        {!item.available && (
          <div className="sold-out-overlay">
            <AlertCircle size={16} /> Sold Out
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{item.name}</h3>
          <span className="card-price">${Number(item.price).toFixed(2)}</span>
        </div>

        <p className="card-description">{item.description || 'Freshly prepared at campus canteen.'}</p>

        <div className="card-footer">
          {item.available ? (
            <button
              onClick={handleAdd}
              className={`btn btn-primary btn-add-cart ${cartItem ? 'btn-in-cart' : ''}`}
            >
              {cartItem ? (
                <>
                  <Check size={16} /> Added ({cartItem.quantity})
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Cart
                </>
              )}
            </button>
          ) : (
            <button disabled className="btn btn-disabled">
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
