import React, { useState, useMemo } from 'react';
import { LogEntry } from '../types';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Info, AlertOctagon, FileText } from 'lucide-react';

interface LogViewerProps {
  logs: LogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesText = 
        log.droneId.toLowerCase().includes(search.toLowerCase()) || 
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesLevel = filter === 'all' || log.level === filter;
      const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;

      return matchesText && matchesLevel && matchesCategory;
    });
  }, [logs, filter, search, categoryFilter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertOctagon size={16} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const base = "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border";
    switch (level) {
      case 'error': return `${base} bg-red-500/10 text-red-400 border-red-500/20`;
      case 'warning': return `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`;
      case 'success': return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      default: return `${base} bg-blue-500/10 text-blue-400 border-blue-500/20`;
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl border border-white/10 flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gray-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="text-emerald-400" />
              Flight & System Logs
            </h2>
            <p className="text-sm text-gray-400 mt-1">Audit trail for all drone operations and system events</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white/10 rounded-lg text-sm text-gray-200 transition-colors">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search Log ID, Drone ID, or Action..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-lg bg-gray-950 border border-gray-800 pl-10 pr-4 text-sm text-gray-200 focus:ring-1 focus:ring-emerald-500 placeholder-gray-600"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="h-10 bg-gray-950 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
            </select>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 bg-gray-950 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:ring-1 focus:ring-emerald-500 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Flight">Flight Ops</option>
              <option value="System">System</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-950/50 border-b border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-2">Timestamp</div>
        <div className="col-span-2">Drone ID</div>
        <div className="col-span-1">Level</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-3">Action</div>
        <div className="col-span-2 text-right">Log ID</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredLogs.map((log) => (
          <div 
            key={log.id} 
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors group text-sm"
          >
            <div className="col-span-2 text-gray-400 font-mono text-xs flex items-center">
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div className="col-span-2 font-mono text-emerald-400 font-medium">
              {log.droneId}
            </div>
            <div className="col-span-1 flex items-center">
              <span className={getLevelBadge(log.level)}>
                {log.level}
              </span>
            </div>
            <div className="col-span-2 text-gray-300">
              {log.category}
            </div>
            <div className="col-span-3">
              <div className="text-gray-200 font-medium">{log.action}</div>
              <div className="text-xs text-gray-500 truncate group-hover:text-gray-400 transition-colors">{log.details}</div>
            </div>
            <div className="col-span-2 text-right text-gray-600 font-mono text-xs">
              {log.id}
            </div>
          </div>
        ))}
        
        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Filter size={48} className="mb-4 opacity-20" />
            <p>No logs found matching your criteria</p>
          </div>
        )}
      </div>
      
      {/* Footer Status */}
      <div className="bg-gray-950 px-6 py-2 border-t border-white/10 text-xs text-gray-500 flex justify-between">
         <span>Showing {filteredLogs.length} records</span>
         <span>Synced: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default LogViewer;