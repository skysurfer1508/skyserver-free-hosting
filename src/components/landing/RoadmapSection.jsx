import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const milestones = [
  {
    phase: 'Phase 1: Foundation',
    status: 'completed',
    statusLabel: 'Completed',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    details: 'Website Launch, Docker Infrastructure Setup, Minecraft & Terraria Support.'
  },
  {
    phase: 'Phase 2: Automation',
    status: 'in_progress',
    statusLabel: 'In Progress',
    icon: Loader2,
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    details: 'Developing Discord Bot integration for automatic status updates.',
    pulse: true
  },
  {
    phase: 'Phase 3: Expansion',
    status: 'planned',
    statusLabel: 'Planned',
    icon: Clock,
    iconColor: 'text-slate-400',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    details: 'Adding support for Valheim and ARK: Survival Evolved.'
  },
  {
    phase: 'Phase 4: Community',
    status: 'future',
    statusLabel: 'Future',
    icon: Sparkles,
    iconColor: 'text-slate-500',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    details: 'User Dashboard 2.0 with automatic backup management.'
  }
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-32 bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent" />
      
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            What's Coming
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Project Roadmap
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Track our progress and see what exciting features we're building next.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-slate-700 to-slate-800" />

          {/* Milestones */}
          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.phase}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6"
                >
                  {/* Icon Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full bg-slate-800 border-2 ${
                      milestone.status === 'completed' ? 'border-emerald-500' : 
                      milestone.status === 'in_progress' ? 'border-amber-500' : 
                      'border-slate-700'
                    } flex items-center justify-center z-10 relative`}>
                      <Icon className={`w-7 h-7 ${milestone.iconColor} ${milestone.pulse ? 'animate-spin' : ''}`} />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-grow pb-8">
                    <div className="relative">
                      {/* Glow Effect */}
                      {milestone.status === 'in_progress' && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 animate-pulse" />
                      )}
                      
                      <div className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-white">
                            {milestone.phase}
                          </h3>
                          <Badge className={`${milestone.badgeColor} border`}>
                            {milestone.statusLabel}
                          </Badge>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {milestone.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm">
            Have a feature request? Let us know via Discord or the contact form!
          </p>
        </motion.div>
      </div>
    </section>
  );
}