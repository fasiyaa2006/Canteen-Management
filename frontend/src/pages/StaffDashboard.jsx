import React, { useState, useEffect } from 'react';
import { orderApi, menuApi } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { ChefHat, Utensils, RefreshCw, CheckCircle, Clock, PackageCheck, Plus, Edit2, Trash2, Power, AlertCircle, Phone, User } from 'lucide-react';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State for Menu Item Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('Meals');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.getAll({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await menuApi.getAll();
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchMenuItems()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-poll orders for kitchen board every 8s
    const timer = setInterval(fetchOrders, 8000);
    return () => clearInterval(timer);
  }, [statusFilter]);

  // Status transitions
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Availability toggle
  const handleToggleAvailability = async (itemId) => {
    try {
      await menuApi.toggleAvailability(itemId);
      fetchMenuItems();
    } catch (err) {
      alert('Failed to toggle item availability');
    }
  };

  // Open modal for add
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormCategory('Meals');
    setFormPrice('');
    setFormImage('');
    setFormAvailable(true);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormImage(item.imageUrl || '');
    setFormAvailable(item.available);
    setIsModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    const payload = {
      name: formName,
      description: formDesc,
      category: formCategory,
      price: parseFloat(formPrice),
      imageUrl: formImage,
      available: formAvailable,
    };

    try {
      if (editingItem) {
        await menuApi.update(editingItem.id, payload);
      } else {
        await menuApi.create(payload);
      }
      setIsModalOpen(false);
      fetchMenuItems();
    } catch (err) {
      alert('Failed to save menu item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuApi.delete(itemId);
        fetchMenuItems();
      } catch (err) {
        alert('Failed to delete menu item');
      }
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page-container">
      {/* Dashboard Top Header */}
      <div className="staff-header">
        <div>
          <h2>Canteen Staff Control Center</h2>
          <p>Kitchen order fulfillment board and menu inventory management.</p>
        </div>

        {/* Tab switchers */}
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn-tab ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <ChefHat size={16} /> Kitchen Order Board ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`btn-tab ${activeTab === 'menu' ? 'active' : ''}`}
          >
            <Utensils size={16} /> Menu & Availability ({menuItems.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Kitchen Orders */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          {/* Status filter bar */}
          <div className="kitchen-filter-bar">
            <div className="filter-group">
              {['ALL', 'PLACED', 'PREPARING', 'READY', 'COLLECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`status-filter-btn ${statusFilter === st ? 'active' : ''}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button onClick={fetchOrders} className="btn btn-outline btn-sm">
              <RefreshCw size={14} /> Refresh Board
            </button>
          </div>

          {/* Orders Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading incoming orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders in the current queue.</p>
            </div>
          ) : (
            <div className="kitchen-grid">
              {orders.map((ord) => (
                <div key={ord.id} className="kitchen-order-card">
                  <div className="k-card-header">
                    <div>
                      <span className="k-order-num">#{ord.id}</span>
                      <span className="k-pickup-time">
                        <Clock size={14} /> Pickup: {formatTime(ord.pickupTime)}
                      </span>
                    </div>
                    <StatusBadge status={ord.orderStatus} />
                  </div>

                  <div className="k-student-info">
                    <span className="student-name">
                      <User size={14} /> {ord.user?.name}
                    </span>
                    {ord.user?.phone && (
                      <span className="student-phone">
                        <Phone size={14} /> {ord.user?.phone}
                      </span>
                    )}
                  </div>

                  {ord.specialInstructions && (
                    <div className="k-instructions">
                      <strong>Note:</strong> {ord.specialInstructions}
                    </div>
                  )}

                  <div className="k-items-box">
                    <h5>Items ({ord.items?.length}):</h5>
                    <ul className="k-item-list">
                      {ord.items?.map((it) => (
                        <li key={it.id}>
                          <span className="k-qty">{it.quantity}x</span>
                          <span className="k-name">{it.menuItemName}</span>
                          <span className="k-item-price">${Number(it.subtotal).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="k-total-row">
                      <span>Total Amount:</span>
                      <strong>${Number(ord.totalAmount).toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Action advancement buttons */}
                  <div className="k-actions">
                    {ord.orderStatus === 'PLACED' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'PREPARING')}
                        className="btn btn-warning btn-block"
                      >
                        <ChefHat size={16} /> Accept & Start Preparing
                      </button>
                    )}

                    {ord.orderStatus === 'PREPARING' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'READY')}
                        className="btn btn-success btn-block"
                      >
                        <PackageCheck size={16} /> Mark Ready for Pickup
                      </button>
                    )}

                    {ord.orderStatus === 'READY' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'COLLECTED')}
                        className="btn btn-secondary btn-block"
                      >
                        <CheckCircle size={16} /> Mark Handed Over / Collected
                      </button>
                    )}

                    {ord.orderStatus === 'COLLECTED' && (
                      <div className="collected-check">
                        <CheckCircle size={16} /> Order Completed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Menu Catalog & Availability */}
      {activeTab === 'menu' && (
        <div className="menu-management-section">
          <div className="menu-mgmt-header">
            <h3>Menu Items & Stock Control</h3>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={16} /> Add New Dish
            </button>
          </div>

          <div className="mgmt-table-wrapper">
            <table className="mgmt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Quick Action</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className={!item.available ? 'tr-disabled' : ''}>
                    <td className="item-cell">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80'}
                        alt={item.name}
                        className="item-thumb"
                      />
                      <div>
                        <strong>{item.name}</strong>
                        <p className="item-sub-desc">{item.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{item.category}</span>
                    </td>
                    <td>
                      <strong>${Number(item.price).toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`stock-status ${item.available ? 'in-stock' : 'out-of-stock'}`}>
                        {item.available ? '● In Stock' : '○ Sold Out'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`btn-toggle-stock ${item.available ? 'btn-mark-soldout' : 'btn-mark-instock'}`}
                        title="Toggle availability"
                      >
                        <Power size={14} />
                        {item.available ? 'Set Sold Out' : 'Set In Stock'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="btn-icon-action"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn-icon-action btn-delete"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit Item */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <form onSubmit={handleSaveMenuItem} className="modal-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Crispy Paneer Wrap"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="form-select"
              >
                <option value="Burgers">Burgers</option>
                <option value="Meals">Meals</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="4.50"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={2}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Fresh ingredients, toppings..."
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="checkbox-toggle">
              <input
                type="checkbox"
                checked={formAvailable}
                onChange={(e) => setFormAvailable(e.target.checked)}
              />
              <span>Available for order immediately</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
