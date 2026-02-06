import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, Shield, Sparkles, Heart, Rocket } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: "24/7 Uptime",
    description: "Your server stays online around the clock, so you can play whenever you want."
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade protection keeps your server safe from attacks."
  },
  {
    icon: Sparkles,
    title: "Easy Setup",
    description: "No technical knowledge required. Request and we'll handle the rest."
  },
  {
    icon: Rocket,
    title: "Swiss Hosted Infrastructure 🇨🇭",
    description: "Located in the heart of Europe for ultra-low latency and maximum stability. Optimized for EU players."
  }
];

export default function TrustSection() {
  return (
    <section className="relative py-32 bg-slate-950">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Trust Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Built with Passion
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why is it <span className="text-sky-400">Free</span>?
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/25">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mt-4">
                "I'm a student building this infrastructure as my <span className="text-sky-400 font-semibold">final school project</span>. 
                You get free, high-quality game server hosting — and I get to test my skills in a real-world environment. 
                <span className="text-white font-medium"> No hidden fees. No credit card required. No catch.</span>"
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Student Project
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  Non-Profit
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  Community Driven
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/30 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-sky-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}