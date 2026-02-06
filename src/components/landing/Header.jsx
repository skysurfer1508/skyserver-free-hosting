import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Server, ExternalLink, Menu, X, ChevronDown, LogIn, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../pages/utils';
import { AuthService } from '../auth/AuthService';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesAccordionOpen, setGamesAccordionOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState('operational');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setCurrentUser(AuthService.getCurrentUser());
      }
    };

    checkAuth();
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const games = [
    { name: 'Minecraft', id: 'minecraft' },
    { name: 'Terraria', id: 'terraria' },
    { name: 'Satisfactory', id: 'satisfactory' }
  ];

  const scrollToGame = (gameId) => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
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
          {/* Left Side: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Skyserver</span>
            </div>
          </div>

          {/* Middle: Spacer */}
          <div className="flex-grow" />

          {/* Right Side: Status + Action Buttons */}
          <div className="flex items-center gap-3">
            {/* System Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
              <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-xs text-slate-300 font-medium">
                {systemStatus === 'operational' ? 'Systems Online' : 'Maintenance'}
              </span>
            </div>

            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 hidden sm:flex"
                >
                  <Link to={createPageUrl('UserDashboard')}>
                    <User className="w-4 h-4 mr-2" />
                    My Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    AuthService.logout();
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                    window.location.href = createPageUrl('Home');
                  }}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold"
              >
                <Link to={createPageUrl('Login')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              
              {/* Sidebar Panel (Slides from Left) */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 h-screen w-80 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                      <Server className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-2">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    Home
                  </button>

                  {/* Games Accordion */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setGamesAccordionOpen(!gamesAccordionOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                    >
                      <span>Games</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${gamesAccordionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {gamesAccordionOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {games.map((game) => (
                            <button
                              key={game.id}
                              onClick={() => scrollToGame(game.id)}
                              className="w-full text-left px-8 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors text-sm"
                            >
                              {game.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    Roadmap
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

                  <button
                    onClick={() => {
                      document.getElementById('tech-stack')?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-medium"
                  >
                    Tech Stack
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}