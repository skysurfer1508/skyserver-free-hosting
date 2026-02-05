import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    sky: 'from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-400',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ').pop()}`} />
        </div>
      </div>
    </div>
  );
}