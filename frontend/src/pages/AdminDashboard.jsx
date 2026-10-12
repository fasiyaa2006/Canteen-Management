import React, { useState, useEffect } from 'react';
import { adminApi, authApi } from '../api/client';
import { LayoutDashboard, DollarSign, ShoppingCart, Users, Utensils, Shield, User, ChefHat, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        authApi.getAllUsers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page-container">
      <div className="admin-header">
        <div>
          <h2>System Operations & Admin Overview</h2>
          <p>Overall canteen revenue, order fulfillment pipeline, and registered campus users.</p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-sm">
          <RefreshCw size={15} /> Refresh Analytics
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Metrics Overview Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper revenue">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Canteen Revenue</span>
                <span className="stat-val">
                  ${stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(2) : '0.00'}
                </span>
                <span className="stat-sub">From all placed & collected orders</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper orders">
                <ShoppingCart size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Orders Placed</span>
                <span className="stat-val">{stats?.totalOrders || 0}</span>
                <span className="stat-sub">Across all campus departments</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper dishes">
                <Utensils size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Menu Items Catalog</span>
                <span className="stat-val">{stats?.totalMenuItems || 0}</span>
                <span className="stat-sub">{stats?.availableMenuItems || 0} currently in stock</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper users">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Campus Accounts</span>
                <span className="stat-val">{stats?.totalUsers || 0}</span>
                <span className="stat-sub">
                  {stats?.totalStudents || 0} Students, {stats?.totalStaff || 0} Staff
                </span>
              </div>
            </div>
          </div>

          {/* Kitchen Pipeline Breakdown */}
          <div className="pipeline-card">
            <h3>Kitchen Fulfillment Pipeline</h3>
            <div className="pipeline-grid">
              <div className="pipeline-item placed">
                <span className="p-num">{stats?.placedOrders || 0}</span>
                <span className="p-label">Placed (In Queue)</span>
              </div>
              <div className="pipeline-item preparing">
                <span className="p-num">{stats?.preparingOrders || 0}</span>
                <span className="p-label">Cooking in Kitchen</span>
              </div>
              <div className="pipeline-item ready">
                <span className="p-num">{stats?.readyOrders || 0}</span>
                <span className="p-label">Ready at Pickup Counter</span>
              </div>
              <div className="pipeline-item collected">
                <span className="p-num">{stats?.collectedOrders || 0}</span>
                <span className="p-label">Collected by Students</span>
              </div>
            </div>
          </div>

          {/* Registered Users Table */}
          <div className="users-card">
            <h3>Registered Campus Users</h3>
            <div className="mgmt-table-wrapper">
              <table className="mgmt-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${u.role?.toLowerCase()}`}>
                          {u.role === 'ADMIN' && <Shield size={12} />}
                          {u.role === 'CANTEEN_STAFF' && <ChefHat size={12} />}
                          {u.role === 'STUDENT' && <User size={12} />}
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
