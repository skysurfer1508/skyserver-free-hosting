import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { Server, Send, CheckCircle, Loader2, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

const RequestForm = forwardRef(({ selectedGame, hasRequested, onSubmitSuccess }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discord: '',
    game: '',
    server_name: '',
    message: '',
    minecraft_type: 'vanilla',
    minecraft_version: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [systemStatus, setSystemStatus] = useState('operational');

  useEffect(() => {
    if (selectedGame) {
      setFormData(prev => ({ ...prev, game: selectedGame }));
    }
  }, [selectedGame]);

  useEffect(() => {
    // Load system status
    const storedStatus = localStorage.getItem('systemStatus') || 'operational';
    setSystemStatus(storedStatus);

    // Listen for status changes
    const handleStatusChange = () => {
      const newStatus = localStorage.getItem('systemStatus') || 'operational';
      setSystemStatus(newStatus);
    };

    window.addEventListener('systemStatusChanged', handleStatusChange);
    return () => window.removeEventListener('systemStatusChanged', handleStatusChange);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.game || !formData.server_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate Minecraft-specific fields
    if (formData.game === 'minecraft' && !formData.minecraft_version) {
      toast.error('Please specify Minecraft version');
      return;
    }

    setIsSubmitting(true);
    
    // Only include minecraft fields if game is minecraft
    const submitData = formData.game === 'minecraft' 
      ? formData 
      : { ...formData, minecraft_type: undefined, minecraft_version: undefined };
    
    await base44.entities.ServerRequest.create(submitData);
    
    localStorage.setItem('hasRequestedServer', 'true');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    onSubmitSuccess?.();
    toast.success('Request submitted successfully!');
  };

  if (isSubmitted || hasRequested) {
    return (
      <section ref={ref} id="request-form" className="relative py-32 bg-slate-950">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-emerald-500/30"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/25">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Request Pending</h3>
            <p className="text-slate-400 mb-2">
              You have already requested a server. Please wait for approval.
            </p>
            <p className="text-sky-400 text-sm">
              You'll receive an email notification once your request has been reviewed (24-48 hours).
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="request-form" className="relative py-32 bg-slate-950">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
      
      <div className="relative max-w-2xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Start Hosting
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Claim Your <span className="text-sky-400">Free</span> Server
          </h2>
          <p className="text-slate-400">
            Fill out the form below and I'll set up your server within 24-48 hours.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* Glowing Border Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 rounded-3xl blur opacity-20" />
          
          <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Name / Gamertag <span className="text-sky-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="xXGamer123Xx"
                    className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address <span className="text-sky-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Discord & Game Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="discord" className="text-slate-300">
                    Discord Username <span className="text-slate-500">(optional)</span>
                  </Label>
                  <Input
                    id="discord"
                    value={formData.discord}
                    onChange={(e) => handleChange('discord', e.target.value)}
                    placeholder="username#1234"
                    className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game" className="text-slate-300">
                    Game Selection <span className="text-sky-400">*</span>
                  </Label>
                  <Select value={formData.game} onValueChange={(value) => handleChange('game', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white">
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="minecraft" className="text-white hover:bg-slate-700">Minecraft (Java & Bedrock)</SelectItem>
                      <SelectItem value="satisfactory" className="text-white hover:bg-slate-700">Satisfactory</SelectItem>
                      <SelectItem value="terraria" className="text-white hover:bg-slate-700">Terraria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Server Name */}
              <div className="space-y-2">
                <Label htmlFor="server_name" className="text-slate-300">
                  Desired Server Name <span className="text-sky-400">*</span>
                </Label>
                <Input
                  id="server_name"
                  value={formData.server_name}
                  onChange={(e) => handleChange('server_name', e.target.value)}
                  placeholder="My Awesome Server"
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Minecraft-Specific Fields */}
              {formData.game === 'minecraft' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 pt-2"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minecraft_type" className="text-slate-300">
                        Server Type <span className="text-sky-400">*</span>
                      </Label>
                      <Select value={formData.minecraft_type} onValueChange={(value) => handleChange('minecraft_type', value)}>
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white">
                          <SelectValue placeholder="Select server type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="vanilla" className="text-white hover:bg-slate-700">Vanilla (Standard)</SelectItem>
                          <SelectItem value="paper" className="text-white hover:bg-slate-700">Paper / Spigot (Plugins)</SelectItem>
                          <SelectItem value="fabric" className="text-white hover:bg-slate-700">Fabric (Mods)</SelectItem>
                          <SelectItem value="forge" className="text-white hover:bg-slate-700">Forge (Mods)</SelectItem>
                          <SelectItem value="neoforge" className="text-white hover:bg-slate-700">NeoForge (Mods)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minecraft_version" className="text-slate-300">
                        Game Version <span className="text-sky-400">*</span>
                      </Label>
                      <Input
                        id="minecraft_version"
                        value={formData.minecraft_version}
                        onChange={(e) => handleChange('minecraft_version', e.target.value)}
                        placeholder="e.g., 1.20.4 or 1.19.2"
                        className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500"
                        required={formData.game === 'minecraft'}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">
                  Message / Special Requests <span className="text-slate-500">(optional)</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any specific mods, plugins, or configurations you'd like?"
                  rows={4}
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || systemStatus === 'maintenance'}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-sky-500/40 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Request...
                  </span>
                ) : systemStatus === 'maintenance' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    Requests Temporarily Disabled
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Request
                  </span>
                )}
              </Button>

              <p className="text-center text-slate-500 text-sm">
                By submitting, you agree to use the server responsibly. Abuse will result in removal.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RequestForm.displayName = 'RequestForm';

export default RequestForm;