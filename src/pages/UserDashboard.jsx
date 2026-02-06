import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Server, LogOut, User, Mail, Clock, CheckCircle2, AlertCircle, ExternalLink, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AuthService } from '@/components/auth/AuthService';
import { Badge } from "@/components/ui/badge";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [request, setRequest] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check authentication
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      window.location.href = createPageUrl('Login');
      return;
    }

    setUser(currentUser);
    setRequest(AuthService.getUserLatestRequest());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = createPageUrl('Home');
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  const statusConfig = {
    pending: {
      label: 'Pending Review',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconColor: 'text-amber-400'
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    active: {
      label: 'Active',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    rejected: {
      label: 'Rejected',
      icon: AlertCircle,
      color: 'bg-red-500/10 text-red-400 border-red-500/20',
      iconColor: 'text-red-400'
    }
  };

  const currentStatus = request?.status || 'pending';
  const status = statusConfig[currentStatus];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
      
      {/* Header */}
      <header className="relative border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Skyserver</span>
          </Link>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
          <p className="text-slate-400">Manage your game servers and account</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl blur opacity-10" />
            <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-400" />
                Account Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500 text-sm">Name</p>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Server Status Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl blur opacity-10" />
            <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-400" />
                Server Status
              </h2>

              {request ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{request.server_name}</p>
                      <p className="text-slate-400 text-sm capitalize">{request.game}</p>
                    </div>
                    <Badge className={`${status.color} border`}>
                      <StatusIcon className={`w-3 h-3 mr-1 ${status.iconColor}`} />
                      {status.label}
                    </Badge>
                  </div>

                  {currentStatus === 'pending' && (
                    <p className="text-slate-400 text-sm">
                      Your request is being reviewed. You'll receive an email notification within 24-48 hours.
                    </p>
                  )}

                  {currentStatus === 'rejected' && (
                    <p className="text-slate-400 text-sm">
                      Your request was not approved. Please contact support for more information.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400 mb-4">You haven't requested a server yet.</p>
                  <Button asChild className="bg-gradient-to-r from-sky-500 to-cyan-500">
                    <Link to={createPageUrl('Home')}>
                      <Server className="w-4 h-4 mr-2" />
                      Request Server
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Server Credentials (Only if Active) */}
        {request && currentStatus === 'active' && request.credentials && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20" />
            <div className="relative p-6 rounded-2xl bg-slate-900 border border-emerald-500/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Server Credentials</h2>
                  <p className="text-slate-400 text-sm">Use these to access your server panel</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Panel URL</p>
                  <a 
                    href={request.credentials.panelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-mono text-sm flex items-center gap-2"
                  >
                    {request.credentials.panelUrl.replace('https://', '')}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Username</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-mono text-sm">{request.credentials.username}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(request.credentials.username);
                        toast.success('Username copied!');
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-400 text-sm">Password</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(request.credentials.password);
                          toast.success('Password copied!');
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-white font-mono text-sm">
                    {showPassword ? request.credentials.password : '••••••••••••'}
                  </p>
                </div>
              </div>

              <Button
                asChild
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
              >
                <a href={request.credentials.panelUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Control Panel
                </a>
              </Button>

              <div className="mt-4 p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <p className="text-sky-400 text-xs">
                  💡 Keep these credentials safe! You can always access them from this dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}