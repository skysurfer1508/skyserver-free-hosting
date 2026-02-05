import React from 'react';
import { Server, MessageCircle, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                <Server className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Skyserver</span>
            </div>
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Skyserver Student Project. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Discord Community
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by a student, for gamers.
          </p>
        </div>
      </div>
    </footer>
  );
}