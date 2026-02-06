import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Server, ExternalLink, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState('operational');

  const games = [
    { name: 'Minecraft', id: 'minecraft' },
    { name: 'Terraria', id: 'terraria' },
    { name: 'Satisfactory', id: 'satisfactory' }
  ];

  const scrollToGame = (gameId) => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
      // Highlight or focus the specific game card if needed
    }
    setMobileMenuOpen(false);
    setGamesDropdownOpen(false);
  };

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
              onClick={() => document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </button>

            {/* Games Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setGamesDropdownOpen(true)}
              onMouseLeave={() => setGamesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                Games
                <ChevronDown className={`w-4 h-4 transition-transform ${gamesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {gamesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => scrollToGame(game.id)}
                        className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                      >
                        {game.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>

            <button
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
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
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              
              {/* Mobile Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 z-50 md:hidden overflow-y-auto"
              >
                {/* Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Mobile Status Indicator */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                    <span className="text-xs text-slate-300 font-medium">
                      {systemStatus === 'operational' ? 'Systems Online' : 'Maintenance'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    Home
                  </button>

                  {/* Games Section */}
                  <div>
                    <div className="px-4 py-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      Games
                    </div>
                    {games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => scrollToGame(game.id)}
                        className="w-full text-left px-6 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors text-sm"
                      >
                        {game.name}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    Features
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    FAQ
                  </button>

                  <div className="pt-4 border-t border-slate-800">
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
                  </div>

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
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}