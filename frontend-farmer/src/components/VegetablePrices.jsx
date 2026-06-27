import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, TrendingUp, Info, Activity, MapPin } from 'lucide-react';

const VEGETABLE_DATA = [
  {
    id: 'carrot',
    name: 'Carrot',
    description: 'Fresh and crunchy orange carrots harvested from the cool hills of Nuwara Eliya. High in beta-carotene.',
    category: 'Vegetables',
    basePrice: 380,
    regions: 'Nuwara Eliya, Welimada',
    nutrition: 'Vitamin A (120% DV), Fiber (2.8g), Potassium (320mg), Low Calories (41 kcal/100g)',
    supplyLevel: 'High',
    growthCycle: '90 - 120 Days',
    priceTrend: [350, 360, 375, 370, 390, 385, 380]
  },
  {
    id: 'potato',
    name: 'Potato',
    description: 'Premium quality local potatoes, starch-rich and ideal for curries. Sourced from organic farms.',
    category: 'Vegetables',
    basePrice: 240,
    regions: 'Badulla, Welimada, Nuwara Eliya',
    nutrition: 'Vitamin C (32% DV), Vitamin B6 (15% DV), Potassium (425mg), Carbohydrates (17g)',
    supplyLevel: 'Medium',
    growthCycle: '100 - 110 Days',
    priceTrend: [220, 225, 230, 235, 245, 250, 240]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    description: 'Juicy, vine-ripened red tomatoes. Ideal for culinary use and rich in lycopene antioxidants.',
    category: 'Vegetables',
    basePrice: 190,
    regions: 'Kandy, Matale, Dambulla',
    nutrition: 'Lycopene, Vitamin C (23% DV), Vitamin K (10% DV), Water content (94%)',
    supplyLevel: 'Low',
    growthCycle: '70 - 85 Days',
    priceTrend: [160, 175, 180, 195, 205, 210, 190]
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    description: 'Sweet and dense local pumpkin (Vattakka), harvested from dry zone farming grids.',
    category: 'Vegetables',
    basePrice: 150,
    regions: 'Anuradhapura, Polonnaruwa, Hambantota',
    nutrition: 'Vitamin A (245% DV), Vitamin C (19% DV), Potassium (340mg), Low Glycemic Index',
    supplyLevel: 'High',
    growthCycle: '100 - 120 Days',
    priceTrend: [140, 145, 148, 152, 155, 152, 150]
  },
  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    description: 'Glossy purple eggplants (Wambatu). Handpicked and free from synthetic preservatives.',
    category: 'Vegetables',
    basePrice: 180,
    regions: 'Embilipitiya, Kurunegala, Matale',
    nutrition: 'Nasunin (brain antioxidant), Fiber (3g), Manganese (10% DV), Low fat',
    supplyLevel: 'Medium',
    growthCycle: '90 - 105 Days',
    priceTrend: [195, 190, 185, 182, 178, 175, 180]
  },
  {
    id: 'leeks',
    name: 'Leeks',
    description: 'Mild, sweet onion-like flavored vegetable, freshly pulled from highland terraces.',
    category: 'Vegetables',
    basePrice: 290,
    regions: 'Nuwara Eliya, Ragala',
    nutrition: 'Vitamin K (52% DV), Manganese (12% DV), Iron (10% DV), Folate (16% DV)',
    supplyLevel: 'High',
    growthCycle: '120 - 150 Days',
    priceTrend: [310, 305, 300, 295, 285, 280, 290]
  },
  {
    id: 'green_chilli',
    name: 'Green Chilli',
    description: 'Spicy and vibrant local hot peppers, essential for authentic Sri Lankan spice levels.',
    category: 'Vegetables',
    basePrice: 450,
    regions: 'Jaffna, Puttalam, Dambulla',
    nutrition: 'Capsaicin, Vitamin C (240% DV), Vitamin B6, Iron, boosts metabolism',
    supplyLevel: 'Low',
    growthCycle: '60 - 80 Days',
    priceTrend: [400, 420, 435, 450, 470, 480, 450]
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    description: 'Crisp green cabbage heads, packed with vitamins and nutrients. Excellent for salads.',
    category: 'Vegetables',
    basePrice: 160,
    regions: 'Nuwara Eliya, Keppetipola',
    nutrition: 'Vitamin K (85% DV), Vitamin C (54% DV), Folate (10% DV), Dietary Fiber',
    supplyLevel: 'High',
    growthCycle: '85 - 100 Days',
    priceTrend: [180, 175, 170, 165, 160, 155, 160]
  }
];

