import React, { useState } from 'react';
import { Calculator, Sprout, TrendingUp, DollarSign, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

const CROP_FACTORS = {
  carrot: { name: 'Carrot', baseYield: 9500, pricePerKg: 380, icon: '🥕' },
  potato: { name: 'Potato', baseYield: 8500, pricePerKg: 240, icon: '🥔' },
  tomato: { name: 'Tomato', baseYield: 11000, pricePerKg: 190, icon: '🍅' },
  leeks: { name: 'Leeks', baseYield: 7500, pricePerKg: 290, icon: '🥬' },
  paddy: { name: 'Paddy (Rice)', baseYield: 2200, pricePerKg: 110, icon: '🌾' }
};

const REGION_FACTORS = {
  nuwara_eliya: { name: 'Nuwara Eliya', crops: ['carrot', 'potato', 'leeks'], factor: 1.15, advice: 'Highland soils are optimal. Monitor for frost alerts in early mornings.' },
  badulla: { name: 'Badulla / Welimada', crops: ['potato', 'leeks', 'carrot'], factor: 1.08, advice: 'Excellent soil drainage. Good season for potato cultivation.' },
  jaffna: { name: 'Jaffna', crops: ['potato', 'tomato'], factor: 1.05, advice: 'Sandy loam requires frequent light watering. Monitor soil salinity.' },
  anuradhapura: { name: 'Anuradhapura', crops: ['paddy'], factor: 1.12, advice: 'Dry zone clayey soils require structural canal irrigation. Keep bunds maintained.' },
  kandy: { name: 'Kandy / Matale', crops: ['tomato'], factor: 1.02, advice: 'Hilly terrain requires contour spacing. Watch out for tomato fruit borer pests.' }
};

export default function YieldForecaster() {
  const [crop, setCrop] = useState('carrot');
  const [region, setRegion] = useState('nuwara_eliya');
  const [acres, setAcres] = useState(1);
  const [fertilizer, setFertilizer] = useState('standard'); // low, standard, high
  const [irrigation, setIrrigation] = useState('drip'); // rainfed, drip, canal
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    
    const cropData = CROP_FACTORS[crop];
    const regionData = REGION_FACTORS[region];
    
    // Calculate factors
    let fertFactor = 1.0;
    if (fertilizer === 'low') fertFactor = 0.8;
    if (fertilizer === 'high') fertFactor = 1.12;
    
    let irrFactor = 1.0;
    if (irrigation === 'rainfed') irrFactor = 0.85;
    if (irrigation === 'drip') irrFactor = 1.15;
    if (irrigation === 'canal') irrFactor = 1.05;
    
    // Yield calculation
    const regionMulti = regionData.crops.includes(crop) ? regionData.factor : 0.75; // penalty for wrong crop-region matching
    const estimatedYield = Math.round(cropData.baseYield * acres * regionMulti * fertFactor * irrFactor);
    
    // Price variation based on region multiplier
    const finalPrice = Math.round(cropData.pricePerKg * (1 + (regionMulti - 1) * 0.5));
    const estimatedRevenue = estimatedYield * finalPrice;
    
    // Formulate custom advice
    let matchedAdvice = regionData.advice;
    if (!regionData.crops.includes(crop)) {
      matchedAdvice = `⚠️ Warning: ${cropData.name} is not traditionally recommended for ${regionData.name}. Crop yield may be lower due to soil/climate differences. Consider switching to recommended crops: ${regionData.crops.map(c => CROP_FACTORS[c].name).join(', ')}.`;
    }
    
    setResult({
      yieldKg: estimatedYield,
      priceLkr: finalPrice,
      revenueLkr: estimatedRevenue,
      advice: matchedAdvice,
      isMatched: regionData.crops.includes(crop)
    });
  };

  return (
    <div className="landing-section fade-in">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }} className="text-gradient">Smart Yield & Price Forecaster</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Simulate agricultural productivity, price indices, and target revenues based on acreage and regional climates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="feedback-grid">
        {/* Input Form */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Calculator style={{ color: 'var(--primary)' }} /> Parameter Configuration
          </h3>

          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Crop Type</label>
                <select className="glass-input" value={crop} onChange={e => setCrop(e.target.value)} style={{ background: 'var(--bg-secondary)' }}>
                  {Object.entries(CROP_FACTORS).map(([key, data]) => (
                    <option key={key} value={key}>{data.icon} {data.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Agricultural Region</label>
                <select className="glass-input" value={region} onChange={e => setRegion(e.target.value)} style={{ background: 'var(--bg-secondary)' }}>
                  {Object.entries(REGION_FACTORS).map(([key, data]) => (
                    <option key={key} value={key}>📍 {data.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Land Size (Acres)</label>
                <input
                  type="number"
                  className="glass-input"
                  min="0.1"
                  max="100"
                  step="any"
                  value={acres}
                  onChange={e => setAcres(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Irrigation Mode</label>
                <select className="glass-input" value={irrigation} onChange={e => setIrrigation(e.target.value)} style={{ background: 'var(--bg-secondary)' }}>
                  <option value="rainfed">Rainfed (Monsoon Dependent)</option>
                  <option value="canal">Canal / Tank Irrigation</option>
                  <option value="drip">Micro-Drip (Optimized)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fertilization Level</label>
              <select className="glass-input" value={fertilizer} onChange={e => setFertilizer(e.target.value)} style={{ background: 'var(--bg-secondary)' }}>
                <option value="low">Minimal Organic Fertilization (Low Input)</option>
                <option value="standard">Standard NPK / Balanced Compost (Recommended)</option>
                <option value="high">High Input Intensive Treatment</option>
              </select>
            </div>

            <button type="submit" className="btn-gradient-primary" style={{ padding: '14px', borderRadius: '8px', fontSize: '1rem', marginTop: '10px' }}>
              Execute Yield Forecast
            </button>
          </form>
        </div>

        {/* Output Results */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {result ? (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }} className="text-gradient">Forecast Output</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Simulated estimates based on agricultural constants.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px' }}>
                <div className="glass-panel" style={{ padding: '15px', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
                  <Sprout size={20} style={{ color: 'var(--primary)', margin: '0 auto 8px auto' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Expected Yield</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>{result.yieldKg.toLocaleString()} kg</span>
                </div>

                <div className="glass-panel" style={{ padding: '15px', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
                  <TrendingUp size={20} style={{ color: 'var(--secondary)', margin: '0 auto 8px auto' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Projected Index</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>LKR {result.priceLkr}/kg</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', textAlign: 'center' }}>
                <DollarSign size={24} style={{ color: 'var(--primary)', margin: '0 auto 5px auto' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Estimated Total Revenue</span>
                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', margin: '5px 0 0 0' }}>
                  LKR {result.revenueLkr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div 
                className="glass-panel" 
                style={{ 
                  padding: '15px', 
                  background: result.isMatched ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
                  border: result.isMatched ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)', 
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {result.isMatched ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <ShieldAlert size={18} style={{ color: 'var(--danger)', marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {result.isMatched ? 'Regional Agronomy Advice' : 'Compatibility Alert'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                    {result.advice}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              <HelpCircle size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 15px auto', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem' }}>Configure parameters and click "Execute Yield Forecast" to see projected output, local prices, and agronomy advice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
