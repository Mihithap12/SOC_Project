import React, { useState, useEffect, useRef } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import VegetablePrices from "./components/VegetablePrices";
import FeedbackSection from "./components/FeedbackSection";
import CropGuides from "./components/CropGuides";
import YieldForecaster from "./components/YieldForecaster";
import farmBg from "./assets/smart-farm.jpg";
import { TypeAnimation } from "react-type-animation";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Info,
  Star,
  ChevronRight,
  User,
  Sun,
  Moon,
  BookOpen,
  Calculator,
  CloudSun,
  Users,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  Truck,
  Landmark,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("landing"); // landing, prices, feedbacks, dashboard
  const [theme, setTheme] = useState("dark");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login or register

  const guidesRef = useRef(null);
  const forecasterRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Initialize theme and login state
  useEffect(() => {
    // Check theme
    const savedTheme = localStorage.getItem("greenchain_theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Check auth
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("user_role");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const fullName = localStorage.getItem("full_name");

    if (token && role && userId && username) {
      setUser({ token, role, userId: parseInt(userId), username, fullName });
      setCurrentView("dashboard");
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("greenchain_theme", nextTheme);
  };

  const handleLoginSuccess = (loginData) => {
    setUser(loginData);
    setIsLoginModalOpen(false);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentView("landing");
  };

  const scrollToSection = (ref) => {
    setCurrentView("landing");
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  return (
    <div
      className="agri-bg-overlay"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Sticky Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "var(--glass-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--glass-border)",
          padding: "12px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        {/* Logo and Brand Title */}
        <div
          onClick={() => setCurrentView(user ? "dashboard" : "landing")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            style={{ width: "34px", height: "34px" }}
          >
            <rect
              width="100"
              height="100"
              rx="28"
              fill="var(--primary-glow)"
              stroke="var(--primary)"
              strokeWidth="6"
            />
            <path
              d="M30,50 C30,38 42,26 50,20 C58,26 70,38 70,50 C70,62 58,74 50,80 C42,74 30,62 30,50 Z"
              fill="var(--primary)"
            />
            <circle cx="50" cy="50" r="10" fill="var(--bg-primary)" />
            <circle cx="50" cy="50" r="5" fill="var(--secondary)" />
          </svg>
          <span
            style={{
              fontWeight: "800",
              fontSize: "1.4rem",
              letterSpacing: "-0.02em",
            }}
            className="text-gradient"
          >
            GreenChain
          </span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          {user ? (
            <span
              className={`nav-link ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentView("dashboard")}
            >
              Dashboard
            </span>
          ) : (
            <>
              <span
                className="nav-link"
                onClick={() => scrollToSection(featuresRef)}
              >
                Features
              </span>
              <span
                className={`nav-link ${currentView === "prices" ? "active" : ""}`}
                onClick={() => setCurrentView("prices")}
              >
                Prices
              </span>
              <span
                className="nav-link"
                onClick={() => scrollToSection(aboutRef)}
              >
                About
              </span>
              <span
                className="nav-link"
                onClick={() => scrollToSection(contactRef)}
              >
                Contact
              </span>
            </>
          )}
        </nav>

        {/* Right Side Actions (Theme Toggle & Account login/logout) */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Theme Toggler Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--glass-border)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
              transition: "background 0.2s ease",
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} style={{ color: "var(--warning)" }} />
            ) : (
              <Moon size={18} style={{ color: "var(--accent)" }} />
            )}
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                  {user.fullName || user.username}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--primary)",
                    fontWeight: "bold",
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-gradient-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                  boxShadow: "0 4px 10px rgba(239, 68, 68, 0.2)",
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setIsLoginModalOpen(true);
              }}
              className="btn-navbar-login"
            >
              <LogIn size={15} /> Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {currentView === "landing" && !user && (
          <div className="fade-in">
            {/* HERO SECTION */}
            <section
              className="landing-hero"
              style={{
                backgroundImage: `url(${farmBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
              }}
            >
              <div className="hero-overlay"></div>

              <div className="hero-container">
                {/* Left Column - Floating Cards */}
                <div className="hero-left-column">
                  <div className="floating-card">
                    <div className="card-icon-wrapper icon-wrapper-prices">
                      <DollarSign size={20} />
                    </div>
                    <div className="card-text-wrapper">
                      <span className="card-text-title">Real-time</span>
                      <span className="card-text-subtitle">Daily Prices</span>
                    </div>
                  </div>

                  <div className="floating-card">
                    <div className="card-icon-wrapper icon-wrapper-marketplace">
                      <ShoppingCart size={20} />
                    </div>
                    <div className="card-text-wrapper">
                      <span className="card-text-title">Direct</span>
                      <span className="card-text-subtitle">Marketplace</span>
                    </div>
                  </div>
                </div>

                {/* Center Column - Hero Title & Description */}
                <div className="hero-center-column">
                  <div className="hero-badge">
                    <span>✨ The #1 App for Sri Lankan Farmers</span>
                  </div>

                  <h1 className="hero-title">
                    Empowering
                    <br />
                    <TypeAnimation
                      sequence={[
                        "Fair",
                        2000,
                        "Growth",
                        2000,
                        "Better Harvests",
                        2000,
                        "Farming Communities",
                        2000,
                      ]}
                      wrapper="span"
                      repeat={Infinity}
                    />
                  </h1>

                  <p
                    style={{
                      fontSize: "1.15rem",
                      color: "var(--text-secondary)",
                      maxWidth: "600px",
                      lineHeight: "1.6",
                      marginBottom: "35px",
                    }}
                  >
                    From real-time vegetable prices to expert crop advice,
                    GreenChain connects you to the heartbeat of the nation's
                    farming community.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      position: "relative",
                      zIndex: 5,
                    }}
                  >
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setIsLoginModalOpen(true);
                      }}
                      className="btn-gradient-primary"
                      style={{
                        padding: "14px 28px",
                        fontSize: "1rem",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Join Now <ChevronRight size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setIsLoginModalOpen(true);
                      }}
                      className="glass-input"
                      style={{
                        padding: "14px 28px",
                        fontSize: "1rem",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        background: "rgba(255,255,255,0.02)",
                        color: "var(--text-primary)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      Member Login
                    </button>
                  </div>
                </div>

                {/* Right Column - Floating Cards */}
                <div className="hero-right-column">
                  <div className="floating-card">
                    <div className="card-icon-wrapper icon-wrapper-community">
                      <Users size={20} />
                    </div>
                    <div className="card-text-wrapper">
                      <span className="card-text-title">5,000+</span>
                      <span className="card-text-subtitle">
                        Farmer Community
                      </span>
                    </div>
                  </div>

                  <div className="floating-card">
                    <div className="card-icon-wrapper icon-wrapper-weather">
                      <CloudSun size={20} />
                    </div>
                    <div className="card-text-wrapper">
                      <span className="card-text-title">Live</span>
                      <span className="card-text-subtitle">
                        Weather Forecast
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bounce Down Chevron */}
              <div
                className="hero-chevron-down"
                onClick={() => scrollToSection(guidesRef)}
              >
                <ChevronDown size={32} />
              </div>
            </section>

            {/* CROP CULTIVATION GUIDES SECTION */}
            <section
              id="guides"
              ref={guidesRef}
              style={{
                borderTop: "1px solid var(--glass-border)",
                background: "var(--bg-secondary)",
                padding: "20px 0",
              }}
            >
              <CropGuides />
            </section>

            {/* YIELD & PRICE FORECASTER SECTION */}
            <section
              id="forecaster"
              ref={forecasterRef}
              style={{
                borderTop: "1px solid var(--glass-border)",
                padding: "20px 0",
              }}
            >
              <YieldForecaster />
            </section>

            {/* CORE SERVICES SECTION */}
            <section
              id="features"
              ref={featuresRef}
              style={{
                borderTop: "1px solid var(--glass-border)",
                background: "var(--bg-secondary)",
                padding: "60px 0",
              }}
            >
              <div className="landing-section">
                <h2 className="section-title text-gradient">
                  Core Platform Services
                </h2>
                <div className="features-grid">
                  {/* Card 1: Daily Market Prices */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--primary-glow)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DollarSign style={{ color: "var(--primary)" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Daily Market Prices
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Real-time vegetable and crop commodity price tracking across regional Sri Lankan economic hubs. Updates daily to ensure open and fair trade.
                    </p>
                  </div>

                  {/* Card 2: Weather Forecasts */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(59, 130, 246, 0.15)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CloudSun style={{ color: "#3b82f6" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Weather Forecasts
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Hyper-local agrometeorological forecasting and severe weather alerts. Get tailored planting guidelines based on your local coordinates.
                    </p>
                  </div>

                  {/* Card 3: Financial Tracking */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(139, 92, 246, 0.15)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Calculator style={{ color: "var(--accent)" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Financial Tracking
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Log fertilizer costs, seed purchases, and crop sales. Keep a simple, secure digital ledger of your farm's income and expenditures.
                    </p>
                  </div>

                  {/* Card 4: Training Programs */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(245, 158, 11, 0.15)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <BookOpen style={{ color: "#f59e0b" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Training Programs
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Register for agricultural workshops and sustainable farming seminars. Learn crop disease management and optimization from NGO experts.
                    </p>
                  </div>

                  {/* Card 5: Transport Services */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(6, 182, 212, 0.15)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Truck style={{ color: "var(--secondary)" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Transport Services
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Coordinate logistics and book cargo transport providers. Secure, saga-compensated freight routes to move your produce to wholesalers.
                    </p>
                  </div>

                  {/* Card 6: Government Subsidies */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Landmark style={{ color: "#ef4444" }} />
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                      Government Subsidies & Grants
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Access active fertilizer subsidies, crop insurance schemes, and farming equipment grants. Apply directly with digitized government documentation.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ABOUT US SECTION */}
            <section
              id="about"
              ref={aboutRef}
              style={{
                borderTop: "1px solid var(--glass-border)",
                padding: "60px 0",
              }}
            >
              <div className="landing-section">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "50px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--secondary)",
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Consortium Mission
                    </span>
                    <h2
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        lineHeight: "1.2",
                        margin: 0,
                      }}
                      className="text-gradient"
                    >
                      Empowering Sri Lankan Smallholders
                    </h2>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "1rem",
                        lineHeight: "1.6",
                      }}
                    >
                      GreenChain is a modern agricultural supply chain
                      consortium. By integrating government advisory units,
                      non-governmental training support, and real-time
                      logistical frameworks, we bring cutting edge stability and
                      profitability to local farmers and wholesale buyers.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "0.95rem",
                        }}
                      >
                        <ChevronRight
                          size={16}
                          style={{ color: "var(--primary)" }}
                        />{" "}
                        <strong>Direct Market Access</strong> - No broker
                        overheads.
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "0.95rem",
                        }}
                      >
                        <ChevronRight
                          size={16}
                          style={{ color: "var(--primary)" }}
                        />{" "}
                        <strong>Saga-Backed Transaction Security</strong> -
                        Risk-free procurement.
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "0.95rem",
                        }}
                      >
                        <ChevronRight
                          size={16}
                          style={{ color: "var(--primary)" }}
                        />{" "}
                        <strong>Weather & Disease Advisory Node</strong> -
                        Real-time risk mitigation.
                      </div>
                    </div>
                  </div>
                  <div
                    className="glass-panel"
                    style={{
                      padding: "30px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-15px",
                        right: "25px",
                        background: "var(--primary)",
                        color: "white",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      ACTIVE COMMUNITY
                    </div>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700" }}>
                      Platform Health Indicator
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginTop: "10px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: "800",
                            color: "var(--primary)",
                            margin: 0,
                          }}
                        >
                          4,200+
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Registered Farmers
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: "800",
                            color: "var(--secondary)",
                            margin: 0,
                          }}
                        >
                          280+
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Exporters & Buyers
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: "800",
                            color: "var(--accent)",
                            margin: 0,
                          }}
                        >
                          120,000
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Metric Tons Shipped
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: "800",
                            color: "var(--warning)",
                            margin: 0,
                          }}
                        >
                          99.8%
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Saga Completion Rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACT US SECTION */}
            <section
              id="contact"
              ref={contactRef}
              style={{
                borderTop: "1px solid var(--glass-border)",
                background: "var(--bg-secondary)",
                padding: "60px 0",
              }}
            >
              <div className="landing-section">
                <h2 className="section-title text-gradient">Contact Our Consortium</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "40px",
                    marginTop: "30px",
                  }}
                >
                  {/* Contact Info Card */}
                  <div
                    className="glass-panel"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px",
                      justifyContent: "center",
                    }}
                  >
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "10px" }}>
                      Get In Touch
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      Have questions about GreenChain? Whether you're a farmer, buyer, transport vendor, or government official, we're here to help streamline your operations.
                    </p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "var(--primary-glow)", color: "var(--primary)", padding: "10px", borderRadius: "10px" }}>
                          <Phone size={18} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Call Us</p>
                          <p style={{ fontSize: "0.95rem", fontWeight: "600", margin: 0 }}>+94 11 234 5678</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6", padding: "10px", borderRadius: "10px" }}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Email Support</p>
                          <p style={{ fontSize: "0.95rem", fontWeight: "600", margin: 0 }}>support@greenchain.lk</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "rgba(139, 92, 246, 0.15)", color: "var(--accent)", padding: "10px", borderRadius: "10px" }}>
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Headquarters</p>
                          <p style={{ fontSize: "0.95rem", fontWeight: "600", margin: 0 }}>Consortium Towers, Colombo 03, Sri Lanka</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form Card */}
                  <div className="glass-panel" style={{ padding: "30px" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "20px" }}>
                      Send Us a Message
                    </h3>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert("Thank you! Your message has been received.");
                        e.target.reset();
                      }}
                      style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Your Name</label>
                        <input type="text" className="glass-input" placeholder="John Doe" required />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email Address</label>
                        <input type="email" className="glass-input" placeholder="john@example.com" required />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Message</label>
                        <textarea 
                          className="glass-input" 
                          rows="4" 
                          placeholder="How can we assist you?" 
                          style={{ resize: "none", fontFamily: "inherit" }} 
                          required 
                        />
                      </div>
                      <button type="submit" className="btn-gradient-primary" style={{ padding: "12px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                        <Send size={16} /> Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === "prices" && <VegetablePrices />}

        {currentView === "feedbacks" && <FeedbackSection />}

        {currentView === "dashboard" && user && (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
      </main>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "480px",
              background: "var(--bg-primary)",
              padding: "20px",
            }}
          >
            <button
              className="modal-close"
              onClick={() => setIsLoginModalOpen(false)}
            >
              <X size={20} />
            </button>
            <div>
              <Login onLoginSuccess={handleLoginSuccess} initialRegister={authMode === "register"} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          background: "rgba(7, 10, 19, 0.85)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "25px",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#64748b",
        }}
      >
        GreenChain Microservices Consortium © 2026. Inspired by GoviSaviya.lk.
        Made with SpringBoot + React + NodeJS.
      </footer>
    </div>
  );
}

// X inline icon
function X({ size = 20, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
