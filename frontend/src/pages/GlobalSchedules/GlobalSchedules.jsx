import React, { useState } from 'react';
import { 
  Plane, Ship, Search, Clock, Calendar, MapPin, Navigation, 
  HelpCircle, RefreshCw, Compass, ArrowRight, ArrowLeftRight
} from 'lucide-react';

const GlobalSchedules = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const schedules = [
    { 
      type: 'air', 
      id: 'SF-FL882', 
      carrier: 'SF Air Express', 
      origin: 'Hong Kong (HKG)', 
      dest: 'Los Angeles (LAX)', 
      time: '14 Hours', 
      status: 'In Transit', 
      freq: 'Daily',
      vessel: 'Boeing 777-F' 
    },
    { 
      type: 'sea', 
      id: 'SF-OC304', 
      carrier: 'Pacific Star Liners', 
      origin: 'Shanghai (PVG)', 
      dest: 'Rotterdam (RTM)', 
      time: '18 Days', 
      status: 'On Schedule', 
      freq: 'Weekly',
      vessel: 'Evergreen Cargo Carrier' 
    },
    { 
      type: 'air', 
      id: 'SF-FL104', 
      carrier: 'Transatlantic Express', 
      origin: 'London (LHR)', 
      dest: 'New York (JFK)', 
      time: '8 Hours', 
      status: 'Boarding Cargo', 
      freq: 'Daily',
      vessel: 'Airbus A330-F' 
    },
    { 
      type: 'sea', 
      id: 'SF-OC908', 
      carrier: 'Atlantic Shipping Corp', 
      origin: 'Hamburg (HAM)', 
      dest: 'Newark (EWR)', 
      time: '10 Days', 
      status: 'Customs Hold', 
      freq: 'Bi-Weekly',
      vessel: 'Atlantic Titan Liner' 
    },
    { 
      type: 'sea', 
      id: 'SF-OC502', 
      carrier: 'Meridian Ocean Freight', 
      origin: 'Singapore (SIN)', 
      dest: 'Dubai (DXB)', 
      time: '6 Days', 
      status: 'Departed Port', 
      freq: 'Weekly',
      vessel: 'Indian Ocean Rider' 
    },
    { 
      type: 'air', 
      id: 'SF-FL601', 
      carrier: 'Apex Cargo Transport', 
      origin: 'Tokyo (NRT)', 
      dest: 'Sydney (SYD)', 
      time: '9 Hours', 
      status: 'In Transit', 
      freq: 'Weekly',
      vessel: 'Boeing 747-8F' 
    },
    { 
      type: 'sea', 
      id: 'SF-OC772', 
      carrier: 'Global Ocean Cargo', 
      origin: 'Santos (SSZ)', 
      dest: 'Houston (HOU)', 
      time: '12 Days', 
      status: 'Awaiting Tug', 
      freq: 'Bi-Weekly',
      vessel: 'Gulf Breeze Carrier' 
    }
  ];

  const filteredSchedules = schedules.filter(s => {
    const matchesFilter = filter === 'all' || s.type === filter;
    const matchesSearch = 
      s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vessel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs text-brand-yellow font-bold uppercase tracking-widest bg-brand-yellow/10 px-3 py-1 rounded-full">
          Global Schedules
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Consignment Rosters</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Monitor scheduled air dispatches and oceanic voyage rosters active across international ports.
        </p>
      </div>

      {/* Control console filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border/60 pb-6">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Origin, Destination, Vessel name, Route ID..."
            className="input-field pl-10 py-2 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex border border-brand-border bg-brand-card p-1 rounded-lg shrink-0">
          {[
            { id: 'all', label: 'All Transports' },
            { id: 'air', label: 'Air Freight' },
            { id: 'sea', label: 'Ocean Cargo' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                filter === tab.id 
                  ? 'bg-brand-yellow text-brand-dark shadow-glow-yellow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Table Container */}
      <div className="glass-card rounded-xl border border-brand-border shadow-premium overflow-hidden">
        {filteredSchedules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-4">
            <Compass size={36} className="mx-auto text-slate-600 animate-spin" />
            <p className="text-sm">No scheduled transits match your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border bg-brand-card/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Route / Transit ID</th>
                  <th className="py-4 px-6">Carrier / Vessel</th>
                  <th className="py-4 px-6">Flight Path / Route</th>
                  <th className="py-4 px-6">Lapse Duration</th>
                  <th className="py-4 px-6">Frequency</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-slate-300 text-sm">
                {filteredSchedules.map((item, idx) => (
                  <tr key={idx} className="hover:bg-brand-card/20 transition-colors">
                    
                    {/* Route ID */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.type === 'air' ? 'bg-brand-yellow/10 text-brand-yellow' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {item.type === 'air' ? <Plane size={15} /> : <Ship size={15} />}
                        </div>
                        <div>
                          <span className="font-bold text-white font-mono">{item.id}</span>
                          <span className="text-[10px] text-slate-500 block uppercase font-semibold">{item.type} cargo</span>
                        </div>
                      </div>
                    </td>

                    {/* Carrier */}
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{item.carrier}</span>
                        <span className="text-[11px] text-slate-500">{item.vessel}</span>
                      </div>
                    </td>

                    {/* Path */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{item.origin}</span>
                        </div>
                        <ArrowLeftRight size={13} className="text-slate-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{item.dest}</span>
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4.5 px-6">
                      <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-500" />
                        {item.time}
                      </span>
                    </td>

                    {/* Frequency */}
                    <td className="py-4.5 px-6 text-slate-400">
                      {item.freq}
                    </td>

                    {/* Status */}
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
        )}
      </div>

    </div>
  );
};

export default GlobalSchedules;
