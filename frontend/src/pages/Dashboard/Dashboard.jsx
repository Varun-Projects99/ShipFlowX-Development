import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Package, TrendingUp, DollarSign, MapPin, Search, PlusCircle, 
  ArrowRight, ShieldCheck, Loader2, Eye, Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load User Shipments
  useEffect(() => {
    const fetchShipments = async () => {
      if (!user) return;
      try {
        const res = await api.get('/api/shipments');
        setShipments(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to retrieve shipments.');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [user]);

  // Math Metrics
  const totalSpent = shipments
    .filter(s => s.paymentDetails?.status === 'Paid')
    .reduce((sum, s) => sum + (s.paymentDetails?.amount || 0), 0);

  const activeShipments = shipments.filter(s => 
    s.status !== 'Delivered' && s.status !== 'Cancelled'
  ).length;

  const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={36} className="text-brand-yellow animate-spin" />
        <p className="text-slate-400 text-sm">Loading operations terminal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Upper Welcomer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
            ⚡ Control Console
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Shipment Terminal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Logged in as: <span className="text-white font-semibold">{user?.name}</span> ({user?.role})
          </p>
        </div>

        <div className="flex gap-4">
          <Link to="/book" className="btn-primary py-3">
            <PlusCircle size={18} />
            Book New Shipment
          </Link>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Active Transits', 
            val: activeShipments, 
            desc: 'Parcels currently in route',
            icon: <Package className="text-brand-yellow" size={24} />
          },
          { 
            label: 'Total Completed', 
            val: deliveredShipments, 
            desc: 'Parcents successfully delivered',
            icon: <ShieldCheck className="text-emerald-400" size={24} />
          },
          { 
            label: 'Billing Spent', 
            val: `$${totalSpent.toFixed(2)}`, 
            desc: 'Settled freight bills',
            icon: <DollarSign className="text-blue-400" size={24} />
          }
        ].map((m, idx) => (
          <div key={idx} className="glass-card p-6 rounded-xl border border-brand-border flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{m.label}</p>
              <h3 className="text-3xl font-black text-white">{m.val}</h3>
              <p className="text-slate-500 text-xs">{m.desc}</p>
            </div>
            <div className="w-12 h-12 bg-slate-900 border border-brand-border rounded-lg flex items-center justify-center">
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Shipment Listing Table / Box */}
      <div className="glass-card rounded-xl border border-brand-border shadow-premium overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border bg-brand-card/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Consignment History</h3>
            <p className="text-xs text-slate-500 mt-0.5">List of all active and historic cargo bookings.</p>
          </div>
        </div>

        {error && (
          <div className="p-6 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        {shipments.length === 0 ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center mx-auto text-slate-500">
              <Package size={30} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-base">No bookings found</h4>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                You haven't booked any shipments yet. Get started by creating your first global dispatch booking.
              </p>
            </div>
            <Link to="/book" className="btn-primary mx-auto">
              Book Your First Shipment
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-card/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Tracking ID</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Date Booked</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-slate-300 text-sm">
                {shipments.map((s) => (
                  <tr key={s._id} className="hover:bg-brand-card/20 transition-colors">
                    <td className="py-4 px-6">
                      <Link 
                        to={`/track?code=${s.trackingNumber}`}
                        className="font-bold text-white hover:text-brand-yellow flex items-center gap-1.5 transition-colors"
                      >
                        {s.trackingNumber}
                        <Eye size={14} className="text-slate-500" />
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{s.receiverDetails?.city}</span>
                        <span className="text-[11px] text-slate-500">{s.receiverDetails?.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-500" />
                        {new Date(s.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        s.packageDetails?.serviceType === 'express' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : s.packageDetails?.serviceType === 'saver'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {s.packageDetails?.serviceType}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      ${s.paymentDetails?.amount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : s.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-brand-yellow/10 text-brand-yellow'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
