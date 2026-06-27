import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Bell, TrendingUp, Settings, Package, ShoppingCart, 
  MapPin, PlusCircle, BookOpen, AlertTriangle, Truck, UserCheck, 
  LogOut, ClipboardList, RefreshCw
} from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [prices, setPrices] = useState([]);

  // Tagline rotating state
  const taglines = ["Sri Lankan agriculture", "Better Harvests", "Fair market prices"];
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isTaglineVisible, setIsTaglineVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTaglineVisible(false);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
        setIsTaglineVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const [weather, setWeather] = useState(null);
  const [weatherCity, setWeatherCity] = useState('Colombo');
  const [notifications, setNotifications] = useState([]);
  
  // Farmer Specific States
  const [farmProfile, setFarmProfile] = useState({ farmName: '', farmLocation: '', farmSize: 0, primaryCrop: '', contactNumber: '' });
  const [cropName, setCropName] = useState('');
  const [cropCategory, setCropCategory] = useState('Beverages');
  const [cropQty, setCropQty] = useState('');
  const [cropPrice, setCropPrice] = useState('');
  const [cropDesc, setCropDesc] = useState('');
  const [myListings, setMyListings] = useState([]);
  const [diseaseAlerts, setDiseaseAlerts] = useState([]);
  const [subsidies, setSubsidies] = useState([]);
  const [grants, setGrants] = useState([]);
  const [ngoTrainings, setNgoTrainings] = useState([]);
  const [ngoAdvisories, setNgoAdvisories] = useState([]);

  // Buyer Specific States
  const [buyerProfile, setBuyerProfile] = useState({ companyName: '', businessLicense: '', shippingAddress: '', contactNumber: '' });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackingDetails, setTrackingDetails] = useState({});

  // Loading/Message states
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSharedData();
    if (user.role === 'FARMER') {
      fetchFarmerData();
    } else if (user.role === 'BUYER') {
      fetchBuyerData();
    }
  }, [activeTab]);

  const fetchSharedData = async () => {
    try {
      // Fetch crop prices
      const priceRes = await fetch('http://localhost:8086/api/prices');
      if (priceRes.ok) setPrices(await priceRes.json());

      // Fetch notifications
      const notifyRes = await fetch(`http://localhost:8089/api/notifications/user/${user.userId}`);
      if (notifyRes.ok) setNotifications(await notifyRes.json());

      // Fetch Weather
      fetchWeather(weatherCity);
    } catch (err) {
      console.error('Shared API fetch error', err);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const weatherRes = await fetch(`http://localhost:8090/api/weather/${city}`);
      if (weatherRes.ok) setWeather(await weatherRes.json());
    } catch (err) {
      console.error('Weather service down');
    }
  };

  const fetchFarmerData = async () => {
    try {
      // Get Profile
      const profileRes = await fetch(`http://localhost:8082/api/farmers/${user.userId}`);
      if (profileRes.ok) setFarmProfile(await profileRes.json());

      // Get Listings
      const listingRes = await fetch(`http://localhost:8084/api/marketplace/products/farmer/${user.userId}`);
      if (listingRes.ok) setMyListings(await listingRes.json());

      // Get Government Alerts, Subsidies & Grants
      const alertsRes = await fetch('http://localhost:8091/api/alerts');
      if (alertsRes.ok) setDiseaseAlerts(await alertsRes.json());

      const subsidiesRes = await fetch('http://localhost:8091/api/subsidies');
      if (subsidiesRes.ok) setSubsidies(await subsidiesRes.json());

      const grantsRes = await fetch('http://localhost:8091/api/grants');
      if (grantsRes.ok) setGrants(await grantsRes.json());

      // Get NGO Trainings & Advisories
      const ngoTrainRes = await fetch('http://localhost:8092/api/training');
      if (ngoTrainRes.ok) setNgoTrainings(await ngoTrainRes.json());

      const ngoAdvRes = await fetch('http://localhost:8092/api/advisories');
      if (ngoAdvRes.ok) setNgoAdvisories(await ngoAdvRes.json());

    } catch (err) {
      console.error('Farmer API fetch error', err);
    }
  };

  const fetchBuyerData = async () => {
    try {
      // Get Profile
      const profileRes = await fetch(`http://localhost:8083/api/buyers/${user.userId}`);
      if (profileRes.ok) setBuyerProfile(await profileRes.json());

      // Get Available Products
      const productsRes = await fetch('http://localhost:8084/api/marketplace/products?status=AVAILABLE');
      if (productsRes.ok) setAvailableProducts(await productsRes.json());

      // Get Orders
      const ordersRes = await fetch(`http://localhost:8085/api/orders/buyer/${user.userId}`);
      if (ordersRes.ok) setMyOrders(await ordersRes.json());
    } catch (err) {
      console.error('Buyer API fetch error', err);
    }
  };

  // Profile submission handlers
  const saveFarmerProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8082/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...farmProfile, userId: user.userId })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Farm profile saved successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to farmer service' });
    }
  };

  const saveBuyerProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8083/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buyerProfile, userId: user.userId })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Buyer profile saved successfully!' });
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to buyer service' });
    }
  };

  // Farmer listing crop
  const listCrop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8084/api/marketplace/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user.userId,
          farmerName: user.fullName || user.username,
          cropName,
          category: cropCategory,
          quantity: parseFloat(cropQty),
          pricePerKg: parseFloat(cropPrice),
          description: cropDesc
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Crop listing published successfully!' });
        setCropName('');
        setCropQty('');
        setCropPrice('');
        setCropDesc('');
        fetchFarmerData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to list product' });
    }
  };

  // Register for NGO Training
  const registerTraining = async (id) => {
    try {
      const res = await fetch(`http://localhost:8092/api/training/${id}/register`, {
        method: 'POST'
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Registered for training workshop successfully!' });
        fetchFarmerData();
      } else {
        const body = await res.json();
        setStatusMsg({ type: 'danger', text: body.error || 'Failed to register' });
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'NGO Service offline' });
    }
  };

  // Buyer placing order (Triggers Saga!)
  const placeOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !orderQuantity) return;
    
    setLoading(true);
    setStatusMsg({ type: 'info', text: 'Starting Transaction Saga (Inventory allocation -> Payment -> Transport booking)...' });

    try {
      const res = await fetch('http://localhost:8085/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user.userId,
          listingId: selectedProduct.id,
          quantity: parseFloat(orderQuantity),
          shippingAddress: buyerProfile.shippingAddress || 'No Address Provided'
        })
      });

      setLoading(false);
      if (res.ok) {
        const orderResult = await res.json();
        if (orderResult.status === 'SHIPPING' || orderResult.status === 'PAID') {
          setStatusMsg({ type: 'success', text: `Order Saga Complete! Transaction ID: ${orderResult.paymentTransactionId}. Shipment dispatched. Tracking #: ${orderResult.transportTrackingNumber}` });
          setSelectedProduct(null);
          setOrderQuantity('');
          fetchBuyerData();
          fetchSharedData();
        } else {
          setStatusMsg({ type: 'danger', text: `Transaction Saga Failed & Compensations triggered! Order marked as: ${orderResult.status}. (Reason: Payment declined / Insufficient stock).` });
          fetchBuyerData();
        }
      } else {
        setStatusMsg({ type: 'danger', text: 'Saga connection timed out.' });
      }
    } catch (err) {
      setLoading(false);
      setStatusMsg({ type: 'danger', text: 'Order service offline.' });
    }
  };

  // Fetch transport tracking details
  const getTrackingInfo = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:8088/api/transport/status/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackingDetails(prev => ({ ...prev, [orderId]: data }));
      } else {
        setTrackingDetails(prev => ({ ...prev, [orderId]: { status: 'Not Dispatched Yet' } }));
      }
    } catch (err) {
      console.error('Transport service down');
    }
  };

  return (
    <div className="dashboard-grid fade-in">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 5px 0' }} className="text-gradient">GreenChain</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONNECTED TO MICROSERVICES</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ background: 'var(--primary)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.fullName || user.username}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>{user.role}</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginTop: '10px' }}>
          <button onClick={() => setActiveTab('home')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'home' ? '1px solid var(--primary)' : '' }}>
            🏡 Dashboard Home
          </button>
          
          {user.role === 'FARMER' && (
            <>
              <button onClick={() => setActiveTab('inventory')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'inventory' ? '1px solid var(--primary)' : '' }}>
                🌱 Sell Harvest
              </button>
              <button onClick={() => setActiveTab('agriinfo')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'agriinfo' ? '1px solid var(--primary)' : '' }}>
                🛡️ Subsidies & Alerts
              </button>
              <button onClick={() => setActiveTab('trainings')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'trainings' ? '1px solid var(--primary)' : '' }}>
                🎓 NGO Trainings
              </button>
            </>
          )}

          {user.role === 'BUYER' && (
            <>
              <button onClick={() => setActiveTab('marketplace')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'marketplace' ? '1px solid var(--primary)' : '' }}>
                🛒 Browse Crops
              </button>
              <button onClick={() => setActiveTab('orders')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'orders' ? '1px solid var(--primary)' : '' }}>
                📋 Order History
              </button>
            </>
          )}

          <button onClick={() => setActiveTab('profile')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'profile' ? '1px solid var(--primary)' : '' }}>
            ⚙️ Profile Settings
          </button>
        </nav>

        <button onClick={onLogout} className="btn-gradient-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.25)' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {statusMsg.text && (
          <div className={`badge badge-${statusMsg.type}`} style={{ display: 'flex', width: '100%', marginBottom: '25px', padding: '15px 20px', borderRadius: '8px', fontSize: '0.95rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{statusMsg.text}</span>
            <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setStatusMsg({ type: '', text: '' })}>✖</span>
          </div>
        )}

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="fade-in">
            {/* Top widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Weather Widget */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Agricultural Weather</h3>
                  <CloudSun size={24} style={{ color: 'var(--secondary)' }} />
                </div>
                {weather ? (
                  <div>
                    <p style={{ fontSize: '2rem', fontWeight: '800' }}>{weather.temperature.toFixed(1)}°C</p>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem', margin: '4px 0' }}>{weather.description}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Humidity: {weather.humidity}% | Wind: {weather.windSpeed.toFixed(1)} km/h</p>
                    <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      📝 {weather.agriculturalAdvice}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Loading weather data...</p>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <input type="text" className="glass-input" style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }} value={weatherCity} onChange={e=>setWeatherCity(e.target.value)} placeholder="City" />
                  <button onClick={()=>fetchWeather(weatherCity)} className="btn-gradient-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}>Fetch</button>
                </div>
              </div>

              {/* Price Index Widget */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Live Commodity Price Index</h3>
                  <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                  {prices.length > 0 ? (
                    prices.map((p) => {
                      const change = p.currentPricePerKg - p.yesterdayPricePerKg;
                      return (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                          <span style={{ fontWeight: '500' }}>{p.cropName}</span>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: '600' }}>LKR {p.currentPricePerKg.toFixed(2)}/kg</span>
                            <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: change >= 0 ? '#34d399' : '#f87171' }}>
                              {change >= 0 ? '+' : ''}{change.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No prices posted yet.</p>
                  )}
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Platform Notifications</h3>
                  <Bell size={24} style={{ color: 'var(--accent)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent)', borderRadius: '0 6px 6px 0', fontSize: '0.85rem' }}>
                        <p>{n.message}</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.timestamp ? n.timestamp.split('T')[0] : ''}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No new notifications.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Welcome Hero Card with background picture and rotating animation */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '40px', 
                borderLeft: '5px solid var(--primary)',
                backgroundImage: 'linear-gradient(135deg, rgba(7, 10, 19, 0.9) 0%, rgba(13, 19, 34, 0.75) 100%), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.05)'
              }}
            >
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                Empowering{' '}
                <span 
                  className="rotating-text" 
                  style={{ 
                    opacity: isTaglineVisible ? 1 : 0, 
                    transform: isTaglineVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.4s ease-in-out'
                  }}
                >
                  {taglines[taglineIndex]}
                </span>
              </h1>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '10px' }}>
                Welcome back, {user.fullName || user.username}!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '800px', fontSize: '0.95rem' }}>
                {user.role === 'FARMER' 
                  ? 'Your GreenChain crop production suite is active and synchronized with the regional marketplace. You can list harvest volumes, track real-time commodity pricing, enroll in agricultural workshops, and receive real-time weather alerts.'
                  : 'Your GreenChain buyer portal is active. Inspect high-quality harvests listed directly by verified growers. Placing an order initiates a transaction Saga that coordinates inventory checks, payment dispatch, and transport logistics.'
                }
              </p>
            </div>
          </div>
        )}

        {/* TAB: INVENTORY (Farmer Specific) */}
        {activeTab === 'inventory' && user.role === 'FARMER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="fade-in">
            {/* List Crop Form */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PlusCircle style={{ color: 'var(--primary)' }} /> List New Crop Harvest
              </h3>
              <form onSubmit={listCrop} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Crop Name</label>
                  <input type="text" className="glass-input" placeholder="e.g. Broken Orange Pekoe Tea" value={cropName} onChange={e=>setCropName(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                  <select className="glass-input" value={cropCategory} onChange={e=>setCropCategory(e.target.value)}>
                    <option value="Beverages">Beverages (Tea/Coffee)</option>
                    <option value="Grains">Grains (Paddy/Corn)</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Quantity (kg)</label>
                    <input type="number" step="any" className="glass-input" placeholder="100.0" value={cropQty} onChange={e=>setCropQty(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Price per kg (LKR)</label>
                    <input type="number" step="any" className="glass-input" placeholder="1250.0" value={cropPrice} onChange={e=>setCropPrice(e.target.value)} required />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                  <textarea className="glass-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Premium high-grown leaves harvested this morning..." value={cropDesc} onChange={e=>setCropDesc(e.target.value)} />
                </div>
                <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                  Publish to Marketplace
                </button>
              </form>
            </div>

            {/* My Listings */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardList style={{ color: 'var(--secondary)' }} /> My Published Listings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '420px' }}>
                {myListings.length > 0 ? (
                  myListings.map((l) => (
                    <div key={l.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontWeight: '700' }}>{l.cropName}</h4>
                        <span className={`badge ${l.status === 'AVAILABLE' ? 'badge-success' : 'badge-info'}`}>{l.status}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{l.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '500' }}>
                        <span>Quantity: {l.quantity} kg</span>
                        <span style={{ color: 'var(--primary)' }}>LKR {l.pricePerKg.toFixed(2)}/kg</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No crop listings created yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: GOVT ALERTS & REGULATION (Farmer Specific) */}
        {activeTab === 'agriinfo' && user.role === 'FARMER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="fade-in">
            {/* Disease Alerts */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fca311' }}>
                <AlertTriangle /> Active Crop Disease Alerts (Government)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
                {diseaseAlerts.length > 0 ? (
                  diseaseAlerts.map((a) => (
                    <div key={a._id} style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontWeight: '700', color: '#fca5a5' }}>{a.diseaseName} ({a.crop})</h4>
                        <span className="badge badge-danger">{a.severity}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{a.description}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 Region: {a.region} | Date: {a.alertDate}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No active disease alerts.</p>
                )}
              </div>
            </div>

            {/* Subsidies */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <UserCheck /> Available Subsidies & Grants
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
                {subsidies.length > 0 ? (
                  subsidies.map((sub) => (
                    <div key={sub._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h4 style={{ fontWeight: '700', color: 'var(--primary)' }}>{sub.title}</h4>
                        <span className="badge badge-success">LKR {sub.amount?.toLocaleString()} Support</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{sub.description}</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '500' }}>Eligibility: {sub.eligibilityCriteria}</p>
                      <span className="badge badge-info" style={{ marginTop: '8px', fontSize: '0.7rem' }}>{sub.category}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No active subsidies recorded.</p>
                )}

                {grants.length > 0 && <h4 style={{ fontWeight: '700', marginTop: '15px', color: 'var(--accent)' }}>Available Grants</h4>}
                {grants.map((gr) => (
                  <div key={gr._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ fontWeight: '700', color: 'var(--accent)' }}>{gr.title}</h4>
                      <span className="badge badge-info">{gr.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{gr.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>Funding: <strong>LKR {gr.totalFund?.toLocaleString()}</strong></span>
                      <span style={{ color: 'var(--accent)' }}>Deadline: {gr.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: NGO TRAININGS & ADVISORIES (Farmer Specific) */}
        {activeTab === 'trainings' && user.role === 'FARMER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="fade-in">
            {/* Trainings */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)' }}>
                <BookOpen /> NGO Farm Assistance & Training Workshops
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
                {ngoTrainings.length > 0 ? (
                  ngoTrainings.map((t) => (
                    <div key={t._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '4px' }}>{t.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.description}</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '500', margin: '4px 0' }}>🧑‍🏫 Trainer: {t.trainer} | 📍 Location: {t.location}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {t.date} | Space: {t.registeredCount} / {t.maxAttendees} registered</p>
                      <button 
                        onClick={() => registerTraining(t._id)}
                        disabled={t.registeredCount >= t.maxAttendees}
                        className="btn-gradient-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', marginTop: '10px' }}
                      >
                        Register Now
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No training programs scheduled.</p>
                )}
              </div>
            </div>

            {/* Advisory Content */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardList style={{ color: 'var(--primary)' }} /> Advisory Bulletins & Best Practices
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
                {ngoAdvisories.length > 0 ? (
                  ngoAdvisories.map((ad) => (
                    <div key={ad._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>{ad.title}</h4>
                      <span className="badge badge-info" style={{ marginBottom: '8px' }}>{ad.topic}</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '8px' }}>
                        "{ad.content}"
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Author: {ad.author}</span>
                        <span>Date: {ad.datePublished}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No advisories posted.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: BROWSE CROP MARKETPLACE (Buyer Specific) */}
        {activeTab === 'marketplace' && user.role === 'BUYER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }} className="fade-in">
            {/* Marketplace Grid */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingCart style={{ color: 'var(--primary)' }} /> Available Crop Inventory
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                {availableProducts.length > 0 ? (
                  availableProducts.map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProduct(p)}
                      style={{ 
                        padding: '15px', 
                        background: 'rgba(255,255,255,0.02)', 
                        border: selectedProduct?.id === p.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)', 
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <h4 style={{ fontWeight: '700' }}>{p.cropName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0' }}>Category: {p.category}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{p.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Available: <strong>{p.quantity} kg</strong></span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>LKR {p.pricePerKg.toFixed(2)}/kg</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Seller: {p.farmerName}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No products listed for sale.</p>
                )}
              </div>
            </div>

            {/* Buy Form */}
            <div className="glass-panel">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package style={{ color: 'var(--secondary)' }} /> Secure Saga Order Checkout
              </h3>
              {selectedProduct ? (
                <form onSubmit={placeOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.9rem' }}>
                    <p style={{ fontWeight: '600' }}>Selected Crop: {selectedProduct.cropName}</p>
                    <p>Seller: {selectedProduct.farmerName}</p>
                    <p>Price: LKR {selectedProduct.pricePerKg.toFixed(2)}/kg</p>
                    <p>Max Available: {selectedProduct.quantity} kg</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Purchase Quantity (kg)</label>
                    <input 
                      type="number" 
                      className="glass-input" 
                      placeholder="e.g. 50" 
                      max={selectedProduct.quantity}
                      min={0.1}
                      step="any"
                      value={orderQuantity} 
                      onChange={e=>setOrderQuantity(e.target.value)} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Price Estimate</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                      LKR {orderQuantity ? (parseFloat(orderQuantity) * selectedProduct.pricePerKg).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : '0.00'}
                    </p>
                  </div>

                  <div style={{ marginTop: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ℹ️ Order amounts exceeding 1,000,000 LKR will trigger a Payment Service decline to show Saga compensation rollback.
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-gradient-primary" 
                    style={{ padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                  >
                    {loading ? <RefreshCw className="fade-in" style={{animation: 'spin 1.5s linear infinite'}} /> : 'Execute Secure Buy Saga'}
                  </button>
                </form>
              ) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Select a crop listing from the inventory panel to proceed with order placement.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB: ORDER HISTORY (Buyer Specific) */}
        {activeTab === 'orders' && user.role === 'BUYER' && (
          <div className="glass-panel fade-in">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ClipboardList style={{ color: 'var(--primary)' }} /> Order & Shipment Tracking Dashboard
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
              {myOrders.length > 0 ? (
                myOrders.map((o) => (
                  <div key={o.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Order #{o.id}</h4>
                      <span className={`badge ${
                        o.status === 'SHIPPING' || o.status === 'COMPLETED' ? 'badge-success' : 
                        o.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                      }`}>{o.status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <div>
                        <p>Purchase Qty: <strong>{o.quantity} kg</strong></p>
                        <p>Total Charge: <strong>LKR {o.totalPrice ? o.totalPrice.toFixed(2) : '0.00'}</strong></p>
                        <p>Delivery Destination: {o.shippingAddress}</p>
                      </div>
                      <div>
                        <p>Payment TxID: <code style={{color: 'var(--secondary)'}}>{o.paymentTransactionId || 'N/A'}</code></p>
                        <p>Logistics Tracking: <code style={{color: 'var(--accent)'}}>{o.transportTrackingNumber || 'N/A'}</code></p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <button 
                          onClick={() => getTrackingInfo(o.id)}
                          className="btn-gradient-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px', width: 'auto' }}
                        >
                          Check Delivery Details
                        </button>
                      </div>
                    </div>

                    {/* Show logistics status */}
                    {trackingDetails[o.id] && (
                      <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <h5 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '5px' }}>
                          <Truck size={14} /> Dispatch Logistics Info
                        </h5>
                        {trackingDetails[o.id].trackingNumber ? (
                          <>
                            <p>Driver Allocated: {trackingDetails[o.id].driverName} | Vehicle: {trackingDetails[o.id].vehicleNumber}</p>
                            <p>Shipping Progress: <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{trackingDetails[o.id].status}</span></p>
                          </>
                        ) : (
                          <p style={{color: 'var(--text-muted)'}}>No transport partner dispatched yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="glass-panel fade-in" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings style={{ color: 'var(--primary)' }} /> Edit Service Registry Settings
            </h3>
            
            {user.role === 'FARMER' ? (
              <form onSubmit={saveFarmerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Farm name</label>
                  <input type="text" className="glass-input" placeholder="e.g. Ella Green Tea Gardens" value={farmProfile.farmName} onChange={e=>setFarmProfile({...farmProfile, farmName: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Farm Location (Region)</label>
                  <input type="text" className="glass-input" placeholder="e.g. Badulla" value={farmProfile.farmLocation} onChange={e=>setFarmProfile({...farmProfile, farmLocation: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Farm Size (Acres)</label>
                    <input type="number" step="any" className="glass-input" placeholder="1.5" value={farmProfile.farmSize} onChange={e=>setFarmProfile({...farmProfile, farmSize: parseFloat(e.target.value)})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Primary Crop</label>
                    <input type="text" className="glass-input" placeholder="e.g. Green Tea" value={farmProfile.primaryCrop} onChange={e=>setFarmProfile({...farmProfile, primaryCrop: e.target.value})} required />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contact Phone Number</label>
                  <input type="tel" className="glass-input" value={farmProfile.contactNumber} onChange={e=>setFarmProfile({...farmProfile, contactNumber: e.target.value})} required />
                </div>
                <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                  Save Farm Registry Profile
                </button>
              </form>
            ) : (
              <form onSubmit={saveBuyerProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Company / Export Brand Name</label>
                  <input type="text" className="glass-input" placeholder="e.g. Ceylon Tea Exporters Ltd" value={buyerProfile.companyName} onChange={e=>setBuyerProfile({...buyerProfile, companyName: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Business License ID</label>
                  <input type="text" className="glass-input" placeholder="e.g. REG-88289-SL" value={buyerProfile.businessLicense} onChange={e=>setBuyerProfile({...buyerProfile, businessLicense: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shipping Address (Delivery Location)</label>
                  <input type="text" className="glass-input" placeholder="e.g. Colombo Port, WareHouse C" value={buyerProfile.shippingAddress} onChange={e=>setBuyerProfile({...buyerProfile, shippingAddress: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Contact Phone Number</label>
                  <input type="tel" className="glass-input" value={buyerProfile.contactNumber} onChange={e=>setBuyerProfile({...buyerProfile, contactNumber: e.target.value})} required />
                </div>
                <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                  Save Buyer Registry Profile
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
