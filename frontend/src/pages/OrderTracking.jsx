import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { RefreshCw, Clock, MapPin, CheckCircle, ChefHat, PackageCheck, AlertCircle, Calendar } from 'lucide-react';

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await orderApi.getUserOrders(user.id);
      setOrders(res.data);
      if (res.data.length > 0 && !selectedOrder) {
        setSelectedOrder(res.data[0]);
      } else if (res.data.length > 0 && selectedOrder) {
        // Keep selected order updated with latest status
        const updated = res.data.find((o) => o.id === selectedOrder.id) || res.data[0];
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to fetch user orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-poll status every 10 seconds for real-time updates
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received & queued in kitchen', icon: Clock },
    { key: 'PREPARING', label: 'Preparing', desc: 'Chef is cooking your meal', icon: ChefHat },
    { key: 'READY', label: 'Ready for Pickup', desc: 'Waiting at express pickup desk', icon: PackageCheck },
    { key: 'COLLECTED', label: 'Collected', desc: 'Completed & enjoyed', icon: CheckCircle },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex((s) => s.key === status);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString();
  };

  return (
    <div className="page-container tracking-page">
      <div className="tracking-header">
        <div>
          <h2>My Orders & Live Pickup Tracker</h2>
          <p>Real-time status updates from the campus canteen kitchen.</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline btn-sm">
          <RefreshCw size={15} /> Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any food pre-orders yet.</p>
        </div>
      ) : (
        <div className="tracking-layout">
          {/* Main Visual Tracker for Selected Order */}
          {selectedOrder && (
            <div className="active-tracker-card">
              <div className="tracker-top">
                <div>
                  <span className="order-number-tag">Order #{selectedOrder.id}</span>
                  <h3 className="tracker-title">Estimated Pickup: {formatDateTime(selectedOrder.pickupTime)}</h3>
                </div>
                <StatusBadge status={selectedOrder.orderStatus} />
              </div>

              {/* Real-time Stepper Bar */}
              <div className="stepper-container">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedOrder.orderStatus);
                  const isPassed = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`stepper-step ${isPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                    >
                      <div className="step-node">
                        <Icon size={18} />
                      </div>
                      <div className="step-info">
                        <span className="step-label">{step.label}</span>
                        <span className="step-desc">{step.desc}</span>
                      </div>
                      {idx < steps.length - 1 && <div className="step-connector" />}
                    </div>
                  );
                })}
              </div>

              {/* Instructions banner if any */}
              {selectedOrder.specialInstructions && (
                <div className="special-instructions-note">
                  <strong>Notes for kitchen:</strong> "{selectedOrder.specialInstructions}"
                </div>
              )}

              {/* Itemized Order Breakdown */}
              <div className="order-breakdown">
                <h4>Order Summary ({selectedOrder.items?.length} items)</h4>
                <div className="breakdown-items-list">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="breakdown-item-row">
                      <span>
                        <strong>{item.quantity}x</strong> {item.menuItemName}
                      </span>
                      <span>${Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="breakdown-total-row">
                    <span>Total Amount:</span>
                    <span>${Number(selectedOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Sidebar */}
          <div className="orders-history-sidebar">
            <h3>Recent Orders</h3>
            <div className="history-list">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`history-card ${selectedOrder?.id === ord.id ? 'active' : ''}`}
                >
                  <div className="history-card-top">
                    <span className="history-order-id">Order #{ord.id}</span>
                    <StatusBadge status={ord.orderStatus} />
                  </div>
                  <div className="history-card-details">
                    <span>
                      <Calendar size={13} /> {formatDateTime(ord.createdAt)}
                    </span>
                    <span className="history-price">${Number(ord.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
