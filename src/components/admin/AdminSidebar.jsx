import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Server, LayoutDashboard, Inbox, Settings, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, page: 'AdminOverview' },
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Admin' },
  { name: 'Requests', icon: Inbox, page: 'AdminRequests' },
  { name: 'Users', icon: Users, page: 'AdminUsers' },
  { name: 'Settings', icon: Settings, page: 'AdminSettings' },
];

export default function AdminSidebar({ currentPage, onLogout }) {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to={createPageUrl('Home')} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Skyserver</span>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <li key={item.name}>
                <Link
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}