import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentMenu from './pages/StudentMenu';
import CartCheckout from './pages/CartCheckout';
import OrderTracking from './pages/OrderTracking';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Main Landing router that intelligently directs students, staff, and admin
function MainLanding() {
  const { user } = useAuth();
  if (!user) {
    return <StudentMenu />;
  }
  if (user.role === 'CANTEEN_STAFF') {
    return <Navigate to="/staff" replace />;
  }
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <StudentMenu />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<MainLanding />} />
                <Route
                  path="/cart"
                  element={
                    <RoleRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <CartCheckout />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RoleRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <OrderTracking />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <RoleRoute allowedRoles={['CANTEEN_STAFF', 'ADMIN']}>
                      <StaffDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/staff/menu"
                  element={
                    <RoleRoute allowedRoles={['CANTEEN_STAFF', 'ADMIN']}>
                      <StaffDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RoleRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </RoleRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
