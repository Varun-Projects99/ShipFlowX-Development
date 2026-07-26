import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, Scale, MoveRight, HelpCircle, Shield, Clock, Info, ArrowRight 
} from 'lucide-react';

const RateCalculator = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
  });

  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState({
    volumetricWeight: 0,
    billableWeight: 0,
    eco: 0,
    standard: 0,
    express: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const { weight, length, width, height } = formData;
    if (!weight || !length || !width || !height) return;

    const w = parseFloat(weight);
    const l = parseFloat(length);
    const wd = parseFloat(width);
    const h = parseFloat(height);

    // Standard volumetric divisor
    const volWeight = (l * wd * h) / 5000;
    const billable = Math.max(w, volWeight);

    // Rates package formulas
    const baseRate = 12.5;
    const ecoCost = billable * baseRate * 0.8;
    const standardCost = billable * baseRate * 1.2;
    const expressCost = billable * baseRate * 2.5;

    setResults({
      volumetricWeight: volWeight.toFixed(2),
      billableWeight: billable.toFixed(2),
      eco: ecoCost.toFixed(2),
      standard: standardCost.toFixed(2),
      express: expressCost.toFixed(2)
    });
    setCalculated(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
          Tariff Engine
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Freight Cost Calculator</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Calculate volumetric weight thresholds and compare standard, express, or eco cargo priority rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form specifications */}
        <div className="lg:col-span-5 glass-card p-6 rounded-xl border border-brand-border shadow-premium space-y-6">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <Calculator size={18} className="text-brand-yellow" />
            Cargo Specifications
          </h3>

          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Physical Weight (kg)
              </label>
              <div className="relative">
                <Scale className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="number"
                  name="weight"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Dimensions (Length x Width x Height in cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="length"
                  required
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="Length"
                  className="input-field text-center"
                />
                <input
                  type="number"
                  name="width"
                  required
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Width"
                  className="input-field text-center"
                />
                <input
                  type="number"
                  name="height"
                  required
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className="input-field text-center"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-4">
              Compute Rates
              <MoveRight size={18} />
            </button>
          </form>

          {/* Sizing Information card */}
          <div className="bg-slate-900/40 p-4 rounded-lg border border-brand-border flex gap-3 text-xs text-slate-400 leading-relaxed">
            <Info size={24} className="text-brand-yellow shrink-0 mt-0.5" />
            <p>
              Logistics carriers invoice based on the **chargeable weight** which is the greater value between the cargo's physical weight and its volumetric (dimensional) weight calculated by formula:
              <span className="block font-mono text-[10px] text-brand-yellow mt-1 font-bold">
                (Length x Width x Height) / 5000
              </span>
            </p>
          </div>
        </div>

        {/* Right Column: Comparative Results packages */}
        <div className="lg:col-span-7 space-y-6">
          {calculated ? (
            <div className="space-y-6">
              
              {/* Volumetric Weight details */}
              <div className="glass-card p-6 rounded-xl border border-brand-border shadow-md grid grid-cols-2 gap-4 text-center divide-x divide-brand-border">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Volumetric Sizing Weight</span>
                  <h4 className="text-white text-2xl font-black mt-1">{results.volumetricWeight} kg</h4>
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Billable / Invoiced Weight</span>
                  <h4 className="text-brand-yellow text-2xl font-black mt-1">{results.billableWeight} kg</h4>
                </div>
              </div>

              {/* Service packages grid */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Eco Saver',
                    desc: 'Economical cargo routing using standard road or ocean consolidation.',
                    time: '8 - 14 Days',
                    cost: results.eco,
                    color: 'text-emerald-400',
                    border: 'border-emerald-500/20',
                    bg: 'bg-emerald-500/5'
                  },
                  {
                    name: 'Standard Freight',
                    desc: 'Default routing via mixed priority air and sea shipping grids.',
                    time: '3 - 6 Days',
                    cost: results.standard,
                    color: 'text-brand-yellow',
                    border: 'border-brand-yellow/30',
                    bg: 'bg-brand-yellow/5'
                  },
                  {
                    name: 'Express Priority',
                    desc: 'High priority scheduling on direct air cargo dispatches.',
                    time: '1 - 2 Days',
                    cost: results.express,
                    color: 'text-red-400',
                    border: 'border-red-500/20',
                    bg: 'bg-red-500/5'
                  }
                ].map((pkg, idx) => (
                  <div 
                    key={idx} 
                    className={`glass-card p-6 rounded-xl border ${pkg.border} ${pkg.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-premium transition-shadow`}
                  >
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-lg">{pkg.name}</h4>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold bg-slate-900 border border-brand-border px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} /> {pkg.time}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{pkg.desc}</p>
                    </div>
                    
                    <div className="text-right shrink-0 flex flex-col items-end justify-center">
                      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Estimated Fare</span>
                      <h3 className={`text-3xl font-black ${pkg.color} mt-1`}>${pkg.cost}</h3>
                      <button 
                        onClick={() => navigate('/book')}
                        className="text-xs text-slate-300 hover:text-brand-yellow flex items-center gap-1 mt-2 font-semibold group"
                      >
                        Book This
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="glass-card p-12 rounded-xl border border-brand-border text-center space-y-4 min-h-[350px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center text-slate-500 animate-pulse-slow">
                <Calculator size={30} />
              </div>
              <h3 className="text-white font-bold text-lg">Awaiting Specifications</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Fill out the parcel physical weight and dimensional details on the left, then click compute to generate comparative service quotes.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default RateCalculator;
