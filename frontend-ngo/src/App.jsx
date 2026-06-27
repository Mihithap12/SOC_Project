import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, BookOpen, GraduationCap, ClipboardCheck, 
  PlusCircle, RefreshCw, Send, CheckCircle2, UserCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('trainings');
  const [trainings, setTrainings] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [requests, setRequests] = useState([]);

  // Form states
  const [trainTitle, setTrainTitle] = useState('');
  const [trainTrainer, setTrainTrainer] = useState('');
  const [trainDate, setTrainDate] = useState('');
  const [trainLoc, setTrainLoc] = useState('');
  const [trainMax, setTrainMax] = useState('');
  const [trainDesc, setTrainDesc] = useState('');

  const [advTitle, setAdvTitle] = useState('');
  const [advAuthor, setAdvAuthor] = useState('');
  const [advTopic, setAdvTopic] = useState('Crop Yield');
  const [advContent, setAdvContent] = useState('');

  // Status logs
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const trainRes = await fetch('http://localhost:8092/api/training');
      if (trainRes.ok) setTrainings(await trainRes.json());

      const advRes = await fetch('http://localhost:8092/api/advisories');
      if (advRes.ok) setAdvisories(await advRes.json());

      const reqRes = await fetch('http://localhost:8092/api/assistance');
      if (reqRes.ok) setRequests(await reqRes.json());
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to connect to NGO NodeJS backend (Port 8092).' });
    }
  };

  const createTraining = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8092/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trainTitle,
          trainer: trainTrainer,
          date: trainDate,
          location: trainLoc,
          maxAttendees: parseInt(trainMax),
          registeredCount: 0,
          description: trainDesc
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Training program scheduled successfully!' });
        setTrainTitle('');
        setTrainTrainer('');
        setTrainDate('');
        setTrainLoc('');
        setTrainMax('');
        setTrainDesc('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to schedule workshop' });
    }
  };

  const createAdvisory = async (e) => {
    e.preventDefault();
    try {
      const datePublished = new Date().toISOString().split('T')[0];
      const res = await fetch('http://localhost:8092/api/advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: advTitle,
          author: advAuthor,
          topic: advTopic,
          content: advContent,
          datePublished
        })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: 'Advisory bulletin published successfully!' });
        setAdvTitle('');
        setAdvAuthor('');
        setAdvContent('');
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to publish bulletin' });
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8092/api/assistance/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: `Assistance request updated to: ${status}!` });
        fetchData();
      }
    } catch (err) {
      setStatusMsg({ type: 'danger', text: 'Failed to update assistance request' });
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
          <HeartHandshake size={24} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.02em' }} className="text-gradient">AgriChain NGO Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={fetchData} className="glass-input" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <RefreshCw size={12} /> Sync Data
          </button>
          <span className="badge badge-info">NGO Services Hub</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="dashboard-grid fade-in">
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <HeartHandshake size={40} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <p style={{ fontWeight: '700' }}>Extension Officers</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SUPPORTING SMALLHOLDERS</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <button onClick={() => setActiveTab('trainings')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'trainings' ? '1px solid var(--primary)' : '' }}>
              🎓 Training Programs
            </button>
            <button onClick={() => setActiveTab('advisories')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'advisories' ? '1px solid var(--primary)' : '' }}>
              📖 Crop Advisories
            </button>
            <button onClick={() => setActiveTab('requests')} className="glass-input" style={{ textAlign: 'left', cursor: 'pointer', border: activeTab === 'requests' ? '1px solid var(--primary)' : '' }}>
              🙋 Farm Assistance
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

          {/* TAB 1: TRAININGS */}
          {activeTab === 'trainings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap style={{ color: 'var(--primary)' }} /> Scheduled Training Programs
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {trainings.length > 0 ? (
                    trainings.map((tr) => (
                      <div key={tr._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700' }}>{tr.title}</h4>
                          <span className="badge badge-success">{tr.registeredCount} / {tr.maxAttendees} Enrolled</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{tr.description}</p>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <p>👤 Trainer: {tr.trainer}</p>
                          <p>📍 Location: {tr.location}</p>
                          <p>📅 Schedule: {tr.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No training programs active in MongoDB.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px' }}><PlusCircle style={{ color: 'var(--primary)' }} /> Schedule Workshop</h3>
                <form onSubmit={createTraining} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Workshop Title</label>
                    <input type="text" className="glass-input" placeholder="e.g. Modern Soil Nutrients" value={trainTitle} onChange={e=>setTrainTitle(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Lead Extension Officer / Trainer</label>
                    <input type="text" className="glass-input" placeholder="Dr. S. K. Alwis" value={trainTrainer} onChange={e=>setTrainTrainer(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Workshop Date</label>
                      <input type="date" className="glass-input" value={trainDate} onChange={e=>setTrainDate(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Max Attendees</label>
                      <input type="number" className="glass-input" placeholder="30" value={trainMax} onChange={e=>setTrainMax(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Venue Location</label>
                    <input type="text" className="glass-input" placeholder="e.g. Nuwara Eliya Field Center" value={trainLoc} onChange={e=>setTrainLoc(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Program Content / Description</label>
                    <textarea className="glass-input" style={{ minHeight: '80px' }} placeholder="Detail curriculum details..." value={trainDesc} onChange={e=>setTrainDesc(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px' }}>Launch Extension Program</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: ADVISORIES */}
          {activeTab === 'advisories' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }} className="fade-in">
              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen style={{ color: 'var(--primary)' }} /> Extension Advisories & Guidelines
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '450px', overflowY: 'auto' }}>
                  {advisories.length > 0 ? (
                    advisories.map((ad) => (
                      <div key={ad._id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ fontWeight: '700' }}>{ad.title}</h4>
                          <span className="badge badge-info">{ad.topic}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontStyle: 'italic' }}>
                          "{ad.content}"
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Author: {ad.author}</span>
                          <span>Published: {ad.datePublished}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No advisories active.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ marginBottom: '20px' }}><PlusCircle style={{ color: 'var(--primary)' }} /> Publish Advisory Bulletin</h3>
                <form onSubmit={createAdvisory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Bulletin Title</label>
                    <input type="text" className="glass-input" placeholder="e.g. Managing Monsoonal Soil Erosion" value={advTitle} onChange={e=>setAdvTitle(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Author</label>
                      <input type="text" className="glass-input" placeholder="e.g. S. Jayasekara" value={advAuthor} onChange={e=>setAdvAuthor(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label>Focus Topic</label>
                      <select className="glass-input" value={advTopic} onChange={e=>setAdvTopic(e.target.value)}>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Fertilization">Fertilization</option>
                        <option value="Weeding">Weeding & Pruning</option>
                        <option value="Soil Health">Soil Health</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label>Advisory Content</label>
                    <textarea className="glass-input" style={{ minHeight: '120px' }} placeholder="Provide actionable farming guidelines..." value={advContent} onChange={e=>setAdvContent(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px' }}>Publish Advisory Brief</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: ASSISTANCE REQUESTS */}
          {activeTab === 'requests' && (
            <div className="glass-panel fade-in">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClipboardCheck style={{ color: 'var(--success)' }} /> Farmer Assistance Requests Registry
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '480px', overflowY: 'auto' }}>
                {requests.length > 0 ? (
                  requests.map((r) => (
                    <div key={r._id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontWeight: '700' }}>Request from Farmer #{r.farmerId}</h4>
                        <span className={`badge ${
                          r.status === 'COMPLETED' ? 'badge-success' : 
                          r.status === 'APPROVED' ? 'badge-info' : 'badge-warning'
                        }`}>{r.status}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '10px 0' }}>
                        <strong>Details:</strong> {r.requestDetails}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Request Date: {r.requestDate}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {r.status === 'PENDING' && (
                            <button 
                              onClick={() => updateRequestStatus(r._id, 'APPROVED')}
                              className="btn-gradient-primary" 
                              style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', width: 'auto' }}
                            >
                              Approve Request
                            </button>
                          )}
                          {r.status === 'APPROVED' && (
                            <button 
                              onClick={() => updateRequestStatus(r._id, 'COMPLETED')}
                              className="btn-gradient-primary" 
                              style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', width: 'auto', background: 'linear-gradient(135deg, var(--success) 0%, #065f46 100%)', color: 'white' }}
                            >
                              Mark Completed
                            </button>
                          )}
                          <span style={{marginLeft: '15px'}}>Farmer Name: {r.farmerName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No assistance requests submitted by farmers.</p>
                )}
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
        AgriChain NGO Services Center • connected to MongoDB ngo_db
      </footer>
    </div>
  );
}
