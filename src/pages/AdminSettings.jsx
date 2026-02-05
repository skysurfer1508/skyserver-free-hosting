import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Server, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettings() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar currentPage="AdminSettings" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Configure your admin dashboard</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
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
                <Label className="text-slate-300">Change Password</Label>
                <Input 
                  type="password"
                  placeholder="Enter new password"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  disabled
                />
              </div>
              <Button className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" disabled>
                Update Password
              </Button>
            </div>
          </Card>

          <p className="text-slate-500 text-sm text-center">
            Settings are currently read-only for this demo.
          </p>
        </div>
      </main>
    </div>
  );
}