import React, { useState, useEffect } from 'react';
import { 
  Building2, Landmark, ShieldAlert, Award, FileText, 
  PlusCircle, RefreshCw, Send, AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('subsidies');
  const [subsidies, setSubsidies] = useState([]);
  const [grants, setGrants] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [regulations, setRegulations] = useState([]);

  // Form states
  const [subTitle, setSubTitle] = useState('');
  const [subAmount, setSubAmount] = useState('');
  const [subCriteria, setSubCriteria] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subCategory, setSubCategory] = useState('Fertilizer');

  const [grantTitle, setGrantTitle] = useState('');
  const [grantFund, setGrantFund] = useState('');
  const [grantDeadline, setGrantDeadline] = useState('');
  const [grantDesc, setGrantDesc] = useState('');

  const [alertCrop, setAlertCrop] = useState('');
  const [alertDisease, setAlertDisease] = useState('');
  const [alertRegion, setAlertRegion] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('MEDIUM');
  const [alertDesc, setAlertDesc] = useState('');

  const [regTitle, setRegTitle] = useState('');
  const [regCategory, setRegCategory] = useState('Chemicals');
  const [regDesc, setRegDesc] = useState('');
  const [regDate, setRegDate] = useState('');

  // Status logs
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const subRes = await fetch('http://localhost:8091/api/subsidies');
      if (subRes.ok) setSubsidies(await subRes.json());

      const grantRes = await fetch('http://localhost:8091/api/grants');
      if (grantRes.ok) setGrants(await grantRes.json());

      const alertRes = await fetch('http://localhost:8091/api/alerts');
      if (alertRes.ok) setAlerts(await alertRes.json());

      const regRes = await fetch('http://localhost:8091/api/regulations');
      if (regRes.ok) setRegulations(await regRes.json());
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to Government NodeJS backend (Port 8091).' });
    }
  };

  const createSubsidy = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8091/api/subsidies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subTitle,
          amount: parseFloat(subAmount),
          eligibilityCriteria: subCriteria,
          description: subDesc,
          category: subCategory
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Subsidy created successfully!' });
        setSubTitle('');
        setSubAmount('');
        setSubCriteria('');
        setSubDesc('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to Government service' });
    }
  };

  const createGrant = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8091/api/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: grantTitle,
          totalFund: parseFloat(grantFund),
          status: 'ACTIVE',
          deadline: grantDeadline,
          description: grantDesc
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Grant program published!' });
        setGrantTitle('');
        setGrantFund('');
        setGrantDeadline('');
        setGrantDesc('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to Government service' });
    }
  };

  const createAlert = async (e) => {
    e.preventDefault();
    try {
      // 1. Post to government-service
      const alertDate = new Date().toISOString().split('T')[0];
      const res = await fetch('http://localhost:8091/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: alertCrop,
          diseaseName: alertDisease,
          region: alertRegion,
          severity: alertSeverity,
          description: alertDesc,
          alertDate
        })
      });

      if (res.ok) {
        // 2. Trigger microservices broadcast notification to notify-service!
        const broadcastMsg = `⚠️ GOVERNMENT CRITICAL CROP ALERT: Fungal outbreak of '${alertDisease}' detected in '${alertRegion}' targeting '${alertCrop}'. Actions: ${alertDesc}`;
        try {
          await fetch('http://localhost:8089/api/notifications/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: broadcastMsg })
          });
        } catch (ex) {
          console.error('Notification service unreachable for broadcast');
        }

        setStatusMsg({ type: 'success', text: 'Disease alert posted and broadcasted to Notification service!' });
        setAlertCrop('');
        setAlertDisease('');
        setAlertRegion('');
        setAlertDesc('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to post disease alert' });
    }
  };

  const createRegulation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8091/api/regulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: regTitle,
          category: regCategory,
          description: regDesc,
          effectiveDate: regDate
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Agricultural regulation posted successfully!' });
        setRegTitle('');
        setRegDesc('');
        setRegDate('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to Government service' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{ 
        background: 'rgba(7, 10, 19, 0.6)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
        padding: '15px 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={24} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.02em' }} className="text-gradient">AgriChain Government Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={fetchData} className="glass-input" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <RefreshCw size={12} /> Sync Data
          </button>
          <span className="badge badge-warning">NodeJS Backend</span>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-grid fade-in">
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <Building2 size={40} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <p style={{ fontWeight: '700' }}>Govt. Registry</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DEPARTMENT OF AGRICULTURE</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <button onClick={() => setActiveTab('subsidies')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'subsidies' ? '1px solid var(--primary)' : '' }}>
              💸 Manage Subsidies
            </button>
            <button onClick={() => setActiveTab('grants')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'grants' ? '1px solid var(--primary)' : '' }}>
              🏆 Manage Grants
            </button>
            <button onClick={() => setActiveTab('alerts')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'alerts' ? '1px solid var(--primary)' : '' }}>
              ⚠️ Disease Alerts
            </button>
            <button onClick={() => setActiveTab('regulations')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'regulations' ? '1px solid var(--primary)' : '' }}>
              📜 Legal Regulations
            </button>
          </nav>
        </div>

        {/* Workspace */}
        <div className="main-content">
          {statusMsg.text && (
            <div className={`badge badge-${statusMsg.type}`} style={{ display: 'flex', width: '100%', marginBottom: '25px', padding: '12px 18px', fontSize: '0.9rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{statusMsg.text}</span>
              <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setStatusMsg({ type: '', text: '' })}>✖</span>
            </div>
          )}

          {/* TAB 1: SUBSIDIES */}
          {activeTab === 'subsidies' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Landmark style={{ color: 'var(--primary)' }} /> Subsidies Directory
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {subsidies.length > 0 ? (
                    subsidies.map((sub) => (
                      <div key={sub._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700' }}>{sub.title}</h4>
                          <span className="badge badge-success">LKR {sub.amount} Support</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{sub.description}</p>
                        <p style={{ fontSize: '0.8rem', fontWeight: '500' }}>Target: {sub.eligibilityCriteria}</p>
                        <span className="badge badge-info" style={{ marginTop: '8px', fontSize: '0.7rem' }}>{sub.category}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No subsidies recorded in MongoDB.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px' }}><PlusCircle style={{ color: 'var(--primary)' }} /> Launch New Subsidy</h3>
                <form onSubmit={createSubsidy} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Subsidy Title</label>
                    <input type="text" className="glass-input" placeholder="e.g. Weedicide Rebate" value={subTitle} onChange={e=>setSubTitle(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Category</label>
                    <select className="glass-input" value={subCategory} onChange={e=>setSubCategory(e.target.value)}>
                      <option value="Fertilizer">Fertilizer</option>
                      <option value="Seeds">Seeds & Seedlings</option>
                      <option value="Equipment">Farm Equipment</option>
                      <option value="Fuel">Fuel Rebates</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Support Amount (LKR per farmer)</label>
                    <input type="number" className="glass-input" placeholder="10000" value={subAmount} onChange={e=>setSubAmount(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Eligibility Criteria</label>
                    <input type="text" className="glass-input" placeholder="e.g. Registered smallholders in Kandy district" value={subCriteria} onChange={e=>setSubCriteria(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Detailed Description</label>
                    <textarea className="glass-input" style={{ minHeight: '80px' }} placeholder="Detail the submission process..." value={subDesc} onChange={e=>setSubDesc(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px' }}>Publish Subsidy Program</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: GRANTS */}
          {activeTab === 'grants' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award style={{ color: 'var(--primary)' }} /> Grants Program Portfolio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {grants.length > 0 ? (
                    grants.map((gr) => (
                      <div key={gr._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700' }}>{gr.title}</h4>
                          <span className="badge badge-info">{gr.status}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{gr.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span>Funding: <strong>LKR {gr.totalFund.toLocaleString()}</strong></span>
                          <span style={{ color: 'var(--accent)' }}>Deadline: {gr.deadline}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No grants active.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px' }}><PlusCircle style={{ color: 'var(--primary)' }} /> Launch New Grant</h3>
                <form onSubmit={createGrant} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Grant Title</label>
                    <input type="text" className="glass-input" placeholder="e.g. Hydroponics Research Funding" value={grantTitle} onChange={e=>setGrantTitle(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Total Fund (LKR)</label>
                      <input type="number" className="glass-input" placeholder="500000" value={grantFund} onChange={e=>setGrantFund(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Application Deadline</label>
                      <input type="date" className="glass-input" value={grantDeadline} onChange={e=>setGrantDeadline(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Description & Scope</label>
                    <textarea className="glass-input" style={{ minHeight: '80px' }} placeholder="Specify application details..." value={grantDesc} onChange={e=>setGrantDesc(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px' }}>Publish Grant Offering</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: DISEASE ALERTS */}
          {activeTab === 'alerts' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert style={{ color: 'var(--accent)' }} /> Active Disease Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {alerts.length > 0 ? (
                    alerts.map((al) => (
                      <div key={al._id} style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700', color: '#fca5a5' }}>{al.diseaseName} ({al.crop})</h4>
                          <span className="badge badge-danger">{al.severity}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>{al.description}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 Target Region: {al.region} | Date: {al.alertDate}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No disease outbreaks recorded.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle style={{color: 'var(--accent)'}} /> Post Disease Outbreak Alert</h3>
                <form onSubmit={createAlert} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Target Crop</label>
                      <input type="text" className="glass-input" placeholder="e.g. Tea Leaves" value={alertCrop} onChange={e=>setAlertCrop(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Disease Name</label>
                      <input type="text" className="glass-input" placeholder="e.g. Blister Blight" value={alertDisease} onChange={e=>setAlertDisease(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Affected Region</label>
                      <input type="text" className="glass-input" placeholder="e.g. Nuwara Eliya" value={alertRegion} onChange={e=>setAlertRegion(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Severity Level</label>
                      <select className="glass-input" value={alertSeverity} onChange={e=>setAlertSeverity(e.target.value)}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Remedial Actions / Warning Details</label>
                    <textarea className="glass-input" style={{ minHeight: '80px' }} placeholder="Specify fungicides or containment actions..." value={alertDesc} onChange={e=>setAlertDesc(e.target.value)} required />
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💡 Posting this will broadcast an SMS notification to all registered farmers via the Notification service.
                  </div>

                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent) 0%, #b91c1c 100%)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Send size={16} /> Broadcast Emergency Alert
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: REGULATIONS */}
          {activeTab === 'regulations' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText style={{ color: 'var(--primary)' }} /> Crop Regulations Directory
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {regulations.length > 0 ? (
                    regulations.map((rg) => (
                      <div key={rg._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700' }}>{rg.title}</h4>
                          <span className="badge badge-warning">{rg.category}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{rg.description}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Effective Enforcement Date: {rg.effectiveDate}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No regulations posted.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px' }}><PlusCircle style={{ color: 'var(--primary)' }} /> Post Regulation</h3>
                <form onSubmit={createRegulation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Regulation Title</label>
                    <input type="text" className="glass-input" placeholder="e.g. Organic Export Certification Standards" value={regTitle} onChange={e=>setRegTitle(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Category</label>
                      <select className="glass-input" value={regCategory} onChange={e=>setRegCategory(e.target.value)}>
                        <option value="Chemicals">Pesticides & Chemicals</option>
                        <option value="Logistics">Logistics & Packaging</option>
                        <option value="Pricing">Minimum Crop Prices</option>
                        <option value="Organic">Organic Standards</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Effective Date</label>
                      <input type="date" className="glass-input" value={regDate} onChange={e=>setRegDate(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Regulation Clauses & Description</label>
                    <textarea className="glass-input" style={{ minHeight: '80px' }} placeholder="Specify compliance standards and enforcement procedures..." value={regDesc} onChange={e=>setRegDesc(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px' }}>Enact Legal Regulation</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(7, 10, 19, 0.8)', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        padding: '15px', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        AgriChain Government Service Console • connected to MongoDB govt_db
      </footer>
    </div>
  );
}
