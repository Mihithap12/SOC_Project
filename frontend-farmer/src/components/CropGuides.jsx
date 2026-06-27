import React, { useState } from 'react';
import { BookOpen, Sprout, Droplets, Sun, Compass, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

const CROP_GUIDES = [
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    sinhalaName: 'වී වගාව',
    icon: '🌾',
    season: 'Maha Season (Sept - March) / Yala Season (May - August)',
    growthCycle: '100 - 135 Days',
    soil: 'Alluvial and clayey soils, high moisture retention',
    sunlight: 'Full Sun (6-8 hours daily)',
    water: 'Flooded conditions (5-10cm depth during growth)',
    diseases: 'Paddy Blast, Sheath Blight, Brown Plant Hopper',
    steps: [
      { title: 'Soil Preparation', desc: 'Plough the field twice, add organic compost, and flood the field to create mud/slurry conditions.' },
      { title: 'Sowing & Transplanting', desc: 'Sow pre-germinated seeds directly or transplant 15-21 day old seedlings in rows (20x15 cm spacing).' },
      { title: 'Water Management', desc: 'Maintain standing water of 2-5 cm during vegetative stage. Drain water completely 10-15 days before harvest.' },
      { title: 'Fertilizing', desc: 'Apply Nitrogen, Phosphorus, and Potassium in splits (basal, tillering, panicle initiation stages).' },
      { title: 'Harvesting', desc: 'Harvest when 80-85% of grains are straw-colored. Thresh, clean, and dry the grains to 14% moisture level.' }
    ]
  },
  {
    id: 'tea',
    name: 'Green Tea',
    sinhalaName: 'තේ වගාව',
    icon: '🍃',
    season: 'Year-round planting, optimal during monsoon onset',
    growthCycle: 'Perennial (First harvest after 2-3 years)',
    soil: 'Deep, well-drained acidic soils (pH 4.5 - 5.5)',
    sunlight: 'Partial Sun / Shaded plantation spacing',
    water: 'Regular rainfall (1500-2500mm annually), no waterlogging',
    diseases: 'Blister Blight, Red Root Disease, Tea Tortrix',
    steps: [
      { title: 'Soil Preparation', desc: 'Construct contour terraces on slopes, dig trenches, and prepare deep organic-rich soil pits.' },
      { title: 'Planting', desc: 'Space clones at 1.2m x 0.6m. Plant shade trees (e.g., Erythrina) to protect young tea leaves.' },
      { title: 'Pruning & Training', desc: 'Prune every 3-4 years to maintain a flat "plucking table" at waist height (60-70 cm).' },
      { title: 'Fertilizing', desc: 'Apply specialized tea fertilizer mixtures (NPK + Zinc) after each pruning and harvesting cycle.' },
      { title: 'Harvesting', desc: 'Pluck "two leaves and a bud" manually or using light shears every 7-10 days for premium quality.' }
    ]
  },
  {
    id: 'potato',
    name: 'Potato',
    sinhalaName: 'අර්තාපල් වගාව',
    icon: '🥔',
    season: 'Maha Season (Oct - Nov planting)',
    growthCycle: '95 - 110 Days',
    soil: 'Loose, friable sandy loam, rich in organic matter',
    sunlight: 'Full Sun',
    water: 'Moderate, regular watering (avoid overwatering to prevent root rot)',
    diseases: 'Late Blight, Bacterial Wilt, Potato Tuber Moth',
    steps: [
      { title: 'Soil Preparation', desc: 'Loosen the soil to a depth of 30cm, remove stones, and create ridges/furrows.' },
      { title: 'Planting Tubers', desc: 'Plant certified, sprouted seed tubers 8-10 cm deep, spaced 25-30 cm apart in ridges.' },
      { title: 'Earthing Up', desc: 'Draw loose soil around the base of the plant twice (at 15cm and 30cm height) to protect growing tubers from sun.' },
      { title: 'Fertilizing', desc: 'Apply well-decomposed manure along with rich potash fertilizers during planting and earthing.' },
      { title: 'Harvesting', desc: 'Harvest when foliage turns yellow and dies back. Lift tubers carefully to avoid bruising, and dry in shade.' }
    ]
  },
  {
    id: 'carrot',
    name: 'Carrot',
    sinhalaName: 'කැරට් වගාව',
    icon: '🥕',
    season: 'Optimal during cooler hill country seasons',
    growthCycle: '90 - 110 Days',
    soil: 'Deep, stone-free light sandy loam (high stones cause root splitting)',
    sunlight: 'Full Sun',
    water: 'Regular light watering (moist soil is critical for straight roots)',
    diseases: 'Leaf Blight, Powdery Mildew, Root Knot Nematode',
    steps: [
      { title: 'Soil Preparation', desc: 'Dig soil deeply (up to 40cm), pulverize thoroughly, and prepare raised nursery beds.' },
      { title: 'Sowing Seeds', desc: 'Sow seeds thinly in shallow furrows (1.5 cm deep), spaced 15cm apart. Thin seedlings to 5cm spacing after germinating.' },
      { title: 'Weeding & Thinning', desc: 'Thin plants twice and weed meticulously to prevent root crowding and nutrient competition.' },
      { title: 'Fertilizing', desc: 'Apply balanced NPK mixture. Avoid excess nitrogen which causes hairy, split roots.' },
      { title: 'Harvesting', desc: 'Harvest when the crown of the carrot is about 2cm in diameter. Pull gently from the soil and wash.' }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    sinhalaName: 'තක්කාලි වගාව',
    icon: '🍅',
    season: 'Yala / Maha (avoid harvesting during peak monsoons)',
    growthCycle: '75 - 90 Days',
    soil: 'Well-drained fertile loam (pH 6.0 - 7.0)',
    sunlight: 'Full Sun',
    water: 'Consistent deep watering at the base (wetting leaves causes fungus)',
    diseases: 'Tomato Leaf Curl Virus, Early Blight, Fruit Borer',
    steps: [
      { title: 'Nursery & Raising', desc: 'Sow seeds in nursery trays. Transplant 25-30 day old healthy seedlings into the main field.' },
      { title: 'Staking & Trellising', desc: 'Support tomato vines using wooden stakes or nylon twine within 2 weeks of planting to keep fruit off wet soil.' },
      { title: 'Pruning', desc: 'Remove suckers (shoots growing in leaf junctions) to channel energy into main fruit stems.' },
      { title: 'Fertilizing', desc: 'Apply organic compost at basal, and potassium-rich fertilizer during flowering/fruiting.' },
      { title: 'Harvesting', desc: 'Harvest fruits when they show a reddish-orange tint. Store in ventilated crates.' }
    ]
  }
];

export default function CropGuides() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="landing-section fade-in">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }} className="text-gradient">Crop Cultivation Guides</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Step-by-step agricultural guides (Govi Upades) tailored for Sri Lankan soil and weather conditions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {CROP_GUIDES.map(crop => (
          <div 
            key={crop.id} 
            className="glass-panel" 
            onClick={() => {
              setSelectedCrop(crop);
              setActiveStep(0);
            }}
            style={{ 
              cursor: 'pointer', 
              border: selectedCrop?.id === crop.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '3rem' }}>{crop.icon}</span>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>{crop.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', margin: '4px 0 0 0', fontWeight: '600' }}>{crop.sinhalaName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Cycle: {crop.growthCycle}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCrop ? (
        <div className="glass-panel fade-in" style={{ padding: '35px', display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{selectedCrop.icon}</span> {selectedCrop.name} Cultivation Protocol
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Sowing Window: <strong>{selectedCrop.season}</strong></p>
            </div>
            <button 
              className="btn-gradient-primary" 
              style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem' }}
              onClick={() => setSelectedCrop(null)}
            >
              Clear Selection
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)' }}>
              <Compass size={24} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Soil Suitability</p>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{selectedCrop.soil}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)' }}>
              <Droplets size={24} style={{ color: 'var(--secondary)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Irrigation Needs</p>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{selectedCrop.water}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)' }}>
              <Sun size={24} style={{ color: 'var(--warning)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Sunlight Requirements</p>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{selectedCrop.sunlight}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <ShieldAlert size={24} style={{ color: '#f87171' }} />
              <div>
                <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: 0 }}>Threats / Diseases</p>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{selectedCrop.diseases}</p>
              </div>
            </div>
          </div>

          {/* Timeline Steps */}
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BookOpen size={20} style={{ color: 'var(--primary)' }} /> Chronological Cultivation Steps
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
                {selectedCrop.steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className="glass-input"
                    style={{
                      padding: '10px 20px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      border: activeStep === idx ? '1px solid var(--primary)' : '1px solid transparent',
                      background: activeStep === idx ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                      color: activeStep === idx ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    Step {idx + 1}: {step.title}
                  </button>
                ))}
              </div>

              <div className="glass-panel" style={{ padding: '25px', borderLeft: '4px solid var(--primary)', background: 'rgba(255,255,255,0.01)' }}>
                <h5 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                  {selectedCrop.steps[activeStep].title}
                </h5>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                  {selectedCrop.steps[activeStep].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Select a crop above to display step-by-step agricultural cultivation guidelines, soil conditions, and harvesting stages.
        </div>
      )}
    </div>
  );
}
