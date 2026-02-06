import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, CheckCircle, Loader2 } from 'lucide-react';

export default function ProvisioningModal({ isOpen, onClose, request, onConfirm }) {
  const [panelUrl, setPanelUrl] = useState('https://panel.skyserver1508.org');
  const [username, setUsername] = useState(request?.email || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!password.trim()) {
      alert('Please enter a password');
      return;
    }

    setIsSubmitting(true);
    
    const credentials = {
      panelUrl,
      username,
      password
    };

    await onConfirm(credentials);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Server className="w-5 h-5 text-sky-400" />
            Provisioning Server for {request?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="p-4 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <p className="text-sky-400 text-sm">
              Enter the server panel credentials for this user. These will be securely delivered to their dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="panelUrl" className="text-slate-300">Panel URL</Label>
            <Input
              id="panelUrl"
              value={panelUrl}
              onChange={(e) => setPanelUrl(e.target.value)}
              placeholder="https://panel.skyserver1508.org"
              className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
              className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Initial Password *</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-slate-400 text-xs">
              <strong className="text-slate-300">Server:</strong> {request?.server_name}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              <strong className="text-slate-300">Game:</strong> {request?.game}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Activate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}