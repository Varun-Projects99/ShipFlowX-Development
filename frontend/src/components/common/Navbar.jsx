import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, Ship, User, LogIn, LogOut, LayoutDashboard, ShieldCheck, Bot } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Track Shipment', path: '/track' },
    { name: 'Rate Calculator', path: '/rates' },
    { name: 'Global Schedules', path: '/schedules' },
    { name: 'AI Assistant', path: '/ai-assistant' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-brand-border bg-brand-dark/75 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark font-black text-2xl shadow-glow-yellow transition-transform duration-300 group-hover:scale-105">
              S
            </div>
            <span className="font-extrabold text-2xl tracking-wider text-white">
              SHIP<span className="text-brand-yellow">FLOW</span>X
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-brand-yellow flex items-center gap-1.5 ${
                  isActive(link.path) ? 'text-brand-yellow font-semibold' : 'text-slate-300'
                }`}
              >
                {link.path === '/ai-assistant' && <Bot size={15} className="text-brand-yellow" />}
                {link.name}
              </Link>
            ))}

            {/* Dynamic Dashboard Link */}
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-brand-yellow flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'text-brand-yellow font-semibold' : 'text-slate-300'
                }`}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            {/* Dynamic Admin link */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-brand-yellow flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-brand-yellow font-semibold' : 'text-slate-300'
                }`}
              >
                <ShieldCheck size={15} className="text-brand-yellow" />
                Admin Ops
              </Link>
            )}
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  Welcome, <span className="text-brand-yellow font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-slate-300 hover:text-red-400 transition-colors flex items-center gap-2 border border-brand-border px-3 py-1.5 rounded-lg hover:border-red-500/30"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-brand-yellow transition-colors flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm flex items-center gap-2">
                  <User size={16} />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-brand-border bg-brand-card/95 backdrop-blur-lg animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-brand-yellow/10 text-brand-yellow font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.path === '/ai-assistant' && <Bot size={18} className="text-brand-yellow" />}
                  {link.name}
                </div>
              </Link>
            ))}

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-brand-yellow/10 text-brand-yellow font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-brand-yellow/10 text-brand-yellow font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Admin Operations
              </Link>
            )}

            <div className="border-t border-brand-border my-4 pt-4 flex flex-col gap-3 px-3">
              {user ? (
                <>
                  <span className="text-center text-sm text-slate-400">
                    Active Session: <span className="text-brand-yellow font-semibold">{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2.5 font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-2 border border-red-500/20 rounded-lg hover:bg-red-500/5 transition-all"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center font-medium text-slate-300 hover:text-brand-yellow py-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center py-2.5"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
