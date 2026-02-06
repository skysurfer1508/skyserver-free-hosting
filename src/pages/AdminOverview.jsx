import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { base44 } from '@/api/base44Client';
import { Card } from "@/components/ui/card";
import { Users, Server, TrendingUp, Gamepad2, RefreshCw } from 'lucide-react';

export default function AdminOverview() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeServers: 0,
    mostPopularGame: 'N/A',
    totalRequests: 0,
    pendingRequests: 0
  });
  const [serviceStatus, setServiceStatus] = useState({
    panel: { status: 'loading', label: 'Checking...' },
    node: { status: 'loading', label: 'Checking...' }
  });

  const checkServiceStatus = async () => {
    setServiceStatus({
      panel: { status: 'loading', label: 'Checking...' },
      node: { status: 'loading', label: 'Checking...' }
    });

    const endpoints = [
      { key: 'panel', url: 'https://panel.skyserver1508.org' },
      { key: 'node', url: 'https://node.skyserver1508.org' }
    ];

    const results = await Promise.all(
      endpoints.map(async ({ key, url }) => {
        try {
          await fetch(url, { mode: 'no-cors', signal: AbortSignal.timeout(5000) });
          return { key, status: 'online', label: 'Operational' };
        } catch (error) {
          return { key, status: 'offline', label: 'Unreachable' };
        }
      })
    );

    const newStatus = {};
    results.forEach(({ key, status, label }) => {
      newStatus[key] = { status, label };
    });
    setServiceStatus(newStatus);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Fetch from backend database
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const requests = await base44.entities.ServerRequest.list();

        const activeServers = requests.filter(r => r.status === 'active').length;
        const pendingRequests = requests.filter(r => r.status === 'pending').length;

        // Calculate most popular game
        const gameCounts = {};
        requests.forEach(r => {
          gameCounts[r.game] = (gameCounts[r.game] || 0) + 1;
        });
        const mostPopularGame = Object.keys(gameCounts).length > 0
          ? Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0][0]
          : 'N/A';

        setAnalytics({
          totalUsers: users.length,
          activeServers,
          mostPopularGame: mostPopularGame.charAt(0).toUpperCase() + mostPopularGame.slice(1),
          totalRequests: requests.length,
          pendingRequests
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
    // Check service status on load
    checkServiceStatus();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar currentPage="AdminOverview" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <p className="text-slate-400 mt-1">Platform analytics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Users</p>
                <p className="text-4xl font-bold text-white">{analytics.totalUsers}</p>
                <p className="text-slate-500 text-xs mt-2">Registered accounts</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-sky-400" />
              </div>
            </div>
          </Card>

          {/* Active Servers */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Active Servers</p>
                <p className="text-4xl font-bold text-white">{analytics.activeServers}</p>
                <p className="text-slate-500 text-xs mt-2">Currently running</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Server className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
          </Card>

          {/* Most Popular Game */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Most Popular</p>
                <p className="text-4xl font-bold text-white">{analytics.mostPopularGame}</p>
                <p className="text-slate-500 text-xs mt-2">Top requested game</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Gamepad2 className="w-7 h-7 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Request Activity</h3>
                <p className="text-slate-400 text-sm">Total and pending counts</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50">
                <p className="text-slate-400 text-xs mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-white">{analytics.totalRequests}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50">
                <p className="text-slate-400 text-xs mb-1">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-400">{analytics.pendingRequests}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Server Status</h3>
                  <p className="text-slate-400 text-sm">Real-time monitoring</p>
                </div>
              </div>
              <button
                onClick={checkServiceStatus}
                className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                title="Refresh status"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {/* Control Panel Status */}
              <div className="p-3 rounded-xl bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    serviceStatus.panel.status === 'loading' ? 'bg-yellow-500 animate-pulse' :
                    serviceStatus.panel.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <span className="text-white font-medium text-sm">Control Panel</span>
                </div>
                <span className={`text-xs font-medium ${
                  serviceStatus.panel.status === 'loading' ? 'text-yellow-400' :
                  serviceStatus.panel.status === 'online' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {serviceStatus.panel.label}
                </span>
              </div>

              {/* Node Status */}
              <div className="p-3 rounded-xl bg-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    serviceStatus.node.status === 'loading' ? 'bg-yellow-500 animate-pulse' :
                    serviceStatus.node.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <span className="text-white font-medium text-sm">Node 1 (EU)</span>
                </div>
                <span className={`text-xs font-medium ${
                  serviceStatus.node.status === 'loading' ? 'text-yellow-400' :
                  serviceStatus.node.status === 'online' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {serviceStatus.node.label}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}