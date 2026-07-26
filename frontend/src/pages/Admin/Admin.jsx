import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  ShieldCheck, Loader2, ArrowRight, Clipboard, MapPin, Settings, 
  Search, Eye, Edit, AlertCircle, RefreshCw, X, Calendar
} from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Status Form Dialog Modal State
  const [editingShipment, setEditingShipment] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'Booked',
    location: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Protect Admin Route: block non-admins
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/dashboard'); // Standard customers are sent to dashboard
      }
    }
  }, [user, authLoading, navigate]);

  // Load All System Shipments
  const fetchAllShipments = async () => {
    try {
      const res = await api.get('/api/shipments');
      setShipments(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch global logistics records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllShipments();
    }
  }, [user]);

  // Open Modal for Edit
  const openEditModal = (shipment) => {
    setEditingShipment(shipment);
    setUpdateForm({
      status: shipment.status,
      location: shipment.currentAddress || '',
      description: `Cargo checked at ${shipment.currentAddress || 'sorting node'}.`
    });
    setModalError('');
  };

  const closeEditModal = () => {
    setEditingShipment(null);
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  // Submit Status Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError('');

    try {
      await api.put(`/api/admin/shipments/${editingShipment._id}/status`, updateForm);
      closeEditModal();
      // Refresh list
      fetchAllShipments();
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Shipments
  const filteredShipments = shipments.filter(s => 
    s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.senderDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receiverDetails?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receiverDetails?.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={36} className="text-brand-yellow animate-spin" />
        <p className="text-slate-400 text-sm">Synchronizing operations deck...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Upper Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-brand-border/60 pb-6">
        <div>
          <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <ShieldCheck size={14} /> Global Logistics Command
          </span>
          <h1 className="text-3xl font-black text-white mt-2">Operations Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Dispatch controls, current node routing updates, and shipment database overrides.</p>
        </div>
        
        {/* Statistics panel shortcut */}
        <div className="bg-slate-900 border border-brand-border px-4 py-3 rounded-lg flex items-center gap-6 divide-x divide-brand-border">
          <div className="pr-4">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Total Freight</span>
            <span className="text-white text-lg font-black">{shipments.length}</span>
          </div>
          <div className="pl-6">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Active Transit</span>
            <span className="text-brand-yellow text-lg font-black">
              {shipments.filter(s => s.status !== 'Delivered' && s.status !== 'Cancelled').length}
            </span>
          </div>
        </div>
      </div>

      {/* Main console content */}
      <div className="glass-card rounded-xl border border-brand-border shadow-premium overflow-hidden">
        
        {/* Table Search bar and filters */}
        <div className="px-6 py-4 border-b border-brand-border bg-brand-card/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Waybill ID, Client name, City..."
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <button 
            onClick={fetchAllShipments}
            className="btn-secondary py-2 px-4 text-xs font-bold"
          >
            <RefreshCw size={12} /> Sync Database
          </button>
        </div>

        {error && (
          <div className="p-6 text-center text-red-400 text-sm flex items-center justify-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {filteredShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-4">
            <Clipboard size={36} className="mx-auto text-slate-600" />
            <p className="text-sm">No shipments matched your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-card/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Tracking ID</th>
                  <th className="py-4 px-6">Customer / Email</th>
                  <th className="py-4 px-6">Route Node</th>
                  <th className="py-4 px-6">Current Location</th>
                  <th className="py-4 px-6">Type / Price</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-slate-300 text-sm">
                {filteredShipments.map((s) => (
                  <tr key={s._id} className="hover:bg-brand-card/25 transition-colors">
                    
                    {/* ID */}
                    <td className="py-4 px-6">
                      <Link 
                        to={`/track?code=${s.trackingNumber}`}
                        className="font-bold text-white hover:text-brand-yellow flex items-center gap-1.5 transition-colors"
                      >
                        {s.trackingNumber}
                        <Eye size={14} className="text-slate-500" />
                      </Link>
                      <span className="text-[10px] text-slate-500 block">
                        Booked: {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{s.user?.name || s.senderDetails?.name}</span>
                        <span className="text-[11px] text-slate-500">{s.user?.email || s.senderDetails?.email}</span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <span className="text-slate-400">{s.senderDetails?.city}</span>
                        <span className="mx-2 text-slate-500">→</span>
                        <span className="text-white font-semibold">{s.receiverDetails?.city}</span>
                      </div>
                    </td>

                    {/* Current Node Location & Status */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="text-xs text-white font-medium flex items-center gap-1">
                          <MapPin size={11} className="text-brand-yellow shrink-0" />
                          {s.currentAddress}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : s.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-brand-yellow/10 text-brand-yellow'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </td>

                    {/* Type & Cost */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase font-bold text-slate-400">{s.packageDetails?.serviceType}</span>
                        <span className="font-semibold text-white mt-0.5">
                          ${s.paymentDetails?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </td>

                    {/* Edit Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(s)}
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 hover:border-brand-yellow/50 hover:text-brand-yellow transition-all"
                      >
                        <Edit size={12} />
                        Update Status
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG DRAWER */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card rounded-xl border border-brand-border p-6 shadow-premium relative animate-scale-up">
            
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Route Logistics Status Update</h3>
                <p className="text-xs text-slate-500 mt-0.5">Waybill ID: {editingShipment.trackingNumber}</p>
              </div>
              <button 
                onClick={closeEditModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs mb-4">
                {modalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              
              {/* Status Selector */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Transit Status</label>
                <select
                  name="status"
                  value={updateForm.status}
                  onChange={handleUpdateChange}
                  className="input-field"
                >
                  <option value="Booked">Booked (Cargo Saved)</option>
                  <option value="Dispatched">Dispatched (Left Warehouse)</option>
                  <option value="In Transit">In Transit (Traveling)</option>
                  <option value="Out for Delivery">Out for Delivery (Courier Assigned)</option>
                  <option value="Delivered">Delivered (Handed to Receiver)</option>
                  <option value="Cancelled">Cancelled (Returned/Halted)</option>
                </select>
              </div>

              {/* Current Location address */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Current Location Address Node</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    name="location"
                    value={updateForm.location}
                    onChange={handleUpdateChange}
                    placeholder="e.g. Bangalore Sorting Hub, India"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Transit Event Description log */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Transit Milestone description log</label>
                <textarea
                  name="description"
                  value={updateForm.description}
                  onChange={handleUpdateChange}
                  placeholder="Describe cargo progress..."
                  rows="3"
                  className="input-field"
                  required
                />
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-6"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Apply Updates'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
