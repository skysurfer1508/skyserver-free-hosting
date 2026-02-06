import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pickaxe, Factory, Worm, Flame } from 'lucide-react';

const gameIcons = {
  minecraft: Pickaxe,
  satisfactory: Factory,
  terraria: Worm
};

const gameColors = {
  minecraft: {
    gradient: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-500/25",
    border: "hover:border-emerald-500/50",
    bg: "from-emerald-500/10 to-emerald-500/5"
  },
  satisfactory: {
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/25",
    border: "hover:border-orange-500/50",
    bg: "from-orange-500/10 to-orange-500/5"
  },
  terraria: {
    gradient: "from-purple-500 to-violet-600",
    glow: "shadow-purple-500/25",
    border: "hover:border-purple-500/50",
    bg: "from-purple-500/10 to-purple-500/5"
  }
};

const gameData = {
  minecraft: {
    title: "Minecraft",
    subtitle: "Java & Bedrock Edition",
    description: "Build, explore, and survive in infinite worlds. Supports mods, plugins, and cross-play.",
    features: ["Vanilla & Modded", "Plugin Support", "Crossplay Ready"]
  },
  satisfactory: {
    title: "Satisfactory",
    subtitle: "Factory Building",
    description: "Build massive factories and automate production. Perfect for co-op sessions.",
    features: ["Multiplayer", "Mod Support", "Auto-Save"]
  },
  terraria: {
    title: "Terraria",
    subtitle: "Adventure Awaits",
    description: "Dig, fight, explore, and build in this action-packed adventure game.",
    features: ["Up to 16 Players", "TModLoader", "Journey Mode"]
  }
};

export default function GameCard({ game, onSelect, index, availableSlots }) {
  const Icon = gameIcons[game];
  const colors = gameColors[game];
  const data = gameData[game];
  
  const isLimited = availableSlots <= 3;
  const isHighDemand = game === 'satisfactory' && availableSlots <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative rounded-2xl bg-gradient-to-br ${colors.bg} border border-slate-800 ${colors.border} transition-all duration-500 overflow-hidden`}
    >
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colors.bg}`} />
      
      <div className="relative p-8">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 shadow-lg ${colors.glow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-1">{data.title}</h3>
        <p className="text-slate-500 text-sm mb-4">{data.subtitle}</p>

        {/* Description */}
        <p className="text-slate-400 mb-6 leading-relaxed">{data.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {data.features.map((feature, i) => (
            <span 
              key={i}
              className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-300 text-xs font-medium"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Availability Counter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Availability</span>
            {isHighDemand && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3" />
                Popular
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(availableSlots / 5) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className={`h-full rounded-full ${
                  isLimited 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500'
                }`}
              />
            </div>
            
            <Badge 
              variant="outline" 
              className={`${
                isLimited
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              } font-bold text-sm px-3 py-1`}
            >
              {availableSlots} {availableSlots === 1 ? 'slot' : 'slots'}
            </Badge>
          </div>
          
          <p className={`text-xs mt-2 font-medium ${
            isLimited ? 'text-orange-400' : 'text-emerald-400'
          }`}>
            {isLimited ? '⚠️ Limited Stock - Act Fast!' : '✓ Available Now'}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={() => onSelect(game)}
          className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-semibold py-6 rounded-xl transition-all duration-300 group-hover:shadow-lg ${colors.glow}`}
        >
          <span className="flex items-center justify-center gap-2">
            Select {data.title}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </motion.div>
  );
}