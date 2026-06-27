import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Shield, Phone, Tag } from 'lucide-react';

export default function Login({ onLoginSuccess, initialRegister = false }) {
  const [isRegister, setIsRegister] = useState(initialRegister);

  useEffect(() => {
    setIsRegister(initialRegister);
  }, [initialRegister]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('FARMER'); // FARMER, BUYER, ADMIN, TRANSPORT, NGO, GOVERNMENT
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isRegister) {
      // Register logic
      try {
        const res = await fetch('http://localhost:8081/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, role, fullName, phoneNumber })
        });
        if (res.ok) {
          setMessage('Registration successful! Please login.');
          setIsRegister(false);
        } else {
          const errMsg = await res.text();
          setError(errMsg || 'Registration failed');
        }
      } catch (err) {
        setError('Connection to auth service failed.');
      }
    } else {
      // Login logic
      try {
        const res = await fetch('http://localhost:8081/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_role', data.role);
          localStorage.setItem('user_id', data.userId);
          localStorage.setItem('username', data.username);
          localStorage.setItem('full_name', data.fullName);
          onLoginSuccess(data);
        } else {
          setError('Invalid username or password');
        }
      } catch (err) {
        setError('Connection to auth service failed.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }} className="fade-in">
      <div className="glass-panel" style={{ width: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>GreenChain</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Create your platform account' : 'Sign in to access your digital agribusiness'}
          </p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'flex', width: '100%', marginBottom: '20px', padding: '10px 15px' }}>
            {error}
          </div>
        )}

        {message && (
          <div className="badge badge-success" style={{ display: 'flex', width: '100%', marginBottom: '20px', padding: '10px 15px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="glass-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px' }}
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px' }}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px' }}
                    placeholder="+94 77 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Platform Role</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                  <select
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px', appearance: 'none', background: 'rgba(255, 255, 255, 0.03)' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="FARMER" style={{ background: 'var(--bg-secondary)' }}>Farmer (Crop Producer)</option>
                    <option value="BUYER" style={{ background: 'var(--bg-secondary)' }}>Buyer (Supermarkets/Exporters)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-gradient-primary" style={{ padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '1rem', marginTop: '10px' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {isRegister ? 'Already have an account? ' : 'New to GreenChain? '}
          <span
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </span>
        </div>
      </div>
    </div>
  );
}
