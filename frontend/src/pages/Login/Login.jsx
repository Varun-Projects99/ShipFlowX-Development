import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ShieldAlert, ArrowRight, Loader2, Chrome } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Set up message listener for the Google SSO popup callback
  useEffect(() => {
    const handleSSOMessage = async (event) => {
      // Validate origin
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'GOOGLE_SSO_SUCCESS') {
        const { token } = event.data;
        setLoading(true);
        setError('');

        const result = await loginWithGoogle(token);
        setLoading(false);

        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message);
        }
      }
    };

    window.addEventListener('message', handleSSOMessage);
    return () => window.removeEventListener('message', handleSSOMessage);
  }, [loginWithGoogle, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  // Trigger Google SSO simulated Popup
  const handleGoogleSignIn = () => {
    const width = 450;
    const height = 550;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      '/auth/google-popup',
      'GoogleSignIN',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-brand-border shadow-premium relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark font-black text-2xl mx-auto mb-4 shadow-glow-yellow">
            S
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Enterprise Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to coordinate freights and track orders.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm mb-6">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">Password</label>
              <a href="#forgot" className="text-xs text-brand-yellow hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field pl-11"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-4"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-[1px] bg-brand-border/60 flex-grow"></div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or continue with</span>
          <div className="h-[1px] bg-brand-border/60 flex-grow"></div>
        </div>

        {/* Social SSO Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="btn-secondary py-2.5 text-xs flex items-center justify-center gap-2 hover:border-slate-500 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <button
            onClick={() => handleSelectFacebookSim()}
            className="btn-secondary py-2.5 text-xs flex items-center justify-center gap-2 hover:border-slate-500 hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-brand-border/60">
          <p className="text-slate-400 text-sm">
            Don't have an operations account?{' '}
            <Link to="/register" className="text-brand-yellow font-semibold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Simulated Facebook handler trigger
const handleSelectFacebookSim = () => {
  alert("Facebook Login Integration (Simulated): For premium Single Sign-On testing, please use the 'Google SSO' button, which is fully operational and integrated with your database!");
};

export default Login;
