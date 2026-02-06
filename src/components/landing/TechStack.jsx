import React from 'react';
import { motion } from 'framer-motion';
import { Container, Shield, Code, Server } from 'lucide-react';

const techStack = [
  {
    icon: Container,
    title: 'Dockerized',
    description: 'Full isolation for every game server using container technology.',
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-cyan-400'
  },
  {
    icon: Shield,
    title: 'DDoS Protection',
    description: 'Secured by Cloudflare Tunnels and Global CDN.',
    color: 'from-orange-500 to-amber-500',
    iconColor: 'text-amber-400'
  },
  {
    icon: Code,
    title: 'Modern Frontend',
    description: 'Blazing fast user interface built with the latest web standards.',
    color: 'from-purple-500 to-pink-500',
    iconColor: 'text-pink-400'
  },
  {
    icon: Server,
    title: 'Smart Management',
    description: 'Advanced orchestration for reliable uptime.',
    color: 'from-emerald-500 to-teal-500',
    iconColor: 'text-teal-400'
  }
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="relative py-24 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/10 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by Modern Technology
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built with industry-standard tools for maximum performance and security.
          </p>
        </motion.div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${tech.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Card */}
                <div className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${tech.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {tech.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                    {tech.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}