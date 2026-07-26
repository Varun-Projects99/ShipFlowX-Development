import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, HelpCircle, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-brand-border bg-[#03070f] relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-yellow/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center text-brand-dark font-black text-lg">
                S
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                SHIP<span className="text-brand-yellow">FLOW</span>X
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mt-2">
              Next-generation enterprise logistics platform. Real-time fleet orchestration, automated customs clearance, and global shipment visibility.
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-slate-500 bg-brand-border px-3 py-1 rounded-full flex items-center gap-1.5">
                <Shield size={12} className="text-brand-yellow" /> SOC2 Certified
              </span>
              <span className="text-xs text-slate-500 bg-brand-border px-3 py-1 rounded-full flex items-center gap-1.5">
                <HelpCircle size={12} className="text-brand-yellow" /> 24/7 Ops Support
              </span>
            </div>
          </div>

          {/* Logistics Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 tracking-wide uppercase">Freight Solutions</h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Cargo Tracking', path: '/track' },
                { name: 'Freight Pricing Engine', path: '/rates' },
                { name: 'Global Shipping Schedules', path: '/schedules' },
                { name: 'Book Shipment', path: '/book' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-brand-yellow text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-brand-yellow" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 tracking-wide uppercase">Operational Hub</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={18} className="text-brand-yellow shrink-0 mt-0.5" />
                <span>100 Logistics Plaza, Suite 400<br />New York, NY 10001, USA</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={18} className="text-brand-yellow shrink-0" />
                <span>+1 (800) 555-FLOW</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={18} className="text-brand-yellow shrink-0" />
                <span>operations@shipflowx.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Keep Updated */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 tracking-wide uppercase">System Bulletins</h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe to global logistics advisories, weather updates, and fuel adjustment updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter work email..."
                  className="input-field py-2 text-sm pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-brand-yellow hover:bg-brand-yellowHover text-brand-dark px-3 rounded-md transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-border mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} ShipFlowX Global. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Operations</a>
            <a href="#privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Charter</a>
            <a href="#security" className="text-slate-500 hover:text-slate-300 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
