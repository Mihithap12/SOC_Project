import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User, UserCheck, Award } from 'lucide-react';

const SEEDED_FEEDBACKS = [
  {
    id: 'f1',
    name: 'Bandara Herath',
    role: 'Farmer',
    location: 'Welimada',
    rating: 5,
    comment: 'GreenChain has completely transformed how I sell my potato harvests. By connecting directly with Colombo buyers, I avoid unfair middleman cuts and received 30% more profit this season!',
    date: '2026-06-10'
  },
  {
    id: 'f2',
    name: 'Nimal Silva (Cargills PLC)',
    role: 'Buyer',
    location: 'Colombo',
    rating: 5,
    comment: 'We use GreenChain to secure high-quality vegetables directly from smallholders. The transaction Saga ensures we only pay when inventory is locked, and transport tracking is seamlessly integrated.',
    date: '2026-06-08'
  },
  {
    id: 'f3',
    name: 'Priyantha Jayakody',
    role: 'Farmer',
    location: 'Nuwara Eliya',
    rating: 4,
    comment: 'The disease alert advisories are highly useful. I saved my cabbage patch from leaf-spot disease last week thanks to an early notification from the government extension node on GreenChain.',
    date: '2026-06-05'
  },
  {
    id: 'f4',
    name: 'Fathima Riza',
    role: 'Buyer',
    location: 'Galle',
    rating: 5,
    comment: 'Having a transparent live price index helps us budget our wholesale procurement easily. The system is fast, clean, and highly reliable. Highly recommended for agro-cooperatives.',
    date: '2026-06-01'
  }
];

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Farmer');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Load reviews from localStorage or initialize with seeded feedbacks
    const stored = localStorage.getItem('greenchain_feedbacks');
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    } else {
      setFeedbacks(SEEDED_FEEDBACKS);
      localStorage.setItem('greenchain_feedbacks', JSON.stringify(SEEDED_FEEDBACKS));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newFeedback = {
      id: 'f_' + Date.now(),
      name,
      role,
      location: location || 'Sri Lanka',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('greenchain_feedbacks', JSON.stringify(updated));

    // Reset form
    setName('');
    setLocation('');
    setRating(5);
    setComment('');
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  const renderStars = (count) => {
    return (
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= count ? 'var(--warning)' : 'none'}
            stroke={star <= count ? 'var(--warning)' : 'var(--text-muted)'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="landing-section fade-in">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }} className="text-gradient">Community Feedbacks</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Hear from the farmers, cooperatives, and buyers empowering Sri Lankan agriculture.</p>
      </div>

      <div className="feedback-grid">
        {/* Left Column: List of Feedbacks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            <MessageSquare style={{ color: 'var(--primary)' }} /> User Testimonials ({feedbacks.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
            {feedbacks.map((item) => (
              <div key={item.id} className="testimonial-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} style={{ color: 'var(--secondary)' }} /> {item.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{item.role}</span> &bull; 📍 {item.location}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    {renderStars(item.rating)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{item.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submit Feedback Form */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Award style={{ color: 'var(--secondary)' }} /> Leave Your Feedback
          </h3>

          {submitSuccess && (
            <div className="badge badge-success" style={{ display: 'flex', width: '100%', marginBottom: '20px', padding: '12px' }}>
              🎉 Thank you! Your feedback has been published.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                className="glass-input"
                placeholder="e.g. Priyantha Bandara"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>I am a...</label>
                <select
                  className="glass-input"
                  style={{ background: 'var(--bg-secondary)' }}
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Buyer">Buyer</option>
                  <option value="General Public">General Public</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Kandy"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? 'var(--warning)' : 'none'}
                      stroke={star <= rating ? 'var(--warning)' : 'var(--text-muted)'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Feedback / Comments</label>
              <textarea
                className="glass-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Share your experience with GreenChain..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-gradient-primary" style={{ padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
