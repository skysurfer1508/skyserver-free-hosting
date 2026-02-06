import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, UserPlus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AuthService } from '@/components/auth/AuthService';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: 'weak', label: 'Weak', color: 'bg-red-500' });

  useEffect(() => {
    // Redirect if already logged in
    if (AuthService.isAuthenticated()) {
      window.location.href = createPageUrl('UserDashboard');
    }
  }, []);

  useEffect(() => {
    // Calculate password strength in real-time
    if (!password) {
      setPasswordStrength({ level: 'weak', label: 'Weak', color: 'bg-red-500', width: '0%' });
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length >= 8 && (hasSymbol || hasUpperCase) && hasNumber) {
      setPasswordStrength({ level: 'strong', label: 'Strong', color: 'bg-green-500', width: '100%' });
    } else if (length >= 6 && (hasNumber || hasUpperCase)) {
      setPasswordStrength({ level: 'medium', label: 'Medium', color: 'bg-yellow-500', width: '66%' });
    } else {
      setPasswordStrength({ level: 'weak', label: 'Weak', color: 'bg-red-500', width: '33%' });
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      AuthService.register(name, email, password);
      toast.success('Account created successfully!');
      window.location.href = createPageUrl('UserDashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
            <Server className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Skyserver</span>
        </Link>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl blur opacity-20" />
          
          <div className="relative p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400 mb-8">Sign up to get your free game server</p>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
                  required
                />
                {password && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        passwordStrength.level === 'strong' ? 'text-green-400' :
                        passwordStrength.level === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800/50 border-slate-700 focus:border-sky-500 text-white"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white"
              >
                {isLoading ? (
                  'Creating Account...'
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-slate-400">
              Already have an account?{' '}
              <Link to={createPageUrl('UserLogin')} className="text-sky-400 hover:text-sky-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}