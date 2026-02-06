import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Server, ExternalLink, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Skyserver</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* System Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
              <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-xs text-slate-300 font-medium">
                {systemStatus === 'operational' ? 'Systems Online' : 'Maintenance'}
              </span>
            </div>
            
            <button
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Help
            </button>
            <Button
              asChild
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <a href="https://panel.skyserver1508.org" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Panel Login
              </a>
            </Button>
            <Button
              onClick={() => document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold"
            >
              <Server className="w-4 h-4 mr-2" />
              Request Server
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-3"
            >
              {/* Mobile Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50">
                <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-xs text-slate-300 font-medium">
                  {systemStatus === 'operational' ? 'Systems Online' : 'Maintenance'}
                </span>
              </div>
              
              <button
                onClick={() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
              >
                Help
              </button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-slate-300 hover:text-white hover:bg-slate-800/50 justify-start"
              >
                <a href="https://panel.skyserver1508.org" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Panel Login
                </a>
              </Button>
              <Button
                onClick={() => {
                  document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold"
              >
                <Server className="w-4 h-4 mr-2" />
                Request Server
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}