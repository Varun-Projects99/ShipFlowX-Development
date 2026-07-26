import React, { useState } from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';

const GooglePopup = () => {
  const [customMode, setCustomMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [error, setError] = useState('');

  // Helper to base64 encode UTF-8 strings safely
  const utob = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handleSelectAccount = (email, name) => {
    if (window.opener) {
      try {
        // Generate a simulated Google ID Token (3-part JWT structure)
        const header = utob(JSON.stringify({ alg: 'RS256', kid: 'simulated-key-id-2026' }));
        const payload = utob(JSON.stringify({
          iss: 'https://accounts.google.com',
          sub: 'google-oauth2|' + Math.random().toString().slice(2, 12),
          email: email.trim(),
          email_verified: true,
          name: name.trim() || email.split('@')[0],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        }));
        const signature = 'simulated-signature-hash-code-string-2026';
        const simulatedToken = `${header}.${payload}.${signature}`;

        window.opener.postMessage(
          { type: 'GOOGLE_SSO_SUCCESS', token: simulatedToken },
          window.location.origin
        );
        window.close();
      } catch (err) {
        setError('Error packaging Google token: ' + err.message);
      }
    } else {
      setError('Parent window not found. Try closing and opening again.');
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    
    const email = formData.email.trim();
    const name = formData.name.trim() || email.split('@')[0];
    handleSelectAccount(email, name);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg border border-slate-200 shadow-md p-8 space-y-6 relative overflow-hidden">
        
        {/* Google Header */}
        <div className="text-center space-y-2">
          {/* Mock Google Logo Colors */}
          <div className="flex justify-center gap-0.5 text-2xl font-bold tracking-tight select-none">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Choose an account</h2>
          <p className="text-xs text-slate-500">to continue to <span className="font-semibold text-slate-700">ShipFlowX Logistics</span></p>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded border border-red-200">{error}</p>
        )}

        {!customMode ? (
          <div className="space-y-3">
            {/* Account List */}
            {[
              { email: 'varunb1090@gmail.com', name: 'Varun B' },
              { email: 'madan190@gmail.com', name: 'Madan' }
            ].map((acc, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAccount(acc.email, acc.name)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {acc.name[0]}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-slate-700 truncate">{acc.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{acc.email}</p>
                </div>
              </button>
            ))}

            {/* Custom Account Button */}
            <button
              onClick={() => setCustomMode(true)}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-semibold justify-center"
            >
              Use another account
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Google Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Google Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Google Account Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow"
              >
                Sign In
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
          Google will share your name, email address, and profile picture with ShipFlowX.
        </div>
      </div>
    </div>
  );
};

export default GooglePopup;
