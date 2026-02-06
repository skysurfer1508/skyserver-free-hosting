import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import GameCard from './GameCard';
import { base44 } from '@/api/base44Client';

const games = ['minecraft', 'satisfactory', 'terraria'];

export default function GamesSection({ onGameSelect, hasRequested }) {
  const [availableSlots, setAvailableSlots] = useState(0);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configs = await base44.entities.SystemConfig.list();
        if (configs && configs.length > 0) {
          setAvailableSlots(configs[0].totalSlots - configs[0].claimedSlots);
        }
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };

    loadConfig();
    // Poll every 30 seconds for updates
    const interval = setInterval(loadConfig, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section id="games-section" className="relative py-32 bg-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
            <Gamepad2 className="w-4 h-4" />
            Choose Your Game
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Supported Games
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Select a game below to auto-fill the request form. More games coming soon!
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <GameCard 
              key={game}
              game={game}
              index={index}
              availableSlots={availableSlots}
              onSelect={onGameSelect}
              disabled={hasRequested}
            />
          ))}
        </div>

        {/* Coming Soon Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-slate-500 text-sm mt-12"
        >
          More games will be added based on demand. Have a request? Let us know in the form below!
        </motion.p>
      </div>
    </section>
  );
}