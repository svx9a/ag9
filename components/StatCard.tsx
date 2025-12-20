import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-4 transition-all hover:shadow-md group">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 ring-1 ring-emerald-100">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-3 flex items-center text-xs">
          <span className={`font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="ml-1 text-gray-400">vs last hour</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;