import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Search, Package, MapPin, Map, Clock, ArrowRight, Loader2, 
  CheckCircle2, Compass, AlertCircle, Calendar, Truck
} from 'lucide-react';

const TrackShipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackingCodeFromUrl = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(trackingCodeFromUrl);
  const [loading, setLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  // Status mapping index
  const statusSteps = ['Booked', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered'];
  
  const getStepIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  const fetchTrackingDetails = async (code) => {
    if (!code) return;
    setLoading(true);
    setError('');
    setShipmentData(null);
    setLogs([]);

    try {
      const res = await api.get(`/api/shipments/track/${code.trim()}`);
      setShipmentData(res.data.data.shipment);
      setLogs(res.data.data.logs);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to locate tracking records for this code. Verify the waybill ID.');
    } finally {
      setLoading(false);
    }
  };

  // Run tracking lookup when URL query parameter updates
  useEffect(() => {
    if (trackingCodeFromUrl) {
      setInputCode(trackingCodeFromUrl);
      fetchTrackingDetails(trackingCodeFromUrl);
    }
  }, [trackingCodeFromUrl]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSearchParams({ code: inputCode.trim() });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Search Console Header */}
      <div className="text-center space-y-4">
        <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
          Radar Sync
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Live Consignment Tracking</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Input your waybill tracking code to check current transit nodes and routes.</p>
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-lg mx-auto pt-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter Waybill Code (e.g. SFX-0722223)..."
              className="input-field pl-11 py-3"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Track
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
          <Loader2 size={36} className="text-brand-yellow animate-spin" />
          <p className="text-slate-400 text-sm">Querying global transit logs...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="glass-card p-8 rounded-xl border border-red-500/20 text-center max-w-md mx-auto space-y-4 shadow-premium">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <h3 className="text-white font-bold text-lg">Shipment Not Located</h3>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      )}

      {/* Tracking Results Area */}
      {shipmentData && !loading && (
        <div className="space-y-10">
          
          {/* A. Dynamic Stepper Progress Bar */}
          <div className="glass-card p-6 md:p-8 rounded-xl border border-brand-border shadow-premium">
            <h3 className="text-white font-bold text-base mb-6 uppercase tracking-wider flex items-center gap-2">
              <Compass size={18} className="text-brand-yellow" />
              Route Progress
            </h3>
            
            <div className="flex justify-between items-center relative pt-4 overflow-x-auto min-w-[600px] pb-4">
              {statusSteps.map((status, idx) => {
                const currentStepIdx = getStepIndex(shipmentData.status);
                const isCompleted = currentStepIdx >= idx;
                const isActive = shipmentData.status === status;
                
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                      isCompleted && !isActive
                        ? 'bg-brand-yellow border-brand-yellow text-brand-dark shadow-glow-yellow'
                        : isActive
                        ? 'bg-slate-900 border-brand-yellow text-brand-yellow shadow-premium-glow animate-pulse-slow'
                        : 'bg-slate-900 border-brand-border text-slate-500'
                    }`}>
                      {status === 'Delivered' && isCompleted ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Truck size={16} />
                      )}
                    </div>
                    <span className={`text-[10px] uppercase font-black mt-2 tracking-wider ${
                      isActive ? 'text-brand-yellow' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {status}
                    </span>
                  </div>
                );
              })}
              
              {/* Progress Line */}
              <div className="absolute top-[34px] left-[10%] right-[10%] h-[1.5px] bg-brand-border -z-0"></div>
              <div 
                className="absolute top-[34px] left-[10%] h-[1.5px] bg-brand-yellow transition-all duration-300 -z-0"
                style={{ 
                  width: `${(Math.max(0, getStepIndex(shipmentData.status)) / 4) * 80}%` 
                }}
              ></div>
            </div>
          </div>

          {/* B. Two Column Layout: Details & Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Shipment Specs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 rounded-xl border border-brand-border shadow-md space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <Package size={16} className="text-brand-yellow" />
                  Shipment Details
                </h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Waybill ID:</span>
                    <span className="font-mono text-white font-bold">{shipmentData.trackingNumber}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Service Class:</span>
                    <span className="text-brand-yellow font-bold uppercase">{shipmentData.packageDetails?.serviceType}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Weight:</span>
                    <span className="font-semibold text-white">{shipmentData.packageDetails?.weight} kg</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="text-white">
                      {shipmentData.packageDetails?.length}x{shipmentData.packageDetails?.width}x{shipmentData.packageDetails?.height} cm
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Current Node:</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <MapPin size={12} className="text-brand-yellow" />
                      {shipmentData.currentAddress}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Billing:</span>
                    <span className="text-emerald-400 font-bold">
                      ${shipmentData.paymentDetails?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Sender & Receiver Address Cards */}
              <div className="glass-card p-6 rounded-xl border border-brand-border shadow-md space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
                  <Map size={16} className="text-brand-yellow" />
                  Routing Directory
                </h3>

                <div className="space-y-4">
                  {/* Origin */}
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-brand-yellow"></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Origin Node</h4>
                    <p className="text-slate-400 text-xs mt-1">{shipmentData.senderDetails?.city}, {shipmentData.senderDetails?.country}</p>
                    <p className="text-slate-500 text-[10px]">{shipmentData.senderDetails?.address}</p>
                  </div>
                  
                  {/* Destination */}
                  <div className="relative pl-6 border-l border-dashed border-brand-border ml-1.5 pb-2"></div>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Destination Node</h4>
                    <p className="text-slate-400 text-xs mt-1">{shipmentData.receiverDetails?.city}, {shipmentData.receiverDetails?.country}</p>
                    <p className="text-slate-500 text-[10px]">{shipmentData.receiverDetails?.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Transit History logs */}
            <div className="lg:col-span-7 glass-card p-6 rounded-xl border border-brand-border shadow-md space-y-6">
              <h3 className="text-white font-bold text-base border-b border-brand-border pb-3 flex items-center gap-2 uppercase tracking-wider">
                <Clock size={18} className="text-brand-yellow" />
                Transit Timeline Logs
              </h3>

              {logs.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No transit log coordinates logged yet.</p>
              ) : (
                <div className="space-y-8 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border">
                  {logs.map((log) => (
                    <div key={log._id} className="relative group">
                      {/* Bullet node indicator */}
                      <span className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-brand-yellow group-hover:scale-125 transition-transform"></span>
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{log.status}</h4>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-brand-yellow flex items-center gap-1 font-semibold">
                          <MapPin size={11} />
                          {log.location}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed pt-1">
                          {log.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TrackShipment;