export default function VegetablePrices() {
  const [selectedVeg, setSelectedVeg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    // Attempt to fetch live prices from the backend price service
    const fetchLivePrices = async () => {
      try {
        const res = await fetch('http://localhost:8086/api/prices');
        if (res.ok) {
          const data = await res.json();
          const priceMap = {};
          data.forEach(item => {
            priceMap[item.cropName.toLowerCase()] = item;
          });
          setLivePrices(priceMap);
        }
      } catch (err) {
        console.warn('Could not load live prices, using seeded mock history.', err);
      }
    };
    fetchLivePrices();
  }, []);

  const filteredVegs = VEGETABLE_DATA.filter(veg =>
    veg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceDetails = (veg) => {
    const liveInfo = livePrices[veg.name.toLowerCase()];
    if (liveInfo) {
      const current = liveInfo.currentPricePerKg;
      const yesterday = liveInfo.yesterdayPricePerKg;
      const diff = current - yesterday;
      // Synthesize trend based on live prices
      const trend = [...veg.priceTrend];
      trend[trend.length - 1] = current;
      trend[trend.length - 2] = yesterday;
      return { current, yesterday, diff, trend };
    }
    // Seeded fallback
    const trend = veg.priceTrend;
    const current = trend[trend.length - 1];
    const yesterday = trend[trend.length - 2];
    const diff = current - yesterday;
    return { current, yesterday, diff, trend };
  };

  // Render a simple SVG Chart for price trends
  const renderSVGChart = (trend) => {
    const minVal = Math.min(...trend) - 10;
    const maxVal = Math.max(...trend) + 10;
    const range = maxVal - minVal;
    
    // 7 data points, map to SVG space (width 400, height 150)
    const points = trend.map((val, index) => {
      const x = (index / (trend.length - 1)) * 360 + 20;
      const y = 130 - ((val - minVal) / range) * 110;
      return { x, y, val };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <svg viewBox="0 0 400 160" style={{ width: '100%', height: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 20 + ratio * 110;
          const val = maxVal - ratio * range;
          return (
            <g key={i}>
              <line x1="20" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <text x="382" y={y + 4} fill="var(--text-muted)" fontSize="8" textAnchor="start">
                {Math.round(val)}
              </text>
            </g>
          );
        })}
        {/* Trend line path */}
        <path d={pathD} fill="none" stroke="url(#chart-gradient)" strokeWidth="3" strokeLinecap="round" />
        {/* Area under curve */}
        <path d={`${pathD} L ${points[points.length - 1].x} 130 L ${points[0].x} 130 Z`} fill="url(#chart-area-gradient)" />
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--secondary)" stroke="var(--bg-secondary)" strokeWidth="2" />
            <text x={p.x} y={p.y - 8} fill="var(--text-primary)" fontSize="8" fontWeight="bold" textAnchor="middle">
              {p.val}
            </text>
            <text x={p.x} y="148" fill="var(--text-muted)" fontSize="8" textAnchor="middle">
              {['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'Yest', 'Today'][i]}
            </text>
          </g>
        ))}
        {/* Gradients */}
        <defs>
          <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
          <linearGradient id="chart-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="landing-section fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }} className="text-gradient">Daily Vegetable Price Index</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Click any crop card to review detailed analytics, agricultural zones, and price trends.</p>
        </div>
        <div>
          <input
            type="text"
            className="glass-input"
            placeholder="Search vegetables..."
            style={{ width: '280px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="veg-grid">
        {filteredVegs.map(veg => {
          const { current, diff } = getPriceDetails(veg);
          return (
            <div key={veg.id} className="glass-panel veg-card" onClick={() => setSelectedVeg(veg)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2.5rem' }}>
                  {veg.id === 'carrot' && '🥕'}
                  {veg.id === 'potato' && '🥔'}
                  {veg.id === 'tomato' && '🍅'}
                  {veg.id === 'pumpkin' && '🎃'}
                  {veg.id === 'brinjal' && '🍆'}
                  {veg.id === 'leeks' && '🥬'}
                  {veg.id === 'green_chilli' && '🌶️'}
                  {veg.id === 'cabbage' && '🥬'}
                </span>
                <span className={`badge ${veg.supplyLevel === 'High' ? 'badge-success' : veg.supplyLevel === 'Medium' ? 'badge-info' : 'badge-warning'}`}>
                  {veg.supplyLevel} Supply
                </span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{veg.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', minHeight: '40px' }}>
                  {veg.description.substring(0, 75)}...
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Market Index</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                    LKR {current.toFixed(2)}/kg
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Change</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: diff >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedVeg && (() => {
        const { current, diff, trend } = getPriceDetails(selectedVeg);
        return (
          <div className="modal-overlay" onClick={() => setSelectedVeg(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '600px', padding: '30px' }}>
              <button className="modal-close" onClick={() => setSelectedVeg(null)}>
                <X size={20} />
              </button>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '25px' }}>
                <span style={{ fontSize: '4rem' }}>
                  {selectedVeg.id === 'carrot' && '🥕'}
                  {selectedVeg.id === 'potato' && '🥔'}
                  {selectedVeg.id === 'tomato' && '🍅'}
                  {selectedVeg.id === 'pumpkin' && '🎃'}
                  {selectedVeg.id === 'brinjal' && '🍆'}
                  {selectedVeg.id === 'leeks' && '🥬'}
                  {selectedVeg.id === 'green_chilli' && '🌶️'}
                  {selectedVeg.id === 'cabbage' && '🥬'}
                </span>
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>{selectedVeg.name}</h2>
                    <span className={`badge ${selectedVeg.supplyLevel === 'High' ? 'badge-success' : selectedVeg.supplyLevel === 'Medium' ? 'badge-info' : 'badge-warning'}`}>
                      {selectedVeg.supplyLevel} Supply
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

              {/* Grid of details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} style={{ color: 'var(--secondary)' }} /> Prime Sourcing Regions
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
                  <Info size={14} style={{ color: 'var(--accent)' }} /> Nutritional Breakdown (per 100g)
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {selectedVeg.nutrition}
                </span>
              </div>

              {/* Price Index trend chart */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--primary)' }} /> 7-Day Price History (LKR/kg)
                </h4>
                {renderSVGChart(trend)}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
