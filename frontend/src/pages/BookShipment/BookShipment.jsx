import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  User, MapPin, Package, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, 
  Loader2, Calculator, ShieldCheck, Mail, Phone
} from 'lucide-react';

const BookShipment = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Sender
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    senderCountry: '',
    senderZip: '',
    
    // Step 2: Receiver
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    receiverCity: '',
    receiverCountry: '',
    receiverZip: '',

    // Step 3: Package
    weight: '',
    length: '',
    width: '',
    height: '',
    serviceType: 'standard',
    description: 'General Freight',

    // Step 4: Payment Method
    paymentMethod: 'Credit Card (Simulated)'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate Price Dynamic formula
  const getCalculatedPrice = () => {
    const { weight, length, width, height, serviceType } = formData;
    if (!weight || !length || !width || !height) return 0;
    
    const volWeight = (parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000;
    const billableWeight = Math.max(parseFloat(weight), volWeight);
    
    let baseRate = 12.5; 
    let multiplier = serviceType === 'express' ? 2.5 : serviceType === 'eco' ? 0.8 : 1.2;
    return (billableWeight * baseRate * multiplier).toFixed(2);
  };

  // Step Navigations
  const nextStep = () => {
    // Basic validation per step
    if (step === 1) {
      const { senderName, senderPhone, senderEmail, senderAddress, senderCity, senderCountry, senderZip } = formData;
      if (!senderName || !senderPhone || !senderEmail || !senderAddress || !senderCity || !senderCountry || !senderZip) {
        setError('Please fill out all sender details.');
        return;
      }
    } else if (step === 2) {
      const { receiverName, receiverPhone, receiverEmail, receiverAddress, receiverCity, receiverCountry, receiverZip } = formData;
      if (!receiverName || !receiverPhone || !receiverEmail || !receiverAddress || !receiverCity || !receiverCountry || !receiverZip) {
        setError('Please fill out all receiver details.');
        return;
      }
    } else if (step === 3) {
      const { weight, length, width, height } = formData;
      if (!weight || !length || !width || !height) {
        setError('Please fill out all package dimensions.');
        return;
      }
    }
    
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const finalPayload = {
      senderDetails: {
        name: formData.senderName,
        phone: formData.senderPhone,
        email: formData.senderEmail,
        address: formData.senderAddress,
        city: formData.senderCity,
        country: formData.senderCountry,
        zip: formData.senderZip
      },
      receiverDetails: {
        name: formData.receiverName,
        phone: formData.receiverPhone,
        email: formData.receiverEmail,
        address: formData.receiverAddress,
        city: formData.receiverCity,
        country: formData.receiverCountry,
        zip: formData.receiverZip
      },
      packageDetails: {
        weight: parseFloat(formData.weight),
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        serviceType: formData.serviceType,
        description: formData.description
      },
      paymentDetails: {
        amount: parseFloat(getCalculatedPrice()),
        method: formData.paymentMethod
      }
    };

    try {
      const res = await api.post('/api/shipments', finalPayload);
      setSuccessData(res.data.data);
      setStep(5);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while saving shipment booking.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={36} className="text-brand-yellow animate-spin" />
        <p className="text-slate-400 text-sm">Validating clearance...</p>
      </div>
    );
  }

  const stepsLabel = ['Sender', 'Receiver', 'Specs', 'Billing', 'Status'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
          Cargo Booking
        </span>
        <h1 className="text-3xl font-black text-white mt-2">Book New Freight</h1>
        <p className="text-slate-400 text-sm mt-1">Submit shipping details to generate waybills and routes.</p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex justify-between items-center max-w-lg mx-auto relative pt-4">
        {stepsLabel.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;
          return (
            <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                isCompleted 
                  ? 'bg-brand-yellow border-brand-yellow text-brand-dark shadow-glow-yellow' 
                  : isActive
                  ? 'bg-slate-900 border-brand-yellow text-brand-yellow shadow-premium-glow'
                  : 'bg-slate-900 border-brand-border text-slate-500'
              }`}>
                {isCompleted ? <CheckCircle2 size={16} /> : stepNum}
              </div>
              <span className={`text-[10px] uppercase font-bold mt-2 tracking-wider ${
                isActive ? 'text-brand-yellow' : isCompleted ? 'text-slate-300' : 'text-slate-500'
              }`}>{label}</span>
            </div>
          );
        })}
        {/* Connector Line */}
        <div className="absolute top-[34px] left-[10%] right-[10%] h-[1px] bg-brand-border -z-0"></div>
        <div 
          className="absolute top-[34px] left-[10%] h-[1px] bg-brand-yellow transition-all duration-300 -z-0"
          style={{ width: `${(Math.min(step, 4) - 1) * 26.6}%` }}
        ></div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Steps Fields Wrapper */}
      <div className="glass-card p-6 md:p-8 rounded-xl border border-brand-border shadow-premium">
        
        {/* STEP 1: SENDER DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-brand-border pb-3">
              <User size={18} className="text-brand-yellow" />
              1. Sender Information (Origin)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Sender Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  placeholder="100 West Dr, Suite 50"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  name="senderCity"
                  value={formData.senderCity}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    name="senderCountry"
                    value={formData.senderCountry}
                    onChange={handleChange}
                    placeholder="USA"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Zip/Postal</label>
                  <input
                    type="text"
                    name="senderZip"
                    value={formData.senderZip}
                    onChange={handleChange}
                    placeholder="94103"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RECEIVER DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-brand-border pb-3">
              <MapPin size={18} className="text-brand-yellow" />
              2. Receiver Information (Destination)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Receiver Name</label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="text"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  placeholder="+44 20 7946 0958"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  placeholder="24 Parliament St"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">City</label>
                <input
                  type="text"
                  name="receiverCity"
                  value={formData.receiverCity}
                  onChange={handleChange}
                  placeholder="London"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    name="receiverCountry"
                    value={formData.receiverCountry}
                    onChange={handleChange}
                    placeholder="United Kingdom"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Zip/Postal</label>
                  <input
                    type="text"
                    name="receiverZip"
                    value={formData.receiverZip}
                    onChange={handleChange}
                    placeholder="SW1A 2NE"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PACKAGE DETAILS */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-brand-border pb-3">
              <Package size={18} className="text-brand-yellow" />
              3. Package Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Service Speed Priority</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="saver">Eco Saver (Economy Route)</option>
                  <option value="standard">Standard Cargo (Air/Sea Combo)</option>
                  <option value="express">Express Priority (Air Freight)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Package Dimensions (L x W x H in cm)</label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="length"
                    placeholder="Length"
                    value={formData.length}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="Width"
                    value={formData.width}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height"
                    value={formData.height}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Cargo Contents Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Computer hardware accessories..."
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BILLING & PAYMENT SIMULATION */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-brand-border pb-3">
              <CreditCard size={18} className="text-brand-yellow" />
              4. Payment & Booking Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left summary details */}
              <div className="md:col-span-7 space-y-4 text-sm text-slate-300">
                <div className="bg-slate-900/40 p-4 rounded-lg border border-brand-border">
                  <h4 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">Origin & Destination</h4>
                  <p className="flex justify-between"><span>Sender:</span> <span className="text-white font-medium">{formData.senderName} ({formData.senderCity})</span></p>
                  <p className="flex justify-between mt-1"><span>Receiver:</span> <span className="text-white font-medium">{formData.receiverName} ({formData.receiverCity})</span></p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-lg border border-brand-border">
                  <h4 className="text-white font-bold mb-2 text-xs uppercase tracking-wider">Package Specs</h4>
                  <p className="flex justify-between"><span>Weight:</span> <span className="text-white font-medium">{formData.weight} kg</span></p>
                  <p className="flex justify-between mt-1"><span>Dimensions:</span> <span className="text-white font-medium">{formData.length} x {formData.width} x {formData.height} cm</span></p>
                  <p className="flex justify-between mt-1"><span>Priority Level:</span> <span className="text-brand-yellow font-semibold uppercase">{formData.serviceType}</span></p>
                </div>
              </div>

              {/* Right cost estimation panel */}
              <div className="md:col-span-5 bg-gradient-to-br from-brand-card to-slate-950 p-6 rounded-lg border border-brand-border text-center shadow-lg relative overflow-hidden">
                <Calculator size={36} className="text-brand-yellow mx-auto mb-3 animate-pulse-slow" />
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Charges</span>
                <h3 className="text-4xl font-black text-brand-yellow font-sans mt-2">${getCalculatedPrice()}</h3>
                <p className="text-slate-500 text-[10px] leading-relaxed mt-2">Simulated payment process. Selecting pay will instantly book the cargo.</p>
                
                <div className="mt-6">
                  <label className="block text-left text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Simulated Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="input-field py-2 text-xs"
                  >
                    <option value="Credit Card (Simulated)">Credit Card (Simulated)</option>
                    <option value="Wire Transfer (Simulated)">Bank Wire (Simulated)</option>
                    <option value="Operational Account Billing">Ops Account Billing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: BOOKING CONFIRMATION */}
        {step === 5 && successData && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center mx-auto text-brand-yellow shadow-glow-yellow">
              <CheckCircle2 size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Booking Confirmed!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Cargo registration successful. The consignment waybill has been generated in our system.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-900/60 p-6 rounded-lg border border-brand-border text-sm space-y-3">
              <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
                <span className="text-slate-400 font-medium">Waybill / Tracking Code:</span>
                <span className="text-brand-yellow font-black tracking-wider text-base">{successData.trackingNumber}</span>
              </div>
              <div className="flex justify-between text-left mt-2">
                <span className="text-slate-400">Recipient City:</span>
                <span className="text-white font-semibold">{successData.receiverDetails?.city}, {successData.receiverDetails?.country}</span>
              </div>
              <div className="flex justify-between text-left mt-1">
                <span className="text-slate-400">Calculated Charge:</span>
                <span className="text-white font-semibold">${successData.paymentDetails?.amount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-sm mx-auto">
              <Link 
                to={`/track?code=${successData.trackingNumber}`}
                className="btn-primary"
              >
                Track Live Shipment
              </Link>
              <Link 
                to="/dashboard"
                className="btn-secondary"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Controls buttons (hide on Step 5) */}
        {step < 5 && (
          <div className="flex justify-between items-center border-t border-brand-border mt-8 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div></div> // Spacing
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Confirm & Settle Payment
                    <ShieldCheck size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BookShipment;
