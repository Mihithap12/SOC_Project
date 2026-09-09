import React, { useState, useEffect } from 'react';
import { 
  CloudSun, Bell, TrendingUp, Settings, Package, ShoppingCart, 
  MapPin, PlusCircle, BookOpen, AlertTriangle, Truck, UserCheck, 
  LogOut, ClipboardList, RefreshCw, DollarSign, ArrowUpRight, 
  ArrowDownRight, Calendar, Search, Filter, Plus, ChevronRight, 
  Info, Activity, X
} from 'lucide-react';

// Static assets matching the GoviSaviya screenshots
const VEGETABLE_STATIC = [
  {
    id: 'radish',
    name: 'Radish',
    category: 'Low Country',
    market: 'Thambuttegama',
    image: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?w=500',
    change: -18.8,
    description: 'Fresh white radish sourced directly from low-country irrigation grids. Mild spicy flavor, high water content.',
    regions: 'Thambuttegama, Kurunegala',
    growthCycle: '50-60 Days',
    nutrition: 'Vitamin C, Potassium, Magnesium, Dietary Fiber'
  },
  {
    id: 'capsicum',
    name: 'Capsicum',
    category: 'Up Country',
    market: 'Thambuttegama',
    image: 'https://images.unsplash.com/photo-1563565088-913497f6c443?w=500',
    change: 0.0,
    description: 'Crisp and shiny green capsicums. Hand-harvested and sorted for size and uniformity.',
    regions: 'Nuwara Eliya, Thambuttegama',
    growthCycle: '80-90 Days',
    nutrition: 'Vitamin A, Vitamin B6, Iron, Potassium'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Low Country',
    market: 'Kandy',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500',
    change: -7.7,
    description: 'Plump and juicy vine-ripened red tomatoes. Ideal for culinary use and rich in lycopene antioxidants.',
    regions: 'Kandy, Matale, Dambulla',
    growthCycle: '70-85 Days',
    nutrition: 'Lycopene, Vitamin C (23% DV), Vitamin K, Water (94%)'
  },
  {
    id: 'beans',
    name: 'Beans',
    category: 'Up Country',
    market: 'Peliyagoda',
    image: 'https://images.unsplash.com/photo-1606516666246-398b74010a64?w=500',
    change: -10.0,
    description: 'Vibrant green long beans. Tender texture, excellent source of plant proteins.',
    regions: 'Welimada, Badulla, Peliyagoda',
    growthCycle: '65-75 Days',
    nutrition: 'Protein, Fiber, Calcium, Folate'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'Up Country',
    market: 'Nuwara Eliya',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500',
    change: 6.1,
    description: 'Crunchy orange carrots grown in the rich clay soils of highland Nuwara Eliya.',
    regions: 'Nuwara Eliya, Welimada',
    growthCycle: '90-120 Days',
    nutrition: 'Beta-Carotene, Vitamin A (120% DV), Potassium'
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'Up Country',
    market: 'Welimada',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
    change: -2.3,
    description: 'Starch-rich local potatoes. Earthy flavor profile, perfect for traditional Sri Lankan curries.',
    regions: 'Badulla, Welimada, Nuwara Eliya',
    growthCycle: '100-110 Days',
    nutrition: 'Potassium, Vitamin C, Carbohydrates'
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'Low Country',
    market: 'Anuradhapura',
    image: 'https://images.unsplash.com/photo-1506815444479-bbdb1e9b2133?w=500',
    change: 0.0,
    description: 'Sweet and dense local pumpkin (Vattakka), harvested from dry zone farming grids.',
    regions: 'Anuradhapura, Polonnaruwa, Hambantota',
    growthCycle: '100-120 Days',
    nutrition: 'Vitamin A (245% DV), Vitamin C, Potassium'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'Up Country',
    market: 'Welimada',
    image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=500',
    change: -2.1,
    description: 'Crisp green cabbage heads. Clean, tightly packed layers from highland farms.',
    regions: 'Nuwara Eliya, Keppetipola',
    growthCycle: '85-100 Days',
    nutrition: 'Vitamin K (85% DV), Vitamin C, Folate'
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Bananas',
    market: 'Embilipitiya',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
    change: 3.5,
    description: 'Sweet local sour bananas (Ambul). Grown in the tropical climate of Embilipitiya.',
    regions: 'Embilipitiya, Hambantota',
    growthCycle: '12-14 Months',
    nutrition: 'Potassium, Vitamin B6, Dietary Fiber, Natural Sugars'
  },
  {
    id: 'mango',
    name: 'Mango',
    category: 'Fruits',
    market: 'Dambulla',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500',
    change: 1.2,
    description: 'Juicy local mangoes (Karthakolomban). Sweet, aromatic, and rich in natural nutrients.',
    regions: 'Dambulla, Kurunegala',
    growthCycle: '3-4 Months (Blooms to Harvest)',
    nutrition: 'Vitamin C, Vitamin A, Folate, Dietary Fiber'
  }
];

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

  // Redesign: Daily Prices Filters
  const [pricesFilter, setPricesFilter] = useState('All');
  const [pricesSearch, setPricesSearch] = useState('');
  const [selectedVeg, setSelectedVeg] = useState(null);

  // Redesign: Weather detail states
  const [weatherCitySelected, setWeatherCitySelected] = useState('Colombo');

  // Redesign: Financial Tracker State
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 48000, category: 'Sales', description: 'Sold 300kg Carrots to Ceylon Exporters', date: '2026-06-25' },
    { id: 2, type: 'expense', amount: 8500, category: 'Fertilizer', description: 'NPK Fertilizer purchase (2 bags)', date: '2026-06-22' },
    { id: 3, type: 'expense', amount: 4200, category: 'Seeds', description: 'Bought carrot & tomato seed packets', date: '2026-06-18' },
    { id: 4, type: 'income', amount: 32000, category: 'Sales', description: 'Sold 150kg Tomatoes in local Dambulla market', date: '2026-06-15' },
    { id: 5, type: 'expense', amount: 15000, category: 'Labor', description: 'Paid helper for harvesting leeks', date: '2026-06-12' }
  ]);
  const [budgetGoal, setBudgetGoal] = useState(50000);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'income', amount: '', category: 'Sales', description: '', date: new Date().toISOString().split('T')[0] });
  const [txSearch, setTxSearch] = useState('');
  const [txCategory, setTxCategory] = useState('All');

  // Redesign: Crop Calendar State
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, date: '2026-06-25', crop: 'Carrot', task: 'Soil preparation and plowing', completed: true },
    { id: 2, date: '2026-06-28', crop: 'Tomato', task: 'Sow seeds in nursery trays', completed: false },
    { id: 3, date: '2026-07-02', crop: 'Carrot', task: 'Apply organic compost manure', completed: false },
    { id: 4, date: '2026-07-08', crop: 'Leeks', task: 'Harvest and clean first batch', completed: false },
    { id: 5, date: '2026-07-15', crop: 'Cabbage', task: 'Pesticide check and watering run', completed: false }
  ]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: new Date().toISOString().split('T')[0], crop: 'Carrot', task: '' });

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
      fetchWeather(weatherCitySelected);
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

  // Redesign: Handle adding transactions
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;
    const addedTx = {
      id: Date.now(),
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      description: newTx.description,
      date: newTx.date
    };
    setTransactions([addedTx, ...transactions]);
    setIsAddTxModalOpen(false);
    setNewTx({ type: 'income', amount: '', category: 'Sales', description: '', date: new Date().toISOString().split('T')[0] });
    setStatusMsg({ type: 'success', text: 'Transaction recorded successfully!' });
  };

  // Redesign: Handle adding Crop Calendar Event
  const handleAddCalendarEvent = (e) => {
    e.preventDefault();
    if (!newEvent.task) return;
    const addedEvent = {
      id: Date.now(),
      date: newEvent.date,
      crop: newEvent.crop,
      task: newEvent.task,
      completed: false
    };
    setCalendarEvents([...calendarEvents, addedEvent]);
    setIsAddEventModalOpen(false);
    setNewEvent({ date: new Date().toISOString().split('T')[0], crop: 'Carrot', task: '' });
  };

  // Redesign: Toggle Event completion
  const toggleCalendarEventCompletion = (id) => {
    setCalendarEvents(calendarEvents.map(ev => ev.id === id ? { ...ev, completed: !ev.completed } : ev));
  };

  // Financial calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const budgetUsed = totalExpense;
  const budgetRemaining = Math.max(0, budgetGoal - budgetUsed);
  const budgetPercent = Math.min(100, Math.round((budgetUsed / budgetGoal) * 100));

  // City change handler
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setWeatherCitySelected(selectedCity);
    fetchWeather(selectedCity);
  };

  // Weather attributes helpers matching Screen 2
  const getWeatherAttributes = () => {
    if (!weather) return { uv: '5 Mod', uvColor: 'var(--warning)', humClass: 'High', windDir: 'NE', visibility: '12.0 km', sunrise: '06:02 AM', sunset: '06:18 PM', rainChance: '20%' };
    const temp = weather.temperature;
    const hum = weather.humidity;
    const desc = weather.description.toLowerCase();

    const uvVal = Math.max(1, Math.min(11, Math.round(temp / 3)));
    const uvLabel = uvVal > 7 ? `${uvVal} Very High` : uvVal > 5 ? `${uvVal} High` : `${uvVal} Moderate`;
    const uvColor = uvVal > 7 ? 'var(--danger)' : uvVal > 5 ? 'var(--warning)' : 'var(--success)';

    const humLabel = hum > 80 ? `${hum}% High` : hum > 50 ? `${hum}% Normal` : `${hum}% Low`;
    const windDirection = temp > 28 ? 'SW' : 'NE';
    const vis = hum > 85 ? '7.5 km Reduced' : '12.0 km Optimal';

    let rChance = '10%';
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) rChance = '85%';
    else if (desc.includes('cloud') || desc.includes('overcast')) rChance = '60%';

    return {
      uv: uvLabel,
      uvColor,
      humClass: humLabel,
      windDir: windDirection,
      visibility: vis,
      sunrise: temp > 28 ? '05:54 AM' : '06:05 AM',
      sunset: temp > 28 ? '06:32 PM' : '06:14 PM',
      rainChance: rChance
    };
  };
  const weatherAttrs = getWeatherAttributes();

  // Render SVG 7-Day Sparkline for modal
  const renderSVGChart = (trendData) => {
    const values = trendData || [100, 105, 110, 95, 108, 120, 115];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * 480 + 10;
      const y = 140 - ((val - min) / range) * 110;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 500 160" style={{ width: '100%', height: '160px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
        <polyline fill="none" stroke="var(--primary)" strokeWidth="3" points={points} />
        {values.map((val, idx) => {
          const x = (idx / (values.length - 1)) * 480 + 10;
          const y = 140 - ((val - min) / range) * 110;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="4" fill="var(--secondary)" />
              <text x={x} y={y - 8} fill="var(--text-secondary)" fontSize="9" textAnchor="middle">
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="dashboard-grid fade-in">
      {/* Redesigned Forest Green Sidebar */}
      <div className="sidebar">
        <div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: '800', margin: '0 0 5px 0' }} className="text-gradient">GreenChain</h2>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', letterSpacing: '0.05em' }}>AGRI ENTERPRISE PORTAL</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.08)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ background: '#ffffff', color: '#166534', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: '750', color: '#ffffff', margin: 0 }}>{user.fullName || user.username}</p>
            <p style={{ fontSize: '0.75rem', color: '#dcfce7', fontWeight: '700', margin: 0 }}>{user.role}</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: '10px' }}>
          <button onClick={() => setActiveTab('home')} className={`sidebar-btn ${activeTab === 'home' ? 'active' : ''}`}>
            🏡 Overview
          </button>
          
          <button onClick={() => setActiveTab('prices')} className={`sidebar-btn ${activeTab === 'prices' ? 'active' : ''}`}>
            📈 Daily Prices
          </button>

          {user.role === 'FARMER' && (
            <>
              <button onClick={() => setActiveTab('inventory')} className={`sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}>
                🌱 Sell Harvest
              </button>
              <button onClick={() => setActiveTab('agriinfo')} className={`sidebar-btn ${activeTab === 'agriinfo' ? 'active' : ''}`}>
                🛡️ Subsidies & Alerts
              </button>
              <button onClick={() => setActiveTab('weather')} className={`sidebar-btn ${activeTab === 'weather' ? 'active' : ''}`}>
                🌦️ Weather Forecast
              </button>
              <button onClick={() => setActiveTab('finance')} className={`sidebar-btn ${activeTab === 'finance' ? 'active' : ''}`}>
                💵 Financial Tracker
              </button>
              <button onClick={() => setActiveTab('calendar')} className={`sidebar-btn ${activeTab === 'calendar' ? 'active' : ''}`}>
                📅 Crop Calendar
              </button>
              <button onClick={() => setActiveTab('trainings')} className={`sidebar-btn ${activeTab === 'trainings' ? 'active' : ''}`}>
                🎓 NGO Workshops
              </button>
            </>
          )}

          {user.role === 'BUYER' && (
            <>
              <button onClick={() => setActiveTab('marketplace')} className={`sidebar-btn ${activeTab === 'marketplace' ? 'active' : ''}`}>
                🛒 Browse Crops
              </button>
              <button onClick={() => setActiveTab('orders')} className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                📋 Order History
              </button>
            </>
          )}

          <button onClick={() => setActiveTab('profile')} className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}>
            ⚙️ Profile Settings
          </button>
        </nav>

        <button onClick={onLogout} className="sidebar-btn" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(239, 68, 68, 0.25)', marginTop: 'auto' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {statusMsg.text && (
          <div className={`badge badge-${statusMsg.type}`} style={{ display: 'flex', width: '100%', marginBottom: '25px', padding: '15px 20px', borderRadius: '10px', fontSize: '0.95rem', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn 0.3s ease' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Agri Weather Summary</h3>
                  <CloudSun size={24} style={{ color: 'var(--secondary)' }} />
                </div>
                {weather ? (
                  <div>
                    <p style={{ fontSize: '2.1rem', fontWeight: '800' }}>{weather.temperature.toFixed(1)}°C</p>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.95rem', margin: '4px 0' }}>{weather.description} in {weatherCitySelected}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Humidity: {weather.humidity}% | Rain: {weatherAttrs.rainChance}</p>
                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      📝 {weather.agriculturalAdvice}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Loading weather...</p>
                )}
              </div>

              {/* Price Index Widget */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Commodity Index</h3>
                  <TrendingUp size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                  {VEGETABLE_STATIC.slice(0, 4).map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: '500' }}>{p.name} ({p.market})</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Rs. {p.change > 0 ? 380 : p.change < -10 ? 130 : 350}/kg</span>
                        <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: p.change >= 0 ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
                          {p.change >= 0 ? '▲' : '▼'} {Math.abs(p.change)}%
                        </span>
                      </div>
                    </div>
                  ))}
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

            {/* Premium Welcome Hero Card */}
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

        {/* TAB 2: DAILY PRICES (Redesigned matching Screen 3) */}
        {activeTab === 'prices' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Market Prices</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track daily prices for crops across Sri Lanka. Prices updated today.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search vegetables & crops..." 
                    className="glass-input" 
                    style={{ paddingLeft: '40px', width: '100%', fontSize: '0.9rem' }}
                    value={pricesSearch}
                    onChange={e => setPricesSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
              {['All', 'Up Country', 'Low Country', 'Fruits', 'Bananas'].map(cat => {
                const count = cat === 'All' ? VEGETABLE_STATIC.length : VEGETABLE_STATIC.filter(v => v.category === cat).length;
                return (
                  <button 
                    key={cat} 
                    onClick={() => setPricesFilter(cat)}
                    className="badge" 
                    style={{ 
                      cursor: 'pointer', 
                      background: pricesFilter === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)', 
                      color: pricesFilter === cat ? '#ffffff' : 'var(--text-primary)',
                      border: pricesFilter === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                      fontSize: '0.8rem',
                      padding: '8px 16px'
                    }}
                  >
                    {cat} <span style={{ marginLeft: '4px', opacity: 0.7 }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Crop Cards Grid */}
            <div className="crop-card-grid">
              {VEGETABLE_STATIC
                .filter(veg => pricesFilter === 'All' || veg.category === pricesFilter)
                .filter(veg => veg.name.toLowerCase().includes(pricesSearch.toLowerCase()))
                .map(veg => {
                  const basePrice = veg.id === 'carrot' ? 380 : veg.id === 'potato' ? 240 : veg.id === 'tomato' ? 600 : veg.id === 'beans' ? 450 : veg.id === 'radish' ? 130 : veg.id === 'capsicum' ? 350 : 200;
                  return (
                    <div key={veg.id} className="crop-card">
                      <div className="crop-card-img-wrapper">
                        <img src={veg.image} alt={veg.name} className="crop-card-img" />
                        <span className={`badge crop-card-badge ${veg.change > 0 ? 'badge-success' : veg.change < 0 ? 'badge-danger' : 'badge-warning'}`}>
                          {veg.change >= 0 ? '+' : ''}{veg.change}%
                        </span>
                      </div>
                      
                      <div className="crop-card-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{veg.name}</h3>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                            {veg.category}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifySelf: 'flex-start', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <MapPin size={12} /> Sourced: {veg.market}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '10px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Market Index</span>
                            <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Rs. {basePrice}/kg</p>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                          <button 
                            onClick={() => { setSelectedVeg(veg); }} 
                            className="btn-gradient-primary" 
                            style={{ padding: '8px', fontSize: '0.8rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
                          >
                            View Trend
                          </button>
                          <button 
                            onClick={() => { setSelectedVeg(veg); }} 
                            className="btn-gradient-primary" 
                            style={{ padding: '8px', fontSize: '0.8rem', borderRadius: '6px' }}
                          >
                            History & Info
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: WEATHER FORECAST (Redesigned matching Screen 2) */}
        {activeTab === 'weather' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Weather Forecast</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time agricultural weather conditions and forecasts.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Region:</span>
                <select className="glass-input" value={weatherCitySelected} onChange={handleCityChange} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                  <option value="Colombo">Colombo</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>
            </div>

            {weather ? (
              <>
                {/* Large Green Weather Banner */}
                <div className="weather-banner">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 5 }}>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1 }}>{weather.temperature.toFixed(0)}°</h1>
                    <p style={{ fontSize: '1rem', opacity: 0.9 }}>Feels like {(weather.temperature + 2).toFixed(0)}°</p>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '750', marginTop: '10px' }}>{weather.description}</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      💧 {weatherAttrs.rainChance} rain chance
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', zIndex: 5, textAlign: 'right' }}>
                    <CloudSun size={80} style={{ opacity: 0.95 }} />
                    <p style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} /> {weather.city}
                    </p>
                  </div>
                </div>

                {/* 6 Detail Cards Grid */}
                <div className="weather-detail-grid">
                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>UV INDEX</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: weatherAttrs.uvColor }}>{weatherAttrs.uv.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{weatherAttrs.uv.split(' ').slice(1).join(' ')}</span>
                  </div>

                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>HUMIDITY</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>{weather.humidity}%</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{weather.humidity > 80 ? 'High' : 'Normal'}</span>
                  </div>

                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>WIND</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#22d3ee' }}>{weather.windSpeed.toFixed(1)} km/h</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Direction: {weatherAttrs.windDir}</span>
                  </div>

                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>VISIBILITY</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a78bfa' }}>{weatherAttrs.visibility.split(' ')[0]} km</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{weatherAttrs.visibility.split(' ').slice(1).join(' ')}</span>
                  </div>

                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>SUNRISE</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fbbf24' }}>{weatherAttrs.sunrise}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Morning run</span>
                  </div>

                  <div className="weather-detail-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>SUNSET</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fb923c' }}>{weatherAttrs.sunset}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Field shutdown</span>
                  </div>
                </div>

                {/* Agricultural Advice Card */}
                <div className="glass-panel" style={{ borderLeft: '4px solid var(--secondary)' }}>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    💡 Intelligent Agricultural Advisory
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {weather.agriculturalAdvice}
                  </p>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Loading detailed weather data...</p>
            )}
          </div>
        )}

        {/* TAB: FINANCIAL TRACKER (Redesigned matching Screen 1) */}
        {activeTab === 'finance' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Financial Tracker</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your farm income and expenses efficiently.</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsAddTxModalOpen(true)} className="btn-gradient-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px' }}>
                  <Plus size={16} /> Add Transaction
                </button>
              </div>
            </div>

            {/* Income, Expense, Profit Cards Grid */}
            <div className="finance-stat-grid">
              <div className="finance-stat-card income">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>TOTAL INCOME</span>
                <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', margin: '8px 0 4px 0' }}>Rs. {totalIncome.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <ArrowUpRight size={14} /> +12% View Details
                </span>
              </div>

              <div className="finance-stat-card expense">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>TOTAL EXPENSE</span>
                <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ef4444', margin: '8px 0 4px 0' }}>Rs. {totalExpense.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <ArrowDownRight size={14} /> +5% View Details
                </span>
              </div>

              <div className="finance-stat-card profit">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>NET PROFIT</span>
                <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6', margin: '8px 0 4px 0' }}>Rs. {netProfit.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <ArrowUpRight size={14} /> +18% View Details
                </span>
              </div>
            </div>

            {/* Monthly Budget Goal */}
            <div className="finance-budget-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🎯 Monthly Budget Goal</span>
                <span style={{ color: 'var(--text-secondary)' }}>Rs. {budgetUsed.toLocaleString()} / Rs. {budgetGoal.toLocaleString()}</span>
              </div>
              <div className="finance-progress-bar-bg">
                <div className="finance-progress-bar-fill" style={{ width: `${budgetPercent}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{budgetPercent}% used</span>
                <span style={{ color: budgetRemaining > 10000 ? 'var(--primary)' : 'var(--danger)' }}>Rs. {budgetRemaining.toLocaleString()} remaining</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    className="glass-input" 
                    style={{ paddingLeft: '38px', width: '100%', padding: '10px 10px 10px 38px', fontSize: '0.9rem' }}
                    value={txSearch}
                    onChange={e => setTxSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="glass-input" 
                  value={txCategory} 
                  onChange={e => setTxCategory(e.target.value)}
                  style={{ padding: '8px 16px', fontSize: '0.9rem', minWidth: '150px' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Sales">Sales</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>

              {/* Transactions Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 10px' }}>Date</th>
                      <th style={{ padding: '12px 10px' }}>Description</th>
                      <th style={{ padding: '12px 10px' }}>Category</th>
                      <th style={{ padding: '12px 10px' }}>Type</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(t => txCategory === 'All' || t.category === txCategory)
                      .filter(t => t.description.toLowerCase().includes(txSearch.toLowerCase()))
                      .map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', verticalAlign: 'middle' }}>
                          <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{t.date}</td>
                          <td style={{ padding: '12px 10px', fontWeight: '500' }}>{t.description}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid var(--glass-border)' }}>
                              {t.category}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span className={`badge ${t.type === 'income' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                              {t.type}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '750', color: t.type === 'income' ? '#34d399' : '#f87171' }}>
                            {t.type === 'income' ? '+' : '-'} LKR {t.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CROP CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Crop Calendar</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Schedule and track planting, watering, fertilizing, and harvesting tasks.</p>
              </div>

              <button onClick={() => setIsAddEventModalOpen(true)} className="btn-gradient-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px' }}>
                <Plus size={16} /> Schedule Task
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
              {/* Event Schedule List */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ color: 'var(--primary)' }} /> Upcoming Schedule
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
                  {calendarEvents.map(ev => (
                    <div key={ev.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ opacity: ev.completed ? 0.6 : 1 }}>
                        <h4 style={{ fontWeight: '700', textDecoration: ev.completed ? 'line-through' : 'none' }}>{ev.task}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', margin: '4px 0' }}>Crop: {ev.crop}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled Date: {ev.date}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={ev.completed} 
                        onChange={() => toggleCalendarEventCompletion(ev.id)} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Guides Card */}
              <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '15px' }}>
                  📖 Smart Agricultural Tips
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <p>
                    🥔 <strong>Potato Crop (Welimada)</strong>: Ensure soil moisture is consistently medium. Avoid water accumulation which leads to root and tuber rotting.
                  </p>
                  <p>
                    🥕 <strong>Carrot sowing</strong>: Highland clay soil should be thoroughly plowed down to 1.5 feet to prevent root bending.
                  </p>
                  <p>
                    🍅 <strong>Tomatoes</strong>: Protect early nursery trays from direct sun. Water twice a day in the early morning and late evening.
                  </p>
                </div>
              </div>
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

        {/* TAB: NGO TRAININGS (Farmer Specific) */}
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

        {/* TAB: ORDER HISTORY */}
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
                <p style={{ color: 'var(--text-muted)' }}>You haven\'t placed any orders yet.</p>
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

      {/* Redesign Modal: Crop Detail & Trend sparkline */}
      {selectedVeg && (() => {
        const basePrice = selectedVeg.id === 'carrot' ? 380 : selectedVeg.id === 'potato' ? 240 : selectedVeg.id === 'tomato' ? 600 : selectedVeg.id === 'beans' ? 450 : selectedVeg.id === 'radish' ? 130 : selectedVeg.id === 'capsicum' ? 350 : 200;
        const mockTrend = [
          basePrice - 20, 
          basePrice - 15, 
          basePrice - 25, 
          basePrice - (selectedVeg.change > 0 ? 30 : -5), 
          basePrice - (selectedVeg.change > 0 ? 10 : -15), 
          basePrice + (selectedVeg.change > 0 ? 5 : -10), 
          basePrice
        ];
        return (
          <div className="modal-overlay" onClick={() => setSelectedVeg(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '600px', padding: '30px' }}>
              <button className="modal-close" onClick={() => setSelectedVeg(null)}>
                <X size={20} />
              </button>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
                <img src={selectedVeg.image} alt={selectedVeg.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>{selectedVeg.name}</h2>
                    <span className={`badge ${selectedVeg.change >= 0 ? 'badge-success' : 'badge-danger'}`}>
                      {selectedVeg.change >= 0 ? '+' : ''}{selectedVeg.change}%
                    </span>
                  </div>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '4px' }}>
                    Sri Lankan Agricultural Registry Item
                  </p>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                {selectedVeg.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: 'var(--secondary)' }} /> Sourcing Regions
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{selectedVeg.regions}</span>
                </div>
                
                <div className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} style={{ color: 'var(--primary)' }} /> Growth Cycle
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{selectedVeg.growthCycle}</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '30px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={14} style={{ color: 'var(--accent)' }} /> Nutritional Value
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {selectedVeg.nutrition}
                </span>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> 7-Day Price History (LKR/kg)
                </h4>
                {renderSVGChart(mockTrend)}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Redesign Modal: Add Transaction */}
      {isAddTxModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTxModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '450px', padding: '30px' }}>
            <button className="modal-close" onClick={() => setIsAddTxModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign style={{ color: 'var(--primary)' }} /> Record Transaction
            </h3>

            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Type</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="radio" 
                      name="txType" 
                      value="income" 
                      checked={newTx.type === 'income'} 
                      onChange={e => setNewTx({ ...newTx, type: e.target.value })} 
                      style={{ accentColor: 'var(--primary)' }}
                    /> Income
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                    <input 
                      type="radio" 
                      name="txType" 
                      value="expense" 
                      checked={newTx.type === 'expense'} 
                      onChange={e => setNewTx({ ...newTx, type: e.target.value })} 
                      style={{ accentColor: 'var(--danger)' }}
                    /> Expense
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amount (LKR)</label>
                <input 
                  type="number" 
                  className="glass-input" 
                  placeholder="e.g. 15000" 
                  value={newTx.amount}
                  onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                <select 
                  className="glass-input" 
                  value={newTx.category}
                  onChange={e => setNewTx({ ...newTx, category: e.target.value })}
                >
                  <option value="Sales">Sales</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Labor">Labor</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Description</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Bought urea fertilizer bags" 
                  value={newTx.description}
                  onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  className="glass-input" 
                  value={newTx.date}
                  onChange={e => setNewTx({ ...newTx, date: e.target.value })}
                  required 
                />
              </div>

              <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                Submit Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Redesign Modal: Schedule Crop Event */}
      {isAddEventModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEventModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '450px', padding: '30px' }}>
            <button className="modal-close" onClick={() => setIsAddEventModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarPlus style={{ color: 'var(--primary)' }} /> Schedule Task
            </h3>

            <form onSubmit={handleAddCalendarEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  className="glass-input" 
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Crop</label>
                <select 
                  className="glass-input" 
                  value={newEvent.crop}
                  onChange={e => setNewEvent({ ...newEvent, crop: e.target.value })}
                >
                  <option value="Carrot">Carrot</option>
                  <option value="Potato">Potato</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Leeks">Leeks</option>
                  <option value="Cabbage">Cabbage</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Task Description</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="e.g. Sow tomato seeds in nursery" 
                  value={newEvent.task}
                  onChange={e => setNewEvent({ ...newEvent, task: e.target.value })}
                  required 
                />
              </div>

              <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                Add to Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Extra helper component or icon
function CalendarPlus({ size, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M10 16h4" />
      <path d="M12 14v4" />
    </svg>
  );
}
