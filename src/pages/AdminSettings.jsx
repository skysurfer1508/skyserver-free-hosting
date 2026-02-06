import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Server, Bell, Shield, Database, Zap, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import SyncWarningBanner from '@/components/SyncWarningBanner';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [totalSlots, setTotalSlots] = useState(0);
  const [systemConfig, setSystemConfig] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }

    // Load config from backend
    loadConfig();
  }, [navigate]);

  const loadConfig = async () => {
    try {
      const configs = await base44.entities.SystemConfig.list();
      if (configs && configs.length > 0) {
        setSystemConfig(configs[0]);
        setTotalSlots(configs[0].totalSlots);
      } else {
        // Create initial config
        const newConfig = await base44.entities.SystemConfig.create({
          configKey: 'global',
          totalSlots: 10,
          claimedSlots: 0,
          isMaintenanceMode: false
        });
        setSystemConfig(newConfig);
        setTotalSlots(10);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  const handleSaveCapacity = async () => {
    if (!systemConfig) return;
    try {
      await base44.entities.SystemConfig.update(systemConfig.id, {
        totalSlots: totalSlots
      });
      toast.success('Server capacity updated successfully');
      await loadConfig();
    } catch (error) {
      console.error('Failed to save capacity:', error);
      toast.error('Failed to update capacity');
    }
  };

  const handleStatusChange = async (checked) => {
    if (!systemConfig) return;
    const isOperational = checked;
    try {
      await base44.entities.SystemConfig.update(systemConfig.id, {
        isMaintenanceMode: !isOperational
      });
      toast.success(`System status changed to ${isOperational ? 'Operational' : 'Maintenance Mode'}`);
      await loadConfig();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update system status');
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    localStorage.setItem('adminPassword', newPassword);
    toast.success('Admin password updated successfully');
    setNewPassword('');
  };

  const handleFactoryReset = async () => {
    if (window.confirm('⚠️ DANGER: This will permanently delete ALL data including users, requests, and settings. This action CANNOT be undone. Are you absolutely sure?')) {
      if (window.confirm('Last confirmation: Type YES in the next prompt to proceed.')) {
        const confirmation = window.prompt('Type YES to confirm factory reset:');
        if (confirmation === 'YES') {
          try {
            // Delete all ServerRequest entities
            const allRequests = await base44.entities.ServerRequest.list();
            for (const request of allRequests) {
              await base44.entities.ServerRequest.delete(request.id);
            }
            
            // Reset SystemConfig
            if (systemConfig) {
              await base44.entities.SystemConfig.update(systemConfig.id, {
                totalSlots: 10,
                claimedSlots: 0,
                isMaintenanceMode: false
              });
            }
            
            // Clear admin auth
            localStorage.removeItem('skyserver_admin_auth');
            localStorage.removeItem('adminPassword');
            
            toast.success('Database cleared. Redirecting...');
            setTimeout(() => {
              navigate(createPageUrl('AdminLogin'));
            }, 1000);
          } catch (error) {
            console.error('Failed to clear database:', error);
            toast.error('Failed to clear database. Please try again.');
          }
        } else {
          toast.error('Factory reset cancelled');
        }
      }
    }
  };

  return (
    <>
      <SyncWarningBanner />
      <div className="min-h-screen bg-slate-950 flex">
        <AdminSidebar currentPage="AdminSettings" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Configure your admin dashboard</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* System Status */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${systemStatus === 'operational' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <Zap className={`w-5 h-5 ${systemStatus === 'operational' ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">System Status</h2>
                <p className="text-slate-400 text-sm">Control global maintenance mode</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-white font-medium">
                  {systemConfig && !systemConfig.isMaintenanceMode ? '🟢 Systems Operational' : '🔴 Maintenance Mode'}
                </p>
                <p className="text-slate-400 text-sm">
                  {systemConfig && !systemConfig.isMaintenanceMode
                    ? 'All services are running normally' 
                    : 'Users will see a maintenance banner'}
                </p>
              </div>
              <Switch 
                checked={systemConfig && !systemConfig.isMaintenanceMode}
                onCheckedChange={handleStatusChange}
                disabled={!systemConfig}
              />
            </div>
          </Card>

          {/* General Settings */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">General Settings</h2>
                <p className="text-slate-400 text-sm">Basic configuration options</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Admin Email</Label>
                <Input 
                  defaultValue="admin@skyserver.com"
                  className="bg-slate-800/50 border-slate-700 text-white"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Auto-approve Requests</p>
                  <p className="text-slate-400 text-sm">Automatically approve new requests</p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-slate-400 text-sm">Email notification preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">New Request Alerts</p>
                  <p className="text-slate-400 text-sm">Get notified when a new request arrives</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-medium">Daily Summary</p>
                  <p className="text-slate-400 text-sm">Receive a daily summary of activity</p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </Card>

          {/* Server Capacity */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Server Capacity</h2>
                <p className="text-slate-400 text-sm">Manage available slots per game</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Total Server Slots</Label>
                <Input 
                  type="number"
                  min="0"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(parseInt(e.target.value) || 0)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
                <p className="text-slate-500 text-xs">
                  Available slots: {systemConfig ? systemConfig.totalSlots - systemConfig.claimedSlots : 0}
                </p>
              </div>
              <Button 
                onClick={handleSaveCapacity}
                disabled={!systemConfig}
                className="w-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 disabled:opacity-50"
              >
                Save Capacity
              </Button>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Security</h2>
                <p className="text-slate-400 text-sm">Security and access settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">New Admin Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
                <p className="text-slate-500 text-xs">This password will be required to access the admin panel</p>
              </div>
              <Button 
                onClick={handlePasswordChange}
                disabled={!newPassword || newPassword.length < 6}
                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
              >
                Update Password
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-red-950/20 border-red-900/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
                <p className="text-slate-400 text-sm">Irreversible actions</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50">
              <div className="flex items-start gap-3 mb-4">
                <Trash2 className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-medium">Factory Reset (Clear Database)</p>
                  <p className="text-slate-400 text-sm mt-1">
                    This will permanently delete all users, requests, settings, and admin data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleFactoryReset}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Factory Reset (Clear Database)
              </Button>
            </div>
          </Card>
        </div>
      </main>
      </div>
    </>
  );
}