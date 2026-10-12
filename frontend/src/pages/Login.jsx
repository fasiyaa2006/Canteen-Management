import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Lock, Mail, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      const res = await register({ name, email, password, phone, role });
      setLoading(false);
      if (res.success) {
        if (role === 'CANTEEN_STAFF') navigate('/staff');
        else if (role === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        setError(res.error);
      }
    } else {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        if (res.user.role === 'CANTEEN_STAFF') navigate('/staff');
        else if (res.user.role === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        setError(res.error);
      }
    }
  };

  const handleDemoLogin = (demoRole) => {
    const demoAccounts = {
      STUDENT: { id: 1, name: 'Alex Student', email: 'alex@campus.edu', role: 'STUDENT', phone: '9876543210' },
      CANTEEN_STAFF: { id: 2, name: 'Chef Mario', email: 'mario@canteen.com', role: 'CANTEEN_STAFF', phone: '9876543211' },
      ADMIN: { id: 3, name: 'Admin Sarah', email: 'admin@campus.edu', role: 'ADMIN', phone: '9876543212' },
    };
    const selected = demoAccounts[demoRole];
    switchUser(selected);
    if (demoRole === 'CANTEEN_STAFF') navigate('/staff');
    else if (demoRole === 'ADMIN') navigate('/admin');
    else navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <Utensils size={28} />
          </div>
          <h2>{isRegister ? 'Create Campus Account' : 'Welcome to Campus Canteen'}</h2>
          <p>{isRegister ? 'Register to start pre-ordering meals' : 'Sign in to order food and skip the long lines'}</p>
        </div>

        {/* Demo Fast-Login Strip */}
        <div className="demo-strip">
          <span className="demo-strip-title">⚡ 1-Click Demo Logins:</span>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={() => handleDemoLogin('STUDENT')}
              className="btn btn-outline btn-sm"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('CANTEEN_STAFF')}
              className="btn btn-outline btn-sm"
            >
              👨‍🍳 Canteen Staff
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="btn btn-outline btn-sm"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>User Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                  <option value="STUDENT">Student</option>
                  <option value="CANTEEN_STAFF">Canteen Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                required
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block btn-lg">
            {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle Register / Sign In */}
        <div className="auth-footer">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsRegister(false)} className="link-btn">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New student or staff member?{' '}
              <button type="button" onClick={() => setIsRegister(true)} className="link-btn">
                Create an Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
