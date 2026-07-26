import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Calculator, Calendar, Plane, Ship, Truck, ArrowRight, 
  MapPin, Scale, ChevronRight, CheckCircle2, Shield, Globe, Cpu 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // Tracking State
  const [trackingId, setTrackingId] = useState('');
  const [trackError, setTrackError] = useState('');

  // Rate Calculator State
  const [calcData, setCalcData] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    serviceType: 'standard'
  });
  const [estimatedCost, setEstimatedCost] = useState(null);

  // Global Schedules State (Filter tab)
  const [scheduleFilter, setScheduleFilter] = useState('all');

  const dummySchedules = [
    { type: 'air', carrier: 'SF-Flight 882', origin: 'Hong Kong (HKG)', dest: 'Los Angeles (LAX)', time: '14 hrs', status: 'In Transit', speed: 'Air Freight' },
    { type: 'sea', carrier: 'Pacific Star V2', origin: 'Shanghai (PVG)', dest: 'Rotterdam (RTM)', time: '18 Days', status: 'On Schedule', speed: 'Ocean Cargo' },
    { type: 'air', carrier: 'SF-Flight 104', origin: 'London (LHR)', dest: 'New York (JFK)', time: '8 hrs', status: 'Boarding Cargo', speed: 'Air Freight' },
    { type: 'sea', carrier: 'Atlantic Titan', origin: 'Hamburg (HAM)', dest: 'Newark (EWR)', time: '10 Days', status: 'Customs Hold', speed: 'Ocean Cargo' },
    { type: 'sea', carrier: 'Indian Ocean Rider', origin: 'Singapore (SIN)', dest: 'Dubai (DXB)', time: '6 Days', status: 'Departed Port', speed: 'Ocean Cargo' },
  ];

  // Handlers
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setTrackError('Please input a valid tracking code.');
      return;
    }
    setTrackError('');
    navigate(`/track?code=${encodeURIComponent(trackingId.trim())}`);
  };

  const handleCalcChange = (e) => {
    const { name, value } = e.target;
    setCalcData(prev => ({ ...prev, [name]: value }));
  };

  const calculateRates = (e) => {
    e.preventDefault();
    const { weight, length, width, height, serviceType } = calcData;
    if (!weight || !length || !width || !height) {
      alert('Please fill out all package dimensions.');
      return;
    }
    
    // Standard volumetric formula: (L x W x H) / 5000
    const volWeight = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
    const billableWeight = Math.max(parseFloat(weight), volWeight);
    
    let baseRate = 12.5; // Base price
    let multiplier = serviceType === 'express' ? 2.5 : serviceType === 'eco' ? 0.8 : 1.2;
    const calculated = billableWeight * baseRate * multiplier;
    
    setEstimatedCost(calculated.toFixed(2));
  };

  const filteredSchedules = scheduleFilter === 'all' 
    ? dummySchedules 
    : dummySchedules.filter(s => s.type === scheduleFilter);

  return (
    <div className="space-y-24 pb-24 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Glow Orbs in Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute -top-12 left-10 w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content (left column) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow text-xs md:text-sm font-semibold tracking-wide uppercase">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
              </span>
              Enterprise Logistics Platform
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gradient leading-none tracking-tight">
              Directing Global <br />
              <span className="text-brand-yellow">Cargo Flow</span> In Real-Time
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect freight operations, dispatch schedules, and real-time shipment monitoring in a single high-availability logistics platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => navigate('/book')}
                className="btn-primary"
              >
                Book a Shipment
                <ArrowRight size={18} />
              </button>
              <a 
                href="#quick-track"
                className="btn-secondary"
              >
                Track Live Shipment
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-brand-border/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-white">99.8%</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">On-Time Delivery</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-white">12.4M</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Tons Coordinated</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-white">&lt; 15m</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Dispatch Response</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration / Dashboard Preview (right column) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="glass-card p-6 rounded-2xl relative shadow-premium border border-brand-border/80 overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-xs text-slate-500 font-mono">shipflowx-ops-console</span>
              </div>

              {/* Simulated Log Output */}
              <div className="space-y-3 font-mono text-xs text-slate-400">
                <p className="text-brand-yellow font-bold">&gt; Initializing Global Port Sync...</p>
                <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-brand-border/40">
                  <span>⚓ ROTTERDAM PORT LOGS:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">CONNECTED</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-brand-border/40">
                  <span>✈️ JFK INBOUND FREIGHT:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">SYNCED</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-brand-border/40">
                  <span>🚢 TOKYO CONTAINER TERMINAL:</span>
                  <span className="text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded">DEPARTED</span>
                </div>
                <p className="text-slate-500 text-[10px] mt-4">SYS-STATUS: Active. Listening on port 5000...</p>
              </div>

              {/* Graphic Flow Route Overlay */}
              <div className="mt-6 border-t border-brand-border pt-4">
                <h5 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Active Fleet Status</h5>
                <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                  <span>Vessel Alpha</span>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-yellow h-full w-[70%]"></div>
                  </div>
                  <span className="text-brand-yellow font-semibold">70%</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 text-slate-300">
                  <span>Flight Cargo 12</span>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-yellow h-full w-[45%]"></div>
                  </div>
                  <span className="text-brand-yellow font-semibold">45%</span>
                </div>
              </div>
            </div>

            {/* Glowing Accent Ring behind card */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-yellow to-blue-500 opacity-20 blur-md -z-20"></div>
          </div>
        </div>
      </section>

      {/* 2. TRACK SHIPMENT QUICK FORM */}
      <section id="quick-track" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-brand-border relative shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Track Your Consignment</h2>
              <p className="text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
                Enter your unique tracking code to view the live GPS timeline, transit nodes, and estimated delivery windows.
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Shipment ID (e.g. SFX-1002468)..."
                    className="input-field pl-12 py-3.5"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-8 py-3.5"
                >
                  Locate Shipment
                </button>
              </form>
              {trackError && <p className="text-red-400 text-xs mt-2 ml-1">{trackError}</p>}
              <p className="text-xs text-slate-500 mt-3 ml-1">
                Demo Code: <span className="text-brand-yellow font-semibold cursor-pointer underline" onClick={() => setTrackingId('SFX-1002468')}>SFX-1002468</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RATE CALCULATOR WIDGET */}
      <section id="quick-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Instant Rate Estimator</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm md:text-base">
            Get instant quote feedback on global parcel services. Enter weight and dimensions to simulate tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-xl border border-brand-border shadow-md">
            <form onSubmit={calculateRates} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Weight (kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="number"
                      name="weight"
                      value={calcData.weight}
                      onChange={handleCalcChange}
                      placeholder="e.g. 15.5"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Service Priority</label>
                  <select
                    name="serviceType"
                    value={calcData.serviceType}
                    onChange={handleCalcChange}
                    className="input-field focus:ring-0"
                  >
                    <option value="standard">Standard Cargo (Air/Ocean)</option>
                    <option value="express">Express Delivery (Priority Air)</option>
                    <option value="eco">Saver Saver (Eco Route)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Dimensions (L x W x H in cm)</label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="length"
                    placeholder="Length"
                    value={calcData.length}
                    onChange={handleCalcChange}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="Width"
                    value={calcData.width}
                    onChange={handleCalcChange}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height"
                    value={calcData.height}
                    onChange={handleCalcChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3"
              >
                <Calculator size={18} />
                Calculate Estimated Fare
              </button>
            </form>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-brand-card to-brand-dark p-8 rounded-xl border border-brand-border h-full flex flex-col justify-between shadow-premium relative overflow-hidden min-h-[320px]">
            {estimatedCost ? (
              <div className="space-y-6 my-auto text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Quote Generated
                </span>
                <p className="text-slate-400 text-sm">Your estimated logistics rate is</p>
                <h3 className="text-5xl font-black text-brand-yellow font-sans">${estimatedCost}</h3>
                <p className="text-slate-500 text-xs leading-relaxed px-4">
                  *This rate is simulated and depends on standard volumetric sizing factors. Excludes custom import duties.
                </p>
                <button 
                  onClick={() => navigate('/book')}
                  className="btn-primary mx-auto mt-4 px-6 text-sm"
                >
                  Proceed with Booking
                </button>
              </div>
            ) : (
              <div className="text-center my-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center mx-auto text-brand-yellow animate-pulse-slow">
                  <Calculator size={32} />
                </div>
                <h4 className="text-white font-bold text-lg">No Calculation Yet</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Provide package dimensions and weight on the left to review real-time tariff projections.
                </p>
              </div>
            )}
            
            {/* Background Glow */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-brand-yellow/10 rounded-full blur-[40px] pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* 4. GLOBAL SCHEDULES HUB */}
      <section id="global-schedules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Global Dispatch Schedules</h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Track real-time scheduled arrivals and departures across active air freight and ocean liners.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex border border-brand-border bg-brand-card p-1 rounded-lg shrink-0">
            {['all', 'air', 'sea'].map(tab => (
              <button
                key={tab}
                onClick={() => setScheduleFilter(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  scheduleFilter === tab 
                    ? 'bg-brand-yellow text-brand-dark' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Transports' : tab === 'air' ? 'Air Freight' : 'Ocean Cargo'}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Cards/List */}
        <div className="glass-card rounded-xl border border-brand-border overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-card/70 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Liner/Flight ID</th>
                  <th className="py-4 px-6">Transport Type</th>
                  <th className="py-4 px-6">Origin</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Est. Duration</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-slate-300 text-sm">
                {filteredSchedules.map((item, idx) => (
                  <tr key={idx} className="hover:bg-brand-card/45 transition-colors">
                    <td className="py-4.5 px-6 font-bold text-white flex items-center gap-2">
                      {item.type === 'air' ? <Plane size={15} className="text-brand-yellow" /> : <Ship size={15} className="text-blue-400" />}
                      {item.carrier}
                    </td>
                    <td className="py-4.5 px-6 text-slate-400 text-xs uppercase tracking-wider">{item.speed}</td>
                    <td className="py-4.5 px-6 font-semibold">{item.origin}</td>
                    <td className="py-4.5 px-6 font-semibold">{item.dest}</td>
                    <td className="py-4.5 px-6 text-slate-400">{item.time}</td>
                    <td className="py-4.5 px-6 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'In Transit' || item.status === 'On Schedule' || item.status === 'Departed Port'
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. FEATURES / BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Logistics Performance Suite</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-2 text-sm md:text-base">
            Our platform guarantees maximum cargo visibility and security at every checkpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Globe className="text-brand-yellow" size={28} />, 
              title: "Global Supply Coverage", 
              desc: "Seamlessly cross international borders with automated manifest filings and transit node synchronization." 
            },
            { 
              icon: <Cpu className="text-brand-yellow" size={28} />, 
              title: "Smart Route Optimization", 
              desc: "Predict delays from adverse weather or customs backlogs and adjust delivery dispatches dynamically." 
            },
            { 
              icon: <Shield className="text-brand-yellow" size={28} />, 
              title: "End-to-End Security", 
              desc: "Rest assured that all logs are encrypted, shipment milestones verified, and transactions guarded via tokenization." 
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-8 rounded-xl border border-brand-border hover:border-brand-yellow/30 transition-all duration-300 relative group">
              <div className="w-14 h-14 rounded-lg bg-slate-900 border border-brand-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
